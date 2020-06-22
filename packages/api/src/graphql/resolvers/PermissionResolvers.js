import {fetchPermissions} from '../../services/PermissionService'
import {AuthenticationError, ForbiddenError} from "apollo-server-express";
import {SECURITY_ROLE_SHOW} from "../../permissions";

export default {
    Query: {
        permissions: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!user || !rbac.isAllowed(user.id, SECURITY_ROLE_SHOW)) throw new ForbiddenError("Not Authorized")
            return new Promise(((resolve, reject) => {
                fetchPermissions().then(permissions  => {
                    resolve(permissions.map(p => p.name))
                }).catch(e => reject(e))
            }))
        },

    }



}
