const rolesConfigFile = [
    {
        name: 'admin',
        permissions: ["SECURITY-ADMIN-CREATE", "SECURITY-ADMIN-UPDATE", "SECURITY-ADMIN-DELETE"]
    },
    {
        name: 'user',
        permissions: []
    }
]


const roleConfigPromise = new Promise((resolve) => {
    resolve(rolesConfigFile)
});

export default roleConfigPromise;

