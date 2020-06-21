//Mock
import {createMockClient} from 'mock-apollo-client';
const mockGqlClient = createMockClient();

//Resolvers
import dashboardData from "./resolves/dashboardData";
import groupsPaginate from "./resolves/groupsPaginate";
import users from "./resolves/users";
import userPaginate from "./resolves/userPaginate";
import changePasswordAdmin from "./resolves/changePasswordAdmin";
import roles from "./resolves/roles";
import groups from "./resolves/groups";
import permissions from "./resolves/permissions";
import avatarUpload from "./resolves/avatarUpload";
import authSuccessful from "./resolves/auth-successful";
import authBadCredentials from "./resolves/auth-badCredentials";
import recoveryByEmail from "./resolves/recoveryByEmail";
import register from "./resolves/register";


//Helpers
import uuidv4 from "./helpers/uuidv4";
import getRoleById from "./helpers/getRoleById";
import getUserById from "./helpers/getUserById";



mockGqlClient.setRequestHandler(
    require('../src/providers/gql/recoveryByEmail.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(recoveryByEmail), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/avatarUpload.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(avatarUpload), 2000)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/dashboardData.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(dashboardData), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groupsPaginate.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(groupsPaginate), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groupCreate.graphql'),
    ({name, color, users}) => {
        return new Promise((resolve) => {
            let id = uuidv4()
            users = users.map(user => getUserById(user))
            let r = {data: {groupCreate: {id, name, color, users}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groupUpdate.graphql'),
    ({id, name, color, users}) => {
        return new Promise((resolve) => {
            users = users.map(user => getUserById(user))
            let r = {data: {groupUpdate: {id, name, color, users}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groupDelete.graphql'),
    (id) => {
        return new Promise((resolve) => {
            let r = {data: {groupDelete: {id: id, deleteSuccess: true}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/users.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(users), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userPaginate.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(userPaginate), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userCreate.graphql'),
    ({username, password, name, email, phone, role, groups, active}) => {
        return new Promise((resolve) => {
            let id = uuidv4()
            role = getRoleById(role)
            let avatarurl = null
            let r = {data: {createUser: {id, username, password, name, email, phone, role, groups, active, avatarurl}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userUpdate.graphql'),
    ({id, username, password, name, email, phone, role, groups, active}) => {
        return new Promise((resolve) => {
            role = getRoleById(role)
            let avatarurl = null
            let r = {data: {updateUser: {id, username, password, name, email, phone, role, groups, active, avatarurl}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userDelete.graphql'),
    (id) => {
        return new Promise((resolve) => {
            let r = {data: {deleteUser: {id: id, success: true}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/userAdminChangePassword.graphql'),
    () => Promise.resolve(changePasswordAdmin),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(changePasswordAdmin), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/roles.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(roles), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/roleCreate.graphql'),
    ({name, permissions}) => {
        return new Promise((resolve) => {
            let id = uuidv4()
            let r = {data: {roleCreate: {id, name, permissions}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/roleUpdate.graphql'),
    ({id, name, permissions}) => {
        return new Promise((resolve) => {
            let r = {data: {roleUpdate: {id, name, permissions}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/roleDelete.graphql'),
    (id) => {
        return new Promise((resolve) => {
            let r = {data: {roleDelete: {id: id, success: true}}}
            setTimeout(() => resolve(r), 800)
        })
    }
);


mockGqlClient.setRequestHandler(
    require('../src/providers/gql/groups.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(groups), 800)
        })
    }

);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/permissions.graphql'),
    () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(permissions), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/register.graphql'),
    ({email}) => {
        return new Promise((resolve) => {
            register.data.register.email = email
            setTimeout(() => resolve(register), 800)
        })
    }
);

mockGqlClient.setRequestHandler(
    require('../src/providers/gql/auth.graphql'),
    ({username, password}) => {
        return new Promise((resolve) => {
            if(username == "root" && password == "123"){
                setTimeout(() => resolve(authSuccessful), 800)
            }else{
                setTimeout(() => resolve(authBadCredentials), 800)
            }

        })
    }
);




export default mockGqlClient