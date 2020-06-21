<template>
    <v-dialog :value="openDialog" width="500" persistent>

        <password-success v-if="success" @close="$emit('closeDialog')"/>

        <password-form v-else @success="success=true" @close="$emit('closeDialog')"/>

    </v-dialog>
</template>

<script>
    import PasswordForm from './ProfilePasswordForm'
    import PasswordSuccess from './ProfilePasswordSuccess'

    export default {
        name: "ProfilePassword",
        components: {
            PasswordForm,
            PasswordSuccess
        },
        props: {
            openDialog: Boolean
        },
        data(){
            return {
                success: false
            }
        }
    }
</script>

<style scoped>

</style>
