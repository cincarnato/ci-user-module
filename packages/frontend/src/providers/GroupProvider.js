class GroupProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc){
        this.gqlc = gqlc
    }

    groups() {
        return this.gqlc.query({query: require('./gql/groups.graphql')})
    }
    
    paginateGroups(limit, pageNumber, search = null, orderBy = null, orderDesc = false) {
        return this.gqlc.query({
            query: require('./gql/groupsPaginate.graphql'),
            variables: {limit, pageNumber, search, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }

    group(id) {
        return this.gqlc.query({
            query: require('./gql/group.graphql'),
            variables: {id:id}
        })
    }
    
    

    createGroup(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/groupCreate.graphql'),
            variables: form
        })
    }
    
    updateGroup(form) {
        return this.gqlc.mutate({
            mutation: require('./gql/groupUpdate.graphql'),
            variables: form
        })
    }
    
     deleteGroup(id) {
        return this.gqlc.mutate({
            mutation: require('./gql/groupDelete.graphql'),
            variables: {id}
        })
    }

}
const groupProvider = new GroupProvider()

export default groupProvider


