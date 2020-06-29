<template>
    <crud-layout title="user.title" subtitle="user.description">

        <template v-slot:list>
            <user-list
                    @open-change-password="openChangePassword"
                    @open-delete="openDelete"
                    @open-edit="openEdit"
                    @open-show="openShow"
                    :items="items" :totalItems="totalItems" :loading="loading"
                    @updateUsers="loadUsers"
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


        <snackbar :message="flashMessage"/>

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
    import UserProvider from "../../providers/UserProvider";
    import Vue from "vue";
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
                items: [],
                totalItems: 0,
                loading: false,

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
        mounted() {
            this.loadUsers()
        },
        methods: {
            loadUsers(options = {
                          orderBy: null,
                          orderDesc: false,
                          pageNumber: 1,
                          itemsPerPage: 5,
                          search: ''
                      }
            ) {
                this.loading = true
                UserProvider.paginateUsers(
                    options.itemsPerPage,
                    options.pageNumber,
                    options.search,
                    options.orderBy,
                    options.orderDesc
                )
                    .then(r => {
                        this.items = r.data.paginateUsers.users
                        this.totalItems = r.data.paginateUsers.totalItems
                    }).catch(err => {
                    //TODO improve handle error (show messages to user)
                    console.error(err)
                }).finally(() => this.loading = false)
            },
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
            onUserCreated(item) {
                this.items.push(item)
                this.totalItems++
                this.flashMessage = this.$t('user.created')
            },
            onUserUpdated(item) {
                let index = this.items.findIndex(i => i.id == item.id)
                Vue.set(this.items, index, item)
                this.flashMessage = this.$t('user.updated')
            },
            onUserDeleted(item) {
                let index = this.items.findIndex(i => i.id == item.id)
                this.items.splice(index, 1)
                this.totalItems--
                this.flashMessage = this.$t('user.deleted')
            },
            changePasswordConfirmed() {
                this.flashMessage = "User password changed"
            }
        },

    }
</script>

