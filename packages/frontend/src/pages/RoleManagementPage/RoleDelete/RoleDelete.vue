<template>
    <v-card>

        <toolbar-dialog-card :title="title"
                             danger
                             @close="$emit('closeDialog')">
        </toolbar-dialog-card>

        <v-card-text v-show="successMessage == true" class="ma-0">
            <v-alert :value="true" color="success" class="ma-0" icon="check_circle" outlined>Exitoso</v-alert>
        </v-card-text>

        <v-card-text v-show="errorMessage == true" class="ma-0">
            <v-alert :value="true" color="error" class="ma-0" icon="check_circle" outlined>Error</v-alert>
        </v-card-text>

        <v-card-text v-show="successMessage != true && errorMessage != true">
            <label>{{$t('common.areYouSureDeleteRecord')}}</label>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <close-button @click="$emit('closeDialog')"></close-button>
            <submit-button danger @click="deleteRole" v-t="'common.delete'" :loading="loading"></submit-button>
        </v-card-actions>
    </v-card>
</template>

<script>
    import RoleProvider from "../../../providers/RoleProvider";
    import CloseButton from "../../../components/CloseButton/CloseButton";
    import ClientError from "../../../errors/ClientError";
    import ToolbarDialogCard from "../../../components/ToolbarDialogCard/ToolbarDialogCard";
    import SubmitButton from "../../../components/SubmitButton/SubmitButton";

    export default {
        name: "ConfirmDelete",
        components: {SubmitButton, ToolbarDialogCard, CloseButton},
        props: {
            role: Object
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
                                this.$emit("closeDialog")
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
