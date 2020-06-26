<template>
    <recovery-invalid-token v-if="isToken === false"></recovery-invalid-token>
    <recovery-validation-in-progress v-else-if="loading === true"></recovery-validation-in-progress>
    <recovery-invalid-token v-else-if="tokenValid === false"/>
    <recovery-password-form v-else></recovery-password-form>
</template>

<script>
    import RecoveryPasswordForm from "./RecoveryPasswordForm";
    import RecoveryInvalidToken from "./RecoveryInvalidToken/RecoveryInvalidToken";
    import RecoveryValidationInProgress from "./RecoveryValidationInProgress/RecoveryValidationInProgress";
    import recoveryProvider from "../../../providers/RecoveryProvider";
    import ClientError from "../../../errors/ClientError";

    export default {
        name: "Recovery",
        components: {
            RecoveryValidationInProgress,
            RecoveryInvalidToken,
            RecoveryPasswordForm
        },
        data() {
            return {
                loading: true,
                token: this.$route.params.token,
                tokenValid: null,
                errorMessage: null
            }
        },
        methods: {
            validateToken() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    recoveryProvider.validateToken(this.token).then((response) => {
                        this.tokenValid = response.data.validateToken.valid
                    }).catch((err) => {
                        let clientError = new ClientError(err)
                        this.errorMessage = clientError.i18nMessage
                    }).finally(() => this.loading = false)
                }
            }
        },
        computed: {
            isToken() {
                return !!this.$route.params.token
            },

        }
    }
</script>

<style scoped>

</style>