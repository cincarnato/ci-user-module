import RoleModel from '../models/RoleModel'
import * as permissions from '../permissions'

export const findPermissions = function () {
    return new Promise((resolve, reject) => {
        resolve({ permissions: Object.values(permissions) })
    })
}

export const createRole = function ({ name, permissions }) {
    const newRole = new RoleModel({
        name,
        permissions
    })
    newRole.id = newRole._id;
    return new Promise((resolve, rejects) => {
        newRole.save((error => {
            error ? rejects(error) : resolve(newRole)
        }))
    })
}

export const findRoles = function () {
    return new Promise((resolve, reject) => {
        RoleModel.find({}).isDeleted(false).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findRole = function (id) {
    return new Promise((resolve, reject) => {
        RoleModel.findOne({ _id: id }).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findRoleByName = function (roleName) {
    return new Promise((resolve, reject) => {
        RoleModel.findOne({ name: roleName }).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}


export const deleterole = function (id) {
    return new Promise((resolve, rejects) => {
        findRole(id).then((doc) => {
            doc.softdelete(function (err) {
                err ? rejects(err) : resolve({ id: id, success: true })
            });
        })
    })
}

export const updatepermissions = async function (id,{ name, permissions }) {

    return new Promise((resolve, rejects) => {
        RoleModel.findOneAndUpdate({ _id: id },{ name, permissions },
            { new: true, runValidators: true, context: 'query' },
            (error,res) => {
                if(error){
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                    }
                    rejects(error)
                }

                resolve(res)
            }
        )
        
    })

}

export const updaterole = async function (user, id, { name, permissions = [] }) {
    return new Promise((resolve, rejects) => {
        RoleModel.findOneAndUpdate({ _id: id },
            { name, permissions },
            { new: true, runValidators: true, context: 'query' },
            (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        rejects(new UserInputError(error.message, { inputErrors: error.errors }));
                    }
                    rejects(error)
                }

                resolve(doc)
            })
    })
}

