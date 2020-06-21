<template>
    <div>
        <v-card class="elevation-6">
            <v-card-title class="title" v-t="'user.title'"></v-card-title>
            <v-card-subtitle class="" v-t="'user.description'"></v-card-subtitle>

            <v-card-text>
                <user-list
                        @open-change-password="openChangePassword"
                        @open-delete="openDelete"
                        @open-edit="openEdit"
                        @open-show="openShow"
                        :items="items" :totalItems="totalItems" :loading="loading"
                        @updateUsers="loadUsers"
                />
            </v-card-text>
        </v-card>


        <v-dialog :value="creating"  persistent fullscreen>
            <user-create v-if="creating"
                         v-on:closeDialog="creating=false"
                         @userCreated="onUserCreated"
            />
        </v-dialog>


        <v-dialog :value="updating" max-width="850" persistent>
            <user-update v-if="updating"
                         :user="userToEdit"
                         v-on:closeDialog="updating=false"
                         @userUpdated="onUserUpdated"
            />
        </v-dialog>

        <v-dialog :value="deleting" max-width="850" persistent>
            <user-delete v-if="deleting"
                         :user="userToDelete"
                         v-on:closeDialog="deleting=false"
                         @userDeleted="onUserDeleted"
            />
        </v-dialog>

        <v-dialog :value="showing" width="850" persistent>
            <user-show v-if="showing"
                       :item="userToShow"
                       v-on:closeDialog="showing=false"
            />
        </v-dialog>

        <v-dialog :value="changePassword" max-width="500" persistent>
            <user-change-password v-if="changePassword"
                                  :user="userToEdit"
                                  v-on:closeDialog="changePassword=false"
                                  @changePasswordConfirmed="changePasswordConfirmed"
            />
        </v-dialog>


        <snackbar :message="flashMessage"/>

        <add-button @click="openCreate"></add-button>

    </div>

</template>

<script>

    import Snackbar from "../../components/Snackbar/Snackbar"
    import UserCreate from "./UserCreate"
    import UserUpdate from './UserUpdate'
    import UserChangePassword from './AdminChangePassword'
    import UserDelete from "./UserDelete";
    import UserShow from "./UserShow";
    import UserList from "./UserList";
    import UserProvider from "../../providers/UserProvider";
    import Vue from "vue";
    import AddButton from "../../components/AddButton/AddButton";

    export default {
        name: "UserCrud",
        components: {
            AddButton,
            UserList,
            UserShow,
            UserDelete,
            UserCreate,
            UserUpdate,
            UserChangePassword,
            Snackbar
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
            onUserCreated(item){
                this.items.push(item)
                this.totalItems++
                this.flashMessage = this.$t('user.created')
            },
            onUserUpdated(item){
                let index = this.items.findIndex(i => i.id == item.id)
                Vue.set(this.items, index, item)
                this.flashMessage = this.$t('user.updated')
            },
            onUserDeleted(item){
                let index = this.items.findIndex(i => i.id == item.id)
                this.items.splice(index,1)
                this.totalItems--
                this.flashMessage = this.$t('user.deleted')
            },
            changePasswordConfirmed(){
                this.flashMessage="User password changed"
            }
        },

    }
</script>

