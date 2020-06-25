import bcryptjs from "bcryptjs";
import {createSession} from "./SessionService";
import jsonwebtoken from "jsonwebtoken";
import {createLoginFail} from "./LoginFailService";
import {findUserByUsername} from "./UserService";

export const session = function (user, req) {
    return new Promise((resolve, reject) => {
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

            resolve(token)

        }).catch(err => {
            console.error(err)
            reject(err)
        })
    })


}

export const auth = async function ({username, password}, req) {
    return new Promise((resolve, reject) => {
        findUserByUsername(username).then(user => {

            if (!user) {
                reject('UserDoesntExist')
            }

            if (!user.active) {
                reject('DisabledUser')
            }

            if (user) {
                if (bcryptjs.compareSync(password, user.password)) {
                    //Registrar session
                    session(user, req).then(token => {
                        resolve({token: token})
                    }).catch(err => reject(err))

                } else {
                    createLoginFail(username, req)
                    reject('BadCredentials')
                }
            }
        })

    })

}