import User from "../models/UserModel";
import {createUserAudit} from "./UserAuditService";
import jsonwebtoken from "jsonwebtoken";
import UserEmailManager from "./UserEmailManager";
import {hashPassword} from "./UserService";

export const recoveryChangePassword = function (id, {newPassword}, actionBy = null) {

    console.log('changeRecoveryPassword', id)

    if (newPassword.length > 0) {

        return new Promise((resolve, rejects) => {
            User.findOneAndUpdate(
                {_id: id}, {password: hashPassword(newPassword)}, {new: true},
                (error) => {
                    console.log('Promise Recovery Done')

                    if (error) {
                        rejects({status: false, message: "common.operation.fail"})
                    } else {
                        createUserAudit(actionBy.id, id, (actionBy.id === id) ? 'userPasswordChange' : 'adminPasswordChange')
                        resolve({status: true, message: "common.operation.success"})
                    }
                }
            );
        })


    } else {
        return new Promise((resolve, rejects) => {
            resolve({status: false, message: "common.operation.fail"})
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
                        role: user.role
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: '1d'}
                )
                let url = process.env.APP_WEB_URL + "/recovery/" + token

                UserEmailManager.recovery(email, url, user).then(result => {
                    createUserAudit(user.id, user.id, 'passwordRecovery')
                    resolve({status: result, message: 'common.operation.success'})
                }).catch(error => {
                    rejects(new Error('common.operation.fail'))
                })


            } else resolve({status: false, message: "user.notFound"})
        }).catch((error) => {
            if (error) rejects(new Error('common.operation.fail'))
        })
    })
}