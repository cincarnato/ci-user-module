
import {UserRbacFactory} from "../services/RbacService";


export default async function (req, res, next) {
    try {
        const rbac = UserRbacFactory(req.user)
        req.rbac = rbac;
        next()
    } catch (error) {
        console.error("Rbac Middleware error:", error)
        next(error);
    }

}

