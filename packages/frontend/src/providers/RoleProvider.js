class RoleProvider {
    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }
    permissions() {
        return this.gqlc.query({query: require('./gql/permissions.graphql')})
    }

    roles() {
        return this.gqlc.query({query: require('./gql/roles.graphql')})
    }
    

    role(id) {
        return this.gqlc.query({
            query: require('./gql/role.graphql'),
            variables: {id:id}
        })
    }
    
    

    roleCreate(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/roleCreate.graphql'),
            variables: form
        })
    }
    
    roleUpdate(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/roleUpdate.graphql'),
            variables:{ id: form.id, name: form.name, permissions: form.permissions }
        })
    }
    
     roleDelete(id) {
        return this.gqlc.mutate({
            mutation: require('./gql/roleDelete.graphql'),
            variables: {id}
        })
    }

}

const roleProvider = new RoleProvider()

export default roleProvider



