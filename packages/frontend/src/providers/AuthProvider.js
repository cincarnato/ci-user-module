class AuthProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    auth(username,password){
        return this.gqlc.mutate({
            mutation: require('./gql/auth.graphql'),
            variables: {
                username: username,
                password: password,

            }
        })
    }

    register({username,password, name, email, phone}){
        return this.gqlc.mutate({
            mutation: require('./gql/register.graphql'),
            variables: {username,password, name, email, phone}
        })
    }

    activation(id){
        return this.gqlc.query({
            query: require('./gql/activationUser.graphql'),
            variables: {id}
        })
    }

    me(){
        return this.gqlc.query({
            query: require('./gql/me.graphql')
        })
    }


}
const authProvider = new AuthProvider()

export default authProvider
