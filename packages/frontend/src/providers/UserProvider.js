import ClientError from '../errors/ClientError'

class UserProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    paginateUsers(limit, pageNumber, search = null, orderBy = null, orderDesc = false) {
        return this.gqlc.query({
            query: require('./gql/userPaginate.graphql'),
            variables: {limit, pageNumber, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }

    users() {
        return this.gqlc.query({query: require('./gql/users.graphql')})
    }

    roles() {
        return this.gqlc.query({query: require('./gql/roles.graphql')})
    }

    groups() {
        return this.gqlc.query({
                query: require('./gql/groups.graphql'),
                fetchPolicy: "network-only"
            }
        )
    }

    createUser({username, password, name, email, phone, role, groups, active}) {
        return new Promise((resolve, reject) => {
                this.gqlc.mutate({
                    mutation: require('./gql/userCreate.graphql'),
                    variables: {username, password, name, email, phone, role, groups, active}
                }).then(data => {
                    resolve(data)
                }).catch((apolloError) => {
                    let clientError = new ClientError(apolloError)
                    reject(clientError)
                })
            }
        )

    }


    updateUser({id, name, username, email, phone, role, groups, active}) {
        return new Promise((resolve, reject) => {
                this.gqlc.mutate({
                    mutation: require('./gql/userUpdate.graphql'),
                    variables: {id, name, username, email, phone, role, groups, active}
                }).then(data => {
                    resolve(data)
                }).catch((apolloError) => {
                    let clientError = new ClientError(apolloError)
                    reject(clientError)
                })
            }
        )
    }

    deleteUser(id) {
        return new Promise((resolve, reject) => {
                this.gqlc.mutate({
                    mutation: require('./gql/userDelete.graphql'),
                    variables: {id}
                }).then(data => {
                    resolve(data)
                }).catch((apolloError) => {
                    let clientError = new ClientError(apolloError)
                    reject(clientError)
                })
            }
        )
    }

    adminChangePassword(id, password, passwordVerify) {
        return new Promise((resolve, reject) => {

            this.gqlc.mutate({
                mutation: require('./gql/userAdminChangePassword.graphql'),
                variables: {id: id, password: password, passwordVerify: passwordVerify}
            }).then(data => {
                resolve(data)
            }).catch((apolloError) => {
                let clientError = new ClientError(apolloError)
                reject(clientError)
            })
        })
    }
}
const userProvider = new UserProvider()
export default userProvider
