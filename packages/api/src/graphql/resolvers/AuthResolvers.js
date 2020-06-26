import {
    findUser,
} from '../../services/UserService'
import {auth} from "../../services/AuthService";

import {AuthenticationError} from "apollo-server-express";

export default {
    Query: {
        me: (_, {}, {user}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            return findUser(user.id)
        },
    },
    Mutation: {
        auth: (_, {username, password}, {req}) => {

            return new Promise(((resolve, reject) => {
                auth({username, password}, req)
                    .then(result => resolve(result))
                    .catch(err => {
                        console.warn('Auth error: ', err.message)
                        reject(new AuthenticationError("BadCredentials"))
                    })
            }))

        }
    }

}
