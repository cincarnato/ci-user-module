import {
    createUser,
    updateUser,
    deleteUser,
    findUsers,
    findUser,
    auth,
    changePasswordAdmin,
    changePassword,
    changeRecoveryPassword,
    registerUser,
    recoveryPassword,
    avatarUpload,
    activationUser, paginateUsers
} from '../../services/UserService'
import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {SECURITY_USER_CREATE, SECURITY_USER_DELETE, SECURITY_USER_EDIT, SECURITY_USER_SHOW} from "../../permissions";

export default {
    Query: {
        users: (_, {}, {user, rbac}) => {
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return findUsers()
        },
        user: (_, {id}, {user, rbac}) => {
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return findUser(id)
        },
        me: (_, {}, {user}) => {
            return findUser(user.id)
        },
        paginateUsers: (_, {limit, pageNumber, search, orderBy, orderDesc}, {user, rbac}) => {
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateUsers(limit, pageNumber, search, orderBy, orderDesc)
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

        },
        createUser: (_, {input}, {user, rbac}) => {
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_CREATE)) throw new ForbiddenError("Not Authorized")
            return createUser(input, user)
        },
        updateUser: (_, {id, input}, {user, rbac}) => {
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")
            return updateUser(id, input, user)
        },
        deleteUser: (_, {id}, {user, rbac}) => {
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteUser(id, user)
        },
        changePasswordAdmin: (_, {id, password, passwordVerify}, {user, rbac}) => {
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")
            return changePasswordAdmin(id, {password, passwordVerify}, user)
        },
        changePassword: (_, {currentPassword, newPassword}, {user}) => {
            if (!user) throw new AuthenticationError("Usuario no autenticado")
            return changePassword(user.id, {currentPassword, newPassword}, user)
        },
        changeRecoveryPassword: (_, {newPassword}, {user}) => {
            if (!user) throw new AuthenticationError("Usuario no autenticado")
            return changeRecoveryPassword(user.id, {newPassword}, user)
        },
        register: (_, {input}) => {
            return registerUser(input)
        },
        recoveryPassword: (_, {email}) => {
            return recoveryPassword(email)
        },
        avatarUpload: (_, {file}, {user}) => {
            if (!user) throw new AuthenticationError("Usuario no autenticado")
            return avatarUpload(user, file)
        },
        activationUser: (_, {id}) => {
            return activationUser(id)
        }
    }

}
