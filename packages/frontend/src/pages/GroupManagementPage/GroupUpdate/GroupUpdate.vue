<template>
    <v-card tile>

        <toolbar-dialog-card :title="title" @close="$emit('closeDialog')"></toolbar-dialog-card>



        <v-card-text class="pt-3">
            <v-alert v-if="errorMessage" type="error" dense text>{{$t(errorMessage)}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-form ref="form" autocomplete="off" @submit.prevent="save">

                <v-row>


                    <v-col cols="12" sm="6">
                        <v-text-field
                                prepend-icon="account_box"
                                name="name"
                                type="text"
                                v-model="form.name"
                                :label="$t('group.label.name')"
                                :placeholder="$t('group.label.name')"
                                class="pa-3"
                                :rules="requiredRule"
                                :error="hasInputErrors('name')"
                                :error-messages="getInputErrors('name')"
                                required
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <group-color-input v-model="form.color"
                                           :label="$t('group.label.color')"
                                           :get-message-errors="getInputErrors('color')"
                                           :has-errors="hasInputErrors('color')"
                                           :rules="rules.hexcode"
                        />
                    </v-col>

                    <v-col cols="12" sm="12">
                        <v-select
                                v-model="form.users"
                                :loading="loadingUsers"
                                :items="users"
                                :item-text="'name'"
                                :item-value="'id'"
                                attach
                                chips
                                :label="$t('group.label.users')"
                                :placeholder="$t('group.label.users')"
                                multiple
                        ></v-select>
                    </v-col>

                </v-row>


            </v-form>
        </v-card-text>


        <v-card-actions>

            <v-btn tile outlined color="grey" @click="$emit('closeDialog')">
                {{$t('common.close')}}
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn color="secondary" class="onSecondary--text" @click="save" :loading="loading">
                {{$t('common.update')}}
            </v-btn>

        </v-card-actions>

    </v-card>
</template>

<script>
    import GroupProvider from "../../../providers/GroupProvider";
    import ClientError from '../../../errors/ClientError'
    import GroupColorInput from "../GroupColorInput/GroupColorInput";
    import UserProvider from "../../../providers/UserProvider";
    import InputErrors from "../../../mixins/InputErrors";
    import UserValidations from "../../../mixins/UserValidations";
    import ToolbarDialogCard from "../../../components/ToolbarDialogCard/ToolbarDialogCard";


    export default {
        name: "GroupUpdate",
        components: {ToolbarDialogCard, GroupColorInput},
        mixins: [InputErrors, UserValidations],
        props: {
            item: Object
        },
        data() {
            return {
                colormenu: false,
                modal: false,
                title: this.$t('group.updateTitle'),
                errorMessage: '',
                inputErrors: {},
                loading: false,
                loadingUsers: false,
                users: [],
                form: {
                    id: this.item.id,
                    name: this.item.name,
                    color: this.item.color ? this.item.color : '#37474F',
                    users: this.item.users.map(user => user.id?user.id:user )
                },
                rules: {
                    required: value => !!value || this.$t('user.validation.required'),
                    hexcode: [v => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || 'hexcode invalid ']
                },

            }
        },
        created() {
            this.loadUsers()
        },
        methods: {
            loadUsers(){
                this.loadingUsers = true
                UserProvider.users().then(r => {
                        this.users = r.data.users
                    }
                ).catch(err => {
                    console.error(err)
                }).finally(() => this.loadingUsers = false)
            },
            save() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    GroupProvider.updateGroup(this.form).then(r => {
                            if (r) {
                                this.$emit('groupUpdated', r.data.groupUpdate)
                                this.$emit('closeDialog')
                            }
                        }
                    ).catch(error => {
                        let clientError = new ClientError(error)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.i18nMessage
                    }).finally(()=>this.loading=false)
                }

            },

        },
    }
</script>

<style scoped>

</style>

