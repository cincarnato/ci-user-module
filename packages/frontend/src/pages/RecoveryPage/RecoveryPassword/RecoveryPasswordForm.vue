<template>
    <v-form
            ref="form"
            v-model="valid"
            lazy-validation
    >
        <v-row>
            <v-col cols="12">

                <v-text-field
                        v-model="form.newPassword"
                        :label="$t('user.label.newPassword')"
                        :placeholder="$t('user.label.newPassword')"
                        :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                        :type="showNewPassword ? 'text' : 'password'"
                        @click:append="showNewPassword = !showNewPassword"
                        :rules="requiredRule"
                        :error="hasInputErrors('newPassword')"
                        :error-messages="getInputErrors('newPassword')"
                ></v-text-field>

                <v-text-field
                        v-model="form.passwordVerify"
                        :label="$t('user.label.repeatPassword')"
                        :placeholder="$t('user.label.repeatPassword')"
                        :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'"
                        :type="showRepeatPassword ? 'text' : 'password'"
                        @click:append="showRepeatPassword = !showRepeatPassword"
                        :rules="requiredRule"
                        :error="!!passwordMatchError"
                        :error-messages="passwordMatchError"
                ></v-text-field>

            </v-col>

            <v-col>
                <v-row justify="center">
                    <submit-button @click="submit"
                                   text="common.confirm"
                                   :loading="loading"
                                   :disabled="!valid"
                    />
                </v-row>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>

    import InputErrors from "../../../mixins/InputErrors";
    import UserValidations from "../../../mixins/UserValidations";
    import recoveryProvider from "../../../providers/RecoveryProvider";
    import ClientError from "../../../errors/ClientError";
    import SubmitButton from "../../../components/SubmitButton/SubmitButton";

    export default {
        name: "RecoveryPasswordForm",
        components: {SubmitButton},
        mixins: [InputErrors, UserValidations],
        data() {
            return {
                valid: true,
                showNewPassword: false,
                showRepeatPassword: false,
                loading: false,
                status: null,
                form: {
                    newPassword: null,
                    passwordVerify: null,
                },
                errors: {}
            }
        },
        methods: {
            submit(){
                if (this.$refs.form.validate()) {
                    this.errors = {}
                    this.loading = true
                    recoveryProvider.recoveryChangePassword(this.form).then((response) => {
                        this.status = response.data.recoveryChangePassword.status
                        this.$emit('recover', this.status)
                    }).catch((err) => {
                        let clientError = new ClientError(err)
                        this.errors = clientError.inputErrors
                    }).finally(() => this.loading = false)
                }
            }
        },
        computed: {
            passwordMatchError() {
                return (this.form.password === this.form.passwordVerify) ? null : this.$t('user.validation.passwordVerify')
            },
        },
    }
</script>

<style scoped>

</style>