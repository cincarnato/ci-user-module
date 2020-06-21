<template>

    <v-card>
        <toolbar-dialog-card title="user.changePasswordTitle" @close="$emit('closeDialog')" />

        <v-card-text>
            <v-form ref="form" autocomplete="off" v-model="valid" @submit.prevent="submit">
                <v-row row wrap>
                    <v-col cols="12">
                        <v-text-field id="password"
                                      prepend-icon="lock"
                                      name="password"
                                      :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                                      :type="showNewPassword ? 'text' : 'password'"
                                      @click:append="showNewPassword = !showNewPassword"
                                      v-model="form.password"
                                      :label="$t('user.label.newPassword')"
                                      :placeholder="$t('user.label.newPassword')"
                                      autocomplete="new-password"
                                      :rules="requiredRule"
                                      :error="hasInputErrors('newPassword')"
                                      :error-messages="getInputErrors('newPassword')"
                                      required
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field id="password_verify"
                                      prepend-icon="lock"
                                      name="password_verify"
                                      :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'"
                                      :type="showRepeatPassword ? 'text' : 'password'"
                                      @click:append="showRepeatPassword = !showRepeatPassword"
                                      v-model="form.passwordVerify"
                                      :rules="requiredRule"
                                      :label="$t('user.label.repeatPassword')"
                                      :placeholder="$t('user.label.repeatPassword')"
                                      autocomplete="new-password"
                                      :error="!!passwordMatchError"
                                      :error-messages="passwordMatchError"
                                      required
                        />
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <close-button text="common.cancel" @click="$emit('closeDialog')"></close-button>
            <submit-button @click="submit" :loading="loading" :disabled="!valid"></submit-button>

        </v-card-actions>

    </v-card>

</template>

<script>

    import UserProvider from "../../../providers/UserProvider";
    import ClientError from "../../../errors/ClientError";
    import InputErrors from "../../../mixins/InputErrors";
    import UserValidations from "../../../mixins/UserValidations";
    import ToolbarDialogCard from "../../../components/ToolbarDialogCard/ToolbarDialogCard";
    import CloseButton from "../../../components/CloseButton/CloseButton";
    import SubmitButton from "../../../components/SubmitButton/SubmitButton";

    export default {
        name: "AdminChangePassword",
        components: {SubmitButton, CloseButton, ToolbarDialogCard},
        props: {
            user: Object
        },
        mixins: [InputErrors, UserValidations],
        data() {
            return {
                valid: true,
                showNewPassword: false,
                showRepeatPassword: false,
                loading: false,
                status: null,
                form: {
                    password: null,
                    passwordVerify: null,
                },
                errors: {}
            }
        },
        computed: {
            passwordMatchError() {
                return (this.form.password === this.form.passwordVerify) ? null : this.$t('user.validation.passwordVerify')
            },
        },
        methods: {
            resetValidation: function () {
                this.errors = {}
            },
            submit() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    this.resetValidation()
                    let userId = this.user ? this.user.id : null
                    UserProvider.adminChangePassword(userId, this.form.password, this.form.passwordVerify)
                        .then(() => {
                            this.$emit('changePasswordConfirmed', this.user)
                            this.$emit('closeDialog')
                            this.status = true
                        }).catch(error => {
                        let clientError = new ClientError(error)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.i18nMessage
                    })
                        .finally(() => this.loading = false)
                }
            },
        }
    }
</script>

<style scoped>

</style>
