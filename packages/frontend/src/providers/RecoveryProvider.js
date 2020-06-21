class RecoveryProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }


    recoveryByEmail(email) {
        return this.gqlc.mutate({
            mutation: require('./gql/recoveryByEmail.graphql'),
            variables: {email: email}
        })
    }

    recoveryChangePassword({newPassword}) {
        return this.gqlc.mutate({
            mutation: require('./gql/recoveryChangePassword.graphql'),
            variables: {newPassword: newPassword}
        })
    }


}

const recoveryProvider = new RecoveryProvider()

export default recoveryProvider