export default{
    data(){
        return{
            inputErrors: []
        }
    },
    computed: {
        hasInputErrors: (state) => (field) => {
            return state.inputErrors[field] != undefined
        },
        getInputErrors: (state) => (field) => {
            if (state.inputErrors[field] != undefined) {
                let message = state.inputErrors[field].message
                return [message]
            }
            return []
        }
    }
}