<template>
    <crud-delete :open="open"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @delete="deleteRole"
                 @close="$emit('close')"
    >


        <v-card-text v-show="successMessage == true" class="ma-0">
            <v-alert :value="true" color="success" class="ma-0" icon="check_circle" outlined>Exitoso</v-alert>
        </v-card-text>

        <v-card-text v-show="errorMessage == true" class="ma-0">
            <v-alert :value="true" color="error" class="ma-0" icon="check_circle" outlined>Error</v-alert>
        </v-card-text>

        <v-card-text v-show="successMessage != true && errorMessage != true">
            <label>{{$t('common.areYouSureDeleteRecord')}}</label>
        </v-card-text>

    </crud-delete>
</template>

<script>
    import RoleProvider from "../../../providers/RoleProvider";
    import {CrudDelete, ClientError} from '@ci-common-module/frontend'

    export default {
        name: "ConfirmDelete",
        components: {CrudDelete},
        props: {
            role: Object,
            open: {type: Boolean, default: true}
        },
        data: () => ({
            title: 'role.deleteTitle',
            successMessage: false,
            errorMessage: false,
            loading: false
        }),
        methods: {
            deleteRole() {
                if (this.role && this.role.id) {
                    this.loading = true
                    RoleProvider.roleDelete(this.role.id)
                        .then(r => {
                            if (r) {
                                this.$emit("roleDeleted", this.role)
                                this.$emit("close")
                            }
                        })
                        .catch(error => {
                            let clientError = new ClientError(error);
                            this.errorMessage = clientError.i18nMessage
                        }).finally(() => this.loading = false)

                }
            }
        }
    };
</script>

<style scoped>
</style>
