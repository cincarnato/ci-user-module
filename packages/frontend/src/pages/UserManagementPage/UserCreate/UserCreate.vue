<template>
    <v-card>
        <toolbar-dialog-card
                title="user.createTitle"
                @close="$emit('closeDialog')"
        />

        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-form ref="form" autocomplete="off">

                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="account_box"
                                name="name"
                                type="text"
                                v-model="form.name"
                                :label="$t('user.label.fullname')"
                                :placeholder="$t('user.label.fullname')"
                                class="pa-3"
                                :rules="requiredRule"
                                :error="hasInputErrors('name')"
                                :error-messages="getInputErrors('name')"
                                required
                                color="secondary"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-text-field prepend-icon="person"
                                      name="username"
                                      type="text"
                                      v-model="form.username"
                                      :label="$t('user.label.username')"
                                      :placeholder="$t('user.label.username')"
                                      class="pa-3"
                                      autocomplete="new-password"
                                      :rules="requiredRule"
                                      :error="hasInputErrors('username')"
                                      :error-messages="getInputErrors('username')"
                                      required
                                      color="secondary"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-text-field prepend-icon="email"
                                      name="email"
                                      type="text"
                                      class="pa-3"
                                      v-model="form.email"
                                      :label="$t('user.label.email')"
                                      :placeholder="$t('user.label.email')"
                                      :rules="emailRules"
                                      :error="hasInputErrors('email')"
                                      :error-messages="getInputErrors('email')"
                                      required
                                      color="secondary"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-text-field prepend-icon="phone"
                                      name="phone"
                                      type="text"
                                      class="pa-3"
                                      v-model="form.phone"
                                      :label="$t('user.label.phone')"
                                      :placeholder="$t('user.label.phone')"
                                      :error="hasInputErrors('phone')"
                                      :error-messages="getInputErrors('phone')"
                                      required
                                      color="secondary"
                        >

                        </v-text-field>
                    </v-col>


                    <v-col cols="12" sm="6">
                        <v-text-field id="password"
                                      prepend-icon="lock"
                                      name="password"
                                      type="password"
                                      v-model="form.password"
                                      class="pa-3"
                                      :label="$t('user.label.password')"
                                      :placeholder="$t('user.label.password')"
                                      autocomplete="new-password"
                                      ref="password"
                                      :rules="requiredRule"
                                      :error="hasInputErrors('password')"
                                      :error-messages="getInputErrors('password')"
                                      required
                                      color="secondary"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-text-field
                                id="password_verify"
                                prepend-icon="lock"
                                name="password_verify"
                                type="password"
                                v-model="form.password_verify"
                                :label="$t('user.label.repeatPassword')"
                                :placeholder="$t('user.label.repeatPassword')"
                                autocomplete="new-password"
                                class="pa-3"
                                :rules="requiredRule"
                                :error="passwordMatchError == '' ? false : true"
                                :error-messages="passwordMatchError"
                                required
                                color="secondary"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-select
                                prepend-icon="account_box"
                                class="pa-3"
                                :items="roles"
                                :item-text="'name'"
                                :item-value="'id'"
                                v-model="form.role"
                                :label="$t('user.label.role')"
                                :loading="loadingRoles"
                                :rules="requiredRule"
                                :error="hasInputErrors('groups')"
                                :error-messages="getInputErrors('groups')"
                                required
                                color="secondary"
                                item-color="secondary"
                        ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-select
                                v-model="form.groups"
                                :loading="loadingGroups"
                                :items="groups"
                                :item-text="'name'"
                                :item-value="'id'"
                                attach
                                chips
                                :label="$t('user.label.groups')"
                                :placeholder="$t('user.label.groups')"
                                multiple
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" class="pl-8">
                        <v-switch color="success" :label="form.active?'Activo':'Inactivo'" input-value="0"
                                  v-model="form.active"></v-switch>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>


        <v-card-actions>
            <close-button @click="$emit('closeDialog')"></close-button>
            <v-spacer></v-spacer>
            <submit-button @click="saveUser" :loading="loading" text="common.create"></submit-button>
        </v-card-actions>

    </v-card>
</template>

<script>
    import UserProvider from "../../../providers/UserProvider";
    import GroupProvider from "../../../providers/GroupProvider";
    import RoleProvider from "../../../providers/RoleProvider";
    import ClientError from "../../../errors/ClientError";
    import InputErrors from "../../../mixins/InputErrors";
    import UserValidations from "../../../mixins/UserValidations";
    import SubmitButton from "../../../components/SubmitButton";
    import CloseButton from "../../../components/CloseButton";
    import ToolbarDialogCard from "../../../components/ToolbarDialogCard/ToolbarDialogCard";


    export default {
        name: "UserCreate",
        components: {ToolbarDialogCard, CloseButton, SubmitButton},
        mixins: [InputErrors,UserValidations],
        data() {
            return {
                title: this.$t('user.createTitle'),
                errorMessage: null,
                loading: false,
                loadingRoles: false,
                loadingGroups: false,
                roles: [],
                groups: [],
                form: {
                    username: '',
                    password: '',
                    password_verify: '',
                    name: '',
                    email: '',
                    phone: '',
                    role: null,
                    groups: [],
                    active: true
                },
                
            }
        },
        mounted() {
            this.loadRoles()
            this.loadGroups()
        },
        computed: {
            passwordMatchError() {
                return (this.form.password === this.form.password_verify) ? '' : 'Contraseña no coincide'
            },
        },
        methods: {
            loadRoles(){
                this.loadingRoles = true
                RoleProvider.roles().then(r => {
                        this.roles = r.data.roles
                    }
                ).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingRoles = false)
            },
            loadGroups(){
                this.loadingGroups = true
                GroupProvider.groups().then(r => {
                        this.groups = r.data.groups
                    }
                ).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingGroups = false)
            },
            saveUser() {
                if (this.$refs.form.validate()) {
                    this.loading=true
                    UserProvider.createUser(this.form).then(r => {
                            if (r) {
                                this.$emit('userCreated', r.data.createUser)
                                this.$emit('closeDialog')
                            }
                        }
                    ).catch(error => {
                        let clientError = new ClientError(error)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.i18nMessage
                    }).finally(()=>this.loading=false)
                }
            }
        },
    }
</script>

<style scoped>

</style>
