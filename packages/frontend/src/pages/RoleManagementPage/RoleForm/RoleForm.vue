<template>
    <v-form ref="form" autocomplete="off" @submit.prevent="$emit('save')">
        <v-col cols="12" sm="6">
            <v-text-field
                    prepend-icon="account_box"
                    name="name"
                    type="text"
                    v-model="form.name"
                    :label="$t('role.label.name')"
                    :placeholder="$t('role.label.name')"
                    class="pa-3"
                    :rules="required"
                    :error="hasInputErrors('name')"
                    :error-messages="getInputErrors('name')"
                    required
            ></v-text-field>
        </v-col>

        <v-col cols="12">
            <v-row>
                <v-col cols="12" class="py-0" v-for="(permission,index) in permissions" :key="index">

                    <v-checkbox v-model="form.permissions"
                                :label="getPermissionsTranslation(permission)"
                                :value="permission"
                                @input="inputPermission(permission)"
                                dense hide-details
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-col>
    </v-form>
</template>

<script>
    import {InputErrorsByProps, RequiredRule} from '@ci-common-module/frontend'
    import RoleProvider from "../../../providers/RoleProvider";
    import {RoleMixin} from "../RoleMixin";

    export default {
        name: "RoleForm",
        mixins: [RoleMixin, InputErrorsByProps, RequiredRule],
        props: {
            value: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                users: [],
                permissions: [],
                loadingUsers: false,
                colorRules: [v => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || 'hexcode invalid ']
            }
        },
        computed: {
            form: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            },
            hasPermission() {
                return (permission) => {
                    return this.form.permissions.includes(permission)
                }
            }
        },
        watch: {
            form: {
                handler(newVal) {
                    this.$emit('input', newVal)
                },
                deep: true
            }
        },
        created() {
            this.load()
        },
        methods: {
            validate() {
                return this.$refs.form.validate()
            },
            load() {
                RoleProvider.permissions().then(r => {
                    this.permissions = r.data.permissions.permissions;
                });
            },
            inputPermission(permission) {
                if (this.hasPermission(permission)) {
                    this.form.permissions = this.form.permissions.filter(p => p != permission)
                } else {
                    this.form.permissions.push(permission)
                }
            },
        }
    }
</script>

<style scoped>

</style>