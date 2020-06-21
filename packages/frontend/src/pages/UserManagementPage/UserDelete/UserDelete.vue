<template>
    <v-card>

        <toolbar-dialog-card
                danger
                title="user.deleteTitle"
                @close="$emit('closeDialog')"
        />

        <v-card-text>
        <user-show-data :item="user" />
        </v-card-text>

        <v-card-text>
            <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
        </v-card-text>

        <v-card-text>
            <v-row justify="center">
                <span class="title">{{areYouSure}}</span>
            </v-row>
        </v-card-text>


        <v-card-actions>
            <close-button @click="$emit('closeDialog')"></close-button>
            <v-spacer></v-spacer>
            <submit-button danger @click="deleteConfirm" :loading="loading" text="common.delete"></submit-button>
        </v-card-actions>

    </v-card>
</template>

<script>
    import UserShowData from "../UserShow/UserShowData";
    import UserProvider from "../../../providers/UserProvider";
    import ClientError from "../../../errors/ClientError";
    import ToolbarDialogCard from "../../../components/ToolbarDialogCard/ToolbarDialogCard";
    import CloseButton from "../../../components/CloseButton/CloseButton";
    import SubmitButton from "../../../components/SubmitButton/SubmitButton";

    export default {
        name: "UserDelete",
        components: {SubmitButton, CloseButton, ToolbarDialogCard, UserShowData},
        props: {
            user: Object
        },
        data() {
            return {
                modal: false,
                title: this.$t('user.deleteTitle'),
                areYouSure: this.$t('user.deleteConfirm'),
                errorMessage: '',
                loading: false,
            }
        },
        methods: {
            deleteConfirm() {
                this.loading=true
                UserProvider.deleteUser(this.user.id).then( () => {
                    this.$emit('userDeleted',this.user)
                    this.$emit('closeDialog')
                }).catch(error => {
                    let clientError = new ClientError(error)
                    this.inputErrors = clientError.inputErrors
                    this.errorMessage = clientError.i18nMessage
                }).finally(()=>this.loading=false)
            },
        },
    }
</script>

<style scoped>

</style>

