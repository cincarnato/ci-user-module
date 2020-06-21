import {createRole, findPermissions, findRole, findRoles, deleterole, updaterole} from '../../services/RoleService'
import {SECURITY_ROLE_CREATE, SECURITY_ROLE_SHOW, SECURITY_ROLE_DELETE, SECURITY_ROLE_EDIT} from "../../permissions";
import {AuthenticationError, ForbiddenError} from "apollo-server-express";

export default {
    Query: {
        permissions: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findPermissions()
        },
        roles: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findRoles()
        },
        role: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findRole(id)
        },
    },
    Mutation: {
        roleCreate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_CREATE)) throw new ForbiddenError("Not Authorized")
            return createRole(input)
        },
         roleUpdate: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SECURITY_ROLE_EDIT)) throw new ForbiddenError("Not Authorized")
            return updaterole(user, id, input)
        },
         roleDelete: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SECURITY_ROLE_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleterole(id)
        },
    }

}
