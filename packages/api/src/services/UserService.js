import User from '../models/UserModel'
import '../models/GroupModel'
import {createUserAudit} from '../services/UserAuditService'
import bcryptjs from 'bcryptjs'
import UserEmailManager from './UserEmailManager'
import {findRoleByName} from "./RoleService";
import {UserInputError} from 'apollo-server-express'
import path from 'path'
import fs from 'fs'
import jsonwebtoken from 'jsonwebtoken'
import {createSession} from "./SessionService";
import {createLoginFail} from "./LoginFailService";

export const hashPassword = function (password) {
    let salt = bcryptjs.genSaltSync(10);
    let hashPassword = bcryptjs.hashSync(password, salt);
    return hashPassword;
}

export const auth = async function ({username, password}, req) {
    return new Promise((resolve, reject) => {
        findUserByUsername(username).then(user => {

            if (!user) {
                reject('UserDoesntExist')
            }

            if(!user.active){
                reject('DisabledUser')
            }
            
            if (user) {
                if (bcryptjs.compareSync(password, user.password)) {
                    //Registrar session
                    createSession(user, req).then(newSession => {

                        let token = jsonwebtoken.sign(
                            {
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                email: user.email,
                                phone: user.phone,
                                role: user.role,
                                groups: user.groups,
                                avatarurl: user.avatarurl,
                                idSession: newSession.id
                            },
                            process.env.JWT_SECRET,
                            {expiresIn: process.env.JWT_LOGIN_EXPIRED_IN || '1d'}
                        )
                        resolve({token: token})
                    })
                } else {
                    createLoginFail(username, req)
                    reject('BadCredentials')
                }
            }
        })

    })

}


export const createUser = async function ({username, password, name, email, phone, role, groups, active}, actionBy = null) {


    const newUser = new User({
        username,
        email,
        password: hashPassword(password),
        name,
        phone,
        active,
        role,
        groups,
        createdAt: Date.now()

    })

    return new Promise((resolve, rejects) => {
        newUser.save((error, doc) => {
            if (error) {
                if (error.name == "ValidationError") {
                    rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                rejects(error)
            } else {
                createUserAudit(actionBy ? actionBy.id : null, doc._id, 'userCreated')
                doc.populate('role').populate('groups').execPopulate(() => (resolve(doc))
                )
            }
        })
    })
}


export const updateUser = async function (id, {username, name, email, phone, role, groups, active}, actionBy = null) {
    let updatedAt = Date.now()

    return new Promise((resolve, rejects) => {
        User.findOneAndUpdate(
            {_id: id}, {username, name, email, phone, role, groups, active, updatedAt}, {
                new: true,
                runValidators: true,
                context: 'query'
            },
            (error, doc) => {
                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                    }
                    rejects(error)
                } else {
                    createUserAudit(actionBy ? actionBy.id : null, doc._id, 'userModified')
                    doc.populate('role').populate('groups').execPopulate(() => resolve(doc))
                }
            }
        );
    })
}

export const deleteUser = function (id, actionBy = null) {
    return new Promise((resolve, rejects) => {

        findUser(id).then((doc) => {
            doc.softdelete(function (err) {
                createUserAudit(actionBy ? actionBy.id : null, doc._id, 'userDeleted')
                err ? rejects(err) : resolve({success: true, id: id})
            });
        })

    })
}

export const registerUser = async function ({username, password, name, email, phone}) {

    const ROLE_NAME = "operator";
    let roleObject = await findRoleByName(ROLE_NAME)

    return new Promise((resolve, rejects) => {

        let active = false;

        const newUser = new User({
            username,
            email,
            password: hashPassword(password),
            name,
            phone,
            active,
            role: roleObject,
            createdAt: Date.now()

        })
        newUser.id = newUser._id;

        newUser.save((error => {
            if (error) {
                if (error.name == "ValidationError") {
                    rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                rejects(error)
            } else {
                let token = jsonwebtoken.sign(
                    {
                        id: newUser.id,
                        username: newUser.username,
                        role: {name: roleObject.name},
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: process.env.JWT_REGISTER_EXPIRED_IN || '30d'}
                )
                let url = process.env.APP_WEB_URL + "/activation-user/" + token
                createUserAudit(newUser.id, newUser.id, 'userRegistered')
                UserEmailManager.activation(newUser.email, url, newUser);
                resolve({status: true, id: newUser.id, email: newUser.email});
            }
        }))

    })

}

export const activationUser = function (id) {
    return new Promise((resolve, rejects) => {
        let active = true;
        User.findOneAndUpdate({_id: id}, {active}, (error, user) => {
            if (error) {
                rejects({status: false, message: "Error al activar el usuario"})
            } else {
                createUserAudit(user._id, user._id, 'userActivated')
                resolve({status: true, message: "Se activo correctamente la cuenta"})
            }
        })
    })
}

export const findUsers = function () {
    return new Promise((resolve, reject) => {
        User.find({}).isDeleted(false).populate('role').populate('groups').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}


export const paginateUsers = function (limit, pageNumber = 1, search = null, orderBy = null, orderDesc = false) {

    function getQuery(search) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    {name: {$regex: search, $options: 'i'}},
                    {username: {$regex: search, $options: 'i'}},
                    {email: {$regex: search, $options: 'i'}},
                    {phone: {$regex: search, $options: 'i'}}
                ]
            }
        }
        return qs
    }

    function getSort(orderBy, orderDesc) {
        if (orderBy) {
            return (orderDesc ? '-' : '') + orderBy
        } else {
            return null
        }
    }


    let query = {deleted: false, ...getQuery(search)}
    let populate = ['role', 'groups']
    let sort = getSort(orderBy, orderDesc)

    let params = {page: pageNumber, limit: limit, populate: populate, sort}
    console.log(params)
    return new Promise((resolve, reject) => {
        User.paginate(query, params).then(result => {
                resolve({users: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}

export const findUser = function (id) {
    return new Promise((resolve, reject) => {
        User.findOne({_id: id}).populate('role').populate('groups').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findUserByUsername = function (name) {
    return new Promise((resolve, reject) => {
        User.findOne({username: name}).populate('role').populate('groups').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}


export const changePasswordAdmin = function (id, {password, passwordVerify}, actionBy = null) {
    console.log('admin', password)
    if (password == passwordVerify) {

        return new Promise((resolve, rejects) => {
            User.findOneAndUpdate(
                {_id: id}, {password: hashPassword(password)}, {new: true},
                (error, doc) => {
                    if (error) {
                        rejects({status: false, message: "Falla al intentar modificar password"})
                    } else {
                        createUserAudit(actionBy.id, id, (actionBy.id === id) ? 'userPasswordChange' : 'changePasswordAdmin')
                        resolve({success: true, message: "PasswordChange", operation: "changePasswordAdmin"})
                    }
                }
            );
        })


    } else {
        return new Promise((resolve, rejects) => {
            resolve({status: false, message: "Las password no concuerdan"})
        })
    }
}

export const changePassword = async function (id, {currentPassword, newPassword}, actionBy = null) {

    let user = await User.findOne({_id: id})

    if (bcryptjs.compareSync(currentPassword, user.password)) {

        return new Promise((resolve, rejects) => {
            User.findOneAndUpdate(
                {_id: id}, {password: hashPassword(newPassword)}, {new: true},
                (error, doc) => {
                    if (error) {
                        rejects({status: false, message: "Falla al intentar modificar password"})
                    } else {
                        createUserAudit(actionBy.id, id, (actionBy.id === id) ? 'userPasswordChange' : 'adminPasswordChange')
                        resolve({success: true, message: "PasswordChange", operation: "changePassword"})
                    }
                }
            );
        })

    } else {
        return new Promise((resolve, rejects) => {
            resolve({status: false, message: "La contraseña actual no coincide con la del sistema", operation: "changePassword"})
        })
    }
}

export const changeRecoveryPassword = function (id, {newPassword}, actionBy = null) {

    console.log('changeRecoveryPassword', id)

    if (newPassword) {

        return new Promise((resolve, rejects) => {
            User.findOneAndUpdate(
                {_id: id}, {password: hashPassword(newPassword)}, {new: true},
                (error, doc) => {
                    if (error) {
                        rejects({success: false, message: "Falla al intentar modificar password"})
                    } else {
                        createUserAudit(actionBy.id, id, (actionBy.id === id) ? 'userPasswordChange' : 'adminPasswordChange')
                        resolve({success: true, message: "PasswordChange", operation: "changeRecoveryPassword"})
                    }
                }
            );
        })


    } else {
        return new Promise((resolve, rejects) => {
            resolve({status: false, message: "Las password no concuerdan"})
        })
    }
}


export const recoveryPassword = function (email) {

    return new Promise((resolve, rejects) => {
        User.findOne({email: email}).populate('role').then((user) => {
            if (user) {
                let token = jsonwebtoken.sign(
                    {
                        id: user.id,
                        username: user.username,
                        role: {name: user.role.name}
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: '1d'}
                )
                let url = process.env.APP_WEB_URL + "/reset-password/" + token

                UserEmailManager.recovery(email, url, user)
                createUserAudit(user.id, user.id, 'passwordRecovery')
                resolve({status: true, message: "Se envio un mail para recuperar tu contraseña"})
            } else rejects({status: false, message: "No se encontro el usuario"})
        }).catch((error) => {
            if (error) rejects({status: false, message: "Fallo interno del servidor "})
        })
    })
}


export const avatarUpload = async function (user, file) {

    //@TODO validate image size, extension
    const {filename, mimetype, encoding, createReadStream} = await file;


    const parseFileName = path.parse(filename);
    const finalFileName = user.username + parseFileName.ext

    const rs = createReadStream()
    const dst = path.join("media", "avatar", finalFileName)
    var wstream = fs.createWriteStream(dst);
    rs.pipe(wstream);

    const rand = randomstring(3)
    const url = process.env.APP_API_URL + "/media/avatar/" + finalFileName + "?" + rand


    return new Promise((resolve, rejects) => {
        User.findOneAndUpdate(
            {_id: user.id}, {avatar: finalFileName, avatarurl: url}, {useFindAndModify: false},
            (error) => {
                if (error) {
                    rejects({status: false, message: "Falla al intentar guardar el avatar en la DB"})
                } else {
                    createUserAudit(user.id, user.id, 'avatarChange')
                    resolve({filename, mimetype, encoding, url})
                }
            }
        );
    })


    return {filename, mimetype, encoding, url};
}

function randomstring(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export const findUsersGroup = function (group) {
    return new Promise((resolve, reject) => {
        User.find({groups: group.id}).then(users => {
            resolve(users)
        }).catch(err => {
            reject(err)
        })
    })
}


export const setUsersGroups = function (group, users) {

    function getDeletePromises(oldUsers) {
        return oldUsers.map((oldUser) => {
            let index = users.indexOf(oldUser.id)
            if (index !== -1) {
                users.splice(index, 1)
            } else {
                // console.log("Deleting user " + oldUser.username + ' for ' + group.id)
                return User.findOneAndUpdate(
                    {_id: oldUser.id},
                    {$pullAll: {groups: [group.id]}},
                    {new: true, runValidators: true, context: 'query'}
                )
            }
        });
    }

    function getPushPromises() {
        return users.map(user => {
            // console.log("Adding user " + user + ' for ' + group.id)
            return User.findOneAndUpdate(
                {_id: user},
                {$push: {groups: group.id}},
                {new: true, runValidators: true, context: 'query'},
            )
        });
    }

    return new Promise(async (resolve, reject) => {

        //0. Find actual users with this group
        let oldUsers = await findUsersGroup(group)

        //1. Delete group for old users that doesnt exist anymore
        let deletePromises = getDeletePromises(oldUsers)

        Promise.all(deletePromises).then(() => {
            console.log("All Delete Promise Finish")
            //2. Push group in new users
            let pushPromises = getPushPromises()

            Promise.all(pushPromises).then(() => {
                console.log("All Push Promise Finish")
                resolve(true)
            }).catch(err => reject(err))

        }).catch(err => reject(err))


    })
}
