import {createRole, findRoleByName, updatepermissions} from './RoleService'
import {createUser, findUserByUsername} from './UserService'
import {adminRole, operatorRole} from '../roles'
import {rootUser} from '../data/root-user'

function checkOrCreateRoleAdmin() {

    return new Promise((resolve, reject) => {

        findRoleByName(adminRole.NAME).then(role => {
            if (!role) {
                createRole({name: adminRole.NAME, permissions: adminRole.PERMISSIONS}).then(newRole => {
                    console.log("RoleModel admin created: ", newRole.id)
                    resolve(newRole)
                })
            } else {
                updatepermissions(role.id,{name:adminRole.NAME, permissions: adminRole.PERMISSIONS}).then(response => {
                    console.log("RoleModel admin found: ", role.id)
                    console.log("Updated permissions")
                    resolve(role)
                })
               
            }
        }).catch(err => reject(err))

    })

}

function checkOrCreateRoleOperator() {
    findRoleByName(operatorRole.NAME).then(roleUser => {
        if (!roleUser) {
            createRole({name: operatorRole.NAME, permissions: operatorRole.PERMISSIONS})
                .then(roleUserNew => console.log("RoleModel operator created: ", roleUserNew.id))
                .catch(err => console.error(err))
        } else {
            console.log("RoleModel user found: ", roleUser.id)
        }
    })
}

export const initSecurity = async function () {

    //User ROLE
    await checkOrCreateRoleOperator();

    //Admin ROLE
    let roleAdmin = await checkOrCreateRoleAdmin()
    let user = await findUserByUsername(rootUser.username)

    if (!user) {
        user = await createUser({...rootUser, role: roleAdmin.id})
        console.log("User root created: ", user.id)

    } else {
        console.log("User root found: ", user.id)
    }


}


