import {
    createUser,
    updateUser,
    deleteUser,
    findUsers,
    findUser,
    changePasswordAdmin,
    paginateUsers
} from '../../services/UserService'

import {
    AuthenticationError,
    ForbiddenError
} from "apollo-server-express";

import {
    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW
} from "../../permissions";

export default {
    Query: {
        users: (_, {}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return findUsers()
        },
        user: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return findUser(id)
        },
        paginateUsers: (_, {limit, pageNumber, search, orderBy, orderDesc}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateUsers(limit, pageNumber, search, orderBy, orderDesc)
        },
    },
    Mutation: {

        createUser: (_, {input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_CREATE)) throw new ForbiddenError("Not Authorized")
            return createUser(input, user)
        },
        updateUser: (_, {id, input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")
            return updateUser(id, input, user)
        },
        deleteUser: (_, {id}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteUser(id, user)
        },
        changePasswordAdmin: (_, {id, password, passwordVerify}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")
            if (!user || !rbac.isAllowed(user.id, SECURITY_USER_EDIT)) throw new ForbiddenError("Not Authorized")
            return changePasswordAdmin(id, {password, passwordVerify}, user)
        }
    }

}
