import {createRole, findRoleByName, fetchRolesInName, updateRole} from './RoleService'
import {changeRecoveryPassword, createUser, findUserByUsername} from './UserService'
import {createPermission, fetchPermissionsInName} from './PermissionService'
import {adminRole, INIT_USER_ADMIN, operatorRole} from '../roles'
import {rootUser} from '../data/root-user'
import {
    SECURITY_DASHBOARD_SHOW,
    SECURITY_GROUP_CREATE,
    SECURITY_GROUP_DELETE,
    SECURITY_GROUP_EDIT,
    SECURITY_GROUP_SHOW,
    SECURITY_ROLE_CREATE, SECURITY_ROLE_EDIT,
    SECURITY_ROLE_SHOW,
    SECURITY_ROLE_DELETE,
    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW,
} from "../../permissions";

const initPermissions = async (permissions) => {
    if (!permissions) {
        permissions = [SECURITY_USER_CREATE, SECURITY_USER_EDIT, SECURITY_USER_DELETE, SECURITY_USER_SHOW,
            SECURITY_GROUP_CREATE, SECURITY_GROUP_EDIT, SECURITY_GROUP_DELETE, SECURITY_GROUP_SHOW,
            SECURITY_ROLE_CREATE, SECURITY_ROLE_SHOW, SECURITY_ROLE_EDIT, SECURITY_ROLE_DELETE,
            SECURITY_DASHBOARD_SHOW]
    }
    //Fetch permissions already created
    let permissionsFound = fetchPermissionsInName(permissions)
    //Filter permissions created (avoid duplicate)
    let permissionToCreate = permissions.filter(p => !permissionsFound.some(f => f.name == p))
    // Exec All Create Promises
    let permissionsCreated = await Promise.all(permissionToCreate.map(name => createPermission(name)))
    permissionsCreated.forEach(p => {
        console.log("Permissions Created: " + p.name + " " + p.id )
    })
}

const initRoles = async (roles) => {
    if (!roles) {
        roles = [adminRole, operatorRole]
    }
    let rolesName = roles.map(r => r.name)
    //Fetch roles already created
    let rolesFound = fetchRolesInName(rolesName)
    //Filter roles created (avoid duplicate)
    let rolesToCreate = roles.filter(r => !rolesFound.some(f => f.name == r.name))
    // Exec All Create Promises
    let rolesCreated = await Promise.all(rolesToCreate.map(role => createRole(role)))
    rolesCreated.forEach(r => {
        console.log("Role Created: " + r.name + " " + r.id)
    })

    //Filter roles to update (reload permissions)
    let rolesToUpdate = roles.filter(r => rolesFound.some(f => f.name == r.name))
    // Exec All Create Promises
    let rolesUpdated = await Promise.all(rolesToUpdate.map(role => updateRole(role)))
    rolesUpdated.forEach(r => {
        console.log("Role Updated: " + r.name + " " + r.id)
    })
}

const initRootUser = async (user) => {
    if (!user) {
        user = rootUser
    }

    let roleAdmin = findRoleByName("admin")

    if (!roleAdmin) {
        throw Error('Root user cant be created. Role "admin" not found. ')
    }

    let u = await findUserByUsername(user.username)

    if (!u) {
        u = await createUser({...user, role: roleAdmin.id})
        console.log("User root created: ", u.id)
    } else {
        console.log("User root found: ", u.id)
    }

}



const rootRecover = async (password = "root.123") => {
    findUserByUsername("root").then(rootUser => {
        changeRecoveryPassword(rootUser.id, {
            newPassword: password,
        },rootUser).then(result => {
            console.log(result)
        })
    })
}


export {initPermissions, initRoles, initRootUser, rootRecover}