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


            if (rbac.isAllowed(user.id, SECURITY_USER_CREATE)){

                //With childRoles
                if(user.role.childRoles.length > 0){
                    //Check if role is include as a childRole
                    if(user.role.childRoles.includes(input.role)){
                        return createUser(input, user)
                    }else{
                        throw new ForbiddenError("Not Authorized")
                    }
                //Whitout childRoles
                }else{
                    return createUser(input, user)
                }

            } else{
                throw new ForbiddenError("Not Authorized")
            }
        },
        updateUser: (_, {id, input}, {user, rbac}) => {
            if (!user) throw new AuthenticationError("UNAUTHENTICATED")

            if (rbac.isAllowed(user.id, SECURITY_USER_EDIT)){

                //With childRoles
                if(user.role.childRoles.length > 0){
                    //Check if role is include as a childRole
                    if(user.role.childRoles.includes(input.role)){
                        return updateUser(id, input, user)
                    }else{
                        throw new ForbiddenError("Not Authorized")
                    }
                    //Whitout childRoles
                }else{
                    return updateUser(id, input, user)
                }

            } else{
                throw new ForbiddenError("Not Authorized")
            }

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
