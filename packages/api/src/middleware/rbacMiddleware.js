import rbacPromise from '../rbac'


export default async function (req, res, next) {

    try {
        let user = req.user;
        const rbac = await rbacPromise()
        if (user) {
            rbac.addUserRoles(user.id, [user.role.name])
        }
        req.rbac = rbac;
        next();
    } catch (error) {
        console.error(error)
        next(error);
    }

}

