const resolve = {
    data: {
        roles: [
            {
                id: 1,
                name: 'admin',
                permissions: ["SECURITY_USER_SHOW","SECURITY_USER_CREATE", "SECURITY_USER_EDIT", "SECURITY_USER_DELETE"]
            },
            {
                id: 2,
                name: 'supervisor',
                permissions: ["SECURITY_USER_SHOW"]
            },
            {
                id: 3,
                name: 'operator',
                permissions: ["SECURITY_USER_SHOW"]
            }
        ]
    }
}

export default resolve