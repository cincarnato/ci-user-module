class AuthProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    auth(username, password) {
        return this.gqlc.mutate({
            mutation: require('./gql/auth.graphql'),
            variables: {
                username: username,
                password: password,

            }
        })
    }

    apikey(userid) {
        return this.gqlc.mutate({
            mutation: require('./gql/apikey.graphql'),
            variables: { userid: userid}
        })
    }

    register({username, password, name, email, phone}) {
        return this.gqlc.mutate({
            mutation: require('./gql/register.graphql'),
            variables: {username, password, name, email, phone}
        })
    }

    activation(token) {
        return this.gqlc.mutate({
            mutation: require('./gql/activationUser.graphql'),
            variables: {token}
        })
    }

    me() {
        return this.gqlc.query({
            query: require('./gql/me.graphql')
        })
    }


}

const authProvider = new AuthProvider()

export default authProvider
