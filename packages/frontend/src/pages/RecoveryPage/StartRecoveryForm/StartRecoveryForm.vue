<template>

    <v-card class="elevation-12 ">

        <v-card-text class="pt-4 px-8 my-0 pb-0 text-center">
            <v-btn fab class="onPrimary--text" color="primary">
                <v-icon>lock</v-icon>
            </v-btn>
            <h2 class="mt-3" v-t="'auth.passwordRecovery'"></h2>
        </v-card-text>

        <v-card-text v-if="status">
           <start-recovery-form-success :email="form.email" />
        </v-card-text>

        <v-card-text v-else>
            <v-form ref="form" autocomplete="off" v-model="valid" @submit.prevent="submit">
                <v-text-field prepend-icon="email"
                              name="email"
                              ref="email"
                              type="text"
                              v-model="form.email"
                              :rules="emailRules"
                              :label="$t('user.label.email')"
                              :placeholder="$t('user.label.email')"
                              description="asd"
                              :error="hasInputErrors('email')"
                              :error-messages="getInputErrors('email')"
                              color="secondary"
                              required
                />
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-row justify="center">
                <submit-button @click="submit"
                               text="common.send"
                               :loading="loading"
                               :disabled="!valid"
                />
            </v-row>

        </v-card-actions>
    </v-card>

</template>

<script>

    import UserValidations from "../../../mixins/UserValidations";
    import InputErrors from "../../../mixins/InputErrors";
    import RecoveryProvider from "../../../providers/RecoveryProvider";
    import ClientError from "../../../errors/ClientError";
    import SubmitButton from "../../../components/SubmitButton/SubmitButton";
    import StartRecoveryFormSuccess from "./StartRecoveryFormSuccess";

    export default {
        name: "StartRecoveryForm",
        components: {StartRecoveryFormSuccess, SubmitButton},
        mixins: [UserValidations, InputErrors],
        data: () => ({
                loading: false,
                status: false,
                valid: true,
                form: {
                    email: null,
                },
                errors: {},
            }
        ),
        methods: {
            resetValidation: function () {
                this.errors = {}
            },
            submit() {
                this.resetValidation()
                if (this.$refs.form.validate()) {
                    this.loading = true
                    RecoveryProvider.recoveryByEmail(this.form.email).then((response) => {
                        this.status = response.data.recoveryByEmail.status
                        this.$emit('status', this.status)
                    }).catch((err) => {
                        let clientError = new ClientError(err)
                        this.errors = clientError.inputErrors
                    }).finally(() => this.loading = false)
                }
            },

        }
    }
</script>

<style scoped>

</style>
