<template>
    <v-card>
        <toolbar-dialog-card title="user.changeYourPassword" @close="$emit('closeDialog')" />

        <v-card-text>
            <v-form ref="form" autocomplete="off" v-model="valid" @submit.prevent="submit">
                <v-col cols="12">

                    <v-text-field
                            id="current-password"
                            prepend-icon="lock"
                            :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                            :type="showCurrentPassword ? 'text' : 'password'"
                            @click:append="showCurrentPassword = !showCurrentPassword"
                            v-model="form.currentPassword"
                            :rules="requiredRule"
                            :label="$t('user.label.currentPassword')"
                            :placeholder="$t('user.label.currentPassword')"
                            autocomplete="current-password"
                            :error="hasInputErrors('currentPassword')"
                            :error-messages="getInputErrors('currentPassword')"
                            required
                            color="secondary"
                    />
                </v-col>
                <v-col cols="12">
                    <v-text-field
                            id="new-password"
                            prepend-icon="lock"
                            :append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
                            :type="showNewPassword ? 'text' : 'password'"
                            @click:append="showNewPassword = !showNewPassword"
                            v-model="form.newPassword"
                            :rules="requiredRule"
                            :label="$t('user.label.newPassword')"
                            :placeholder="$t('user.label.newPassword')"
                            autocomplete="new-password"
                            :error="hasInputErrors('newPassword')"
                            :error-messages="getInputErrors('newPassword')"
                            required
                            color="secondary"
                    />
                </v-col>

                <v-col cols="12">
                    <v-text-field id="password_verify"
                                  prepend-icon="lock"
                                  :append-icon="showRepeatPassword ? 'visibility' : 'visibility_off'"
                                  :type="showRepeatPassword ? 'text' : 'password'"
                                  @click:append="showRepeatPassword = !showRepeatPassword"
                                  v-model="form.passwordVerify"
                                  :rules="requiredRule"
                                  :label="$t('user.label.repeatPassword')"
                                  :placeholder="$t('user.label.repeatPassword')"
                                  autocomplete="off"
                                  :error="passwordMatchError"
                                  :error-messages="passwordMatchError"
                                  required
                    />
                </v-col>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <close-button text="common.cancel" @click="cancel"></close-button>
            <submit-button @click="submit" :loading="loading" :disabled="!valid"></submit-button>
        </v-card-actions>
    </v-card>
</template>

<script>
    import ProfileProvider from "../../../providers/ProfileProvider";
    import ClientError from "../../../errors/ClientError";
    import UserValidations from "../../../mixins/UserValidations";
    import InputErrors from "../../../mixins/InputErrors";
    import CloseButton from "../../../components/CloseButton/CloseButton";
    import SubmitButton from "../../../components/SubmitButton/SubmitButton";

    export default {
        name: "ProfilePasswordForm",
        components: {SubmitButton, CloseButton},
        mixins: [InputErrors, UserValidations],
        data() {
            return {
                loading: false,
                valid: true,
                status: false,
                showCurrentPassword: false,
                showNewPassword: false,
                showRepeatPassword: false,
                form: {
                    id: null, //TODO ID FROM TOKEN
                    currentPassword: null,
                    newPassword: null,
                    passwordVerify: null
                },
                errors: {}
            }
        },
        computed: {
            passwordMatchError() {
                return (this.form.newPassword === this.form.passwordVerify) ? null : this.$t('user.validation.passwordVerify')
            },
        },
        methods: {
            resetValidation: function () {
                this.errors = {};
            },
            submit() {
                if (this.$refs.form.validate()) {
                    this.resetValidation()
                    this.loading = true
                    ProfileProvider.changePassword(this.form).then((response) => {
                        this.status = response.data.changePassword.success
                        this.$emit('success', this.status)
                    }).catch((err) => {
                        let clientError = new ClientError(err)
                        this.errors = clientError.inputErrors
                    }).finally(() => this.loading = false)
                }
            },
            cancel() {
                this.$emit("close");
                this.$refs.form.reset();
                this.form.currentPassword = null;
                this.form.newPassword = null;
                this.form.passwordVerify = null;
            }
        }
    };
</script>

<style scoped>
</style>
