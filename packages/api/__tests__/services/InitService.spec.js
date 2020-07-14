const mongoHandler = require('../utils/mongo-handler');

//Init DB
import {initPermissions,initAdminRole,initRootUser} from "../../src/services/InitService";

import {findUserByUsername} from "../../src/services/UserService";
import {findRoleByName} from "../../src/services/RoleService";

describe("TokenService", () => {


    afterAll(async  () => {
        await mongoHandler.clearDatabase();
        await mongoHandler.closeDatabase();
    })

    test('Token Ok', async () => {

        await mongoHandler.connect()
        await initPermissions()
        await initPermissions(["FOO", "BAR"])
        await initAdminRole()
        await initRootUser()

        let role = await findRoleByName("admin")
        console.log(role)

        expect(role.permissions).toContain('FOO');

    });
})