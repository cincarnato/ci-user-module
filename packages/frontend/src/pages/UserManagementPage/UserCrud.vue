<template>
    <crud-layout title="user.title" subtitle="user.description">

        <template v-slot:list>
            <user-list
                    ref="list"
                    @open-change-password="openChangePassword"
                    @open-delete="openDelete"
                    @open-edit="openEdit"
                    @open-show="openShow"
            />
        </template>


        <user-create v-if="creating"
                     :open="creating"
                     v-on:close="creating=false"
                     @userCreated="onUserCreated"
        />

        <user-update v-if="updating"
                     :open="updating"
                     :user="userToEdit"
                     v-on:close="updating=false"
                     @userUpdated="onUserUpdated"
        />


        <user-delete v-if="deleting"
                     :open="deleting"
                     :user="userToDelete"
                     v-on:close="deleting=false"
                     @userDeleted="onUserDeleted"
        />


        <user-show v-if="showing"
                   :open="showing"
                   :item="userToShow"
                   v-on:close="showing=false"
        />


        <user-change-password v-if="changePassword"
                              :open="changePassword"
                              :user="userToEdit"
                              v-on:close="changePassword=false"
                              @changePasswordConfirmed="changePasswordConfirmed"
        />


        <snackbar v-model="flashMessage"/>

        <add-button @click="openCreate"></add-button>

    </crud-layout>

</template>

<script>

    import UserCreate from "./UserCreate"
    import UserUpdate from './UserUpdate'
    import UserChangePassword from './AdminChangePassword'
    import UserDelete from "./UserDelete";
    import UserShow from "./UserShow";
    import UserList from "./UserList";
    import {CrudLayout, AddButton, Snackbar} from "@ci-common-module/frontend"

    export default {
        name: "UserCrud",
        components: {
            UserList,
            UserShow,
            UserDelete,
            UserCreate,
            UserUpdate,
            UserChangePassword,
            CrudLayout, AddButton, Snackbar
        },
        data() {
            return {
                flashMessage: null,
                dialog: false,
                creating: false,
                updating: false,
                deleting: false,
                changePassword: false,
                userToEdit: null,
                userToDelete: null,
                showing: false,
                userToShow: null,
            }
        },
        methods: {
            openCreate() {
                this.creating = true
                this.dialog = true
            },
            openEdit(user) {
                this.updating = true
                this.userToEdit = user
            },
            openShow(user) {
                this.showing = true
                this.userToShow = user
            },
            openDelete(user) {
                this.deleting = true
                this.userToDelete = user
            },
            openChangePassword(user) {
                this.changePassword = true
                this.userToEdit = user
            },
            onUserCreated() {
                this.$refs.list.fetch()
                this.flashMessage = this.$t('user.created')
            },
            onUserUpdated() {
                this.$refs.list.fetch()
                this.flashMessage = this.$t('user.updated')
            },
            onUserDeleted() {
                this.$refs.list.fetch()
                this.flashMessage = this.$t('user.deleted')
            },
            changePasswordConfirmed() {
                this.flashMessage = "User password changed"
            }
        },

    }
</script>

