<template>
    <crud-layout title="role.title" subtitle="role.description">

        <template v-slot:list>
            <role-list :roles="roles"
                       :permissions="permissions"
                       @update="openUpdate"
                       @delete="openDelete"
            ></role-list>
        </template>

        <role-create v-if="creating"
                     :open="creating"
                     v-on:roleCreated="onRoleCreated"
                     v-on:close="creating=false"
                     :permissions="permissions"
        />

        <role-update v-if="!!roleToUpdate"
                     :open="!!roleToUpdate"
                     :role="roleToUpdate"
                     :permissions="permissions"
                     v-on:close="roleToUpdate=null"
                     v-on:roleUpdated="onRoleUpdated"
        />


        <role-delete v-if="!!roleToDelete"
                     :open="!!roleToDelete"
                     :role="roleToDelete"
                     v-on:roleDeleted="onRoleDeleted"
                     v-on:close="roleToDelete=null"
        />


        <add-button @click="creating = true"></add-button>

        <snackbar :message="flashMessage"/>
    </crud-layout>
</template>

<script>
    import RoleCreate from "./RoleCreate/RoleCreate";
    import RoleDelete from "./RoleDelete/RoleDelete";
    import RoleUpdate from "./RoleUpdate/RoleUpdate";
    import RoleProvider from "../../providers/RoleProvider";
    import RoleList from "./RoleList";
    import Vue from "vue";
    import {CrudLayout, AddButton, Snackbar} from "@ci-common-module/frontend"

    export default {
        name: "RoleCrud",
        components: {CrudLayout, Snackbar, AddButton, RoleList, RoleCreate, RoleDelete, RoleUpdate},
        data() {
            return {
                permissions: [],
                roles: [],
                roleToUpdate: null,
                roleToDelete: null,
                creating: false,
                flashMessage: null
            }
        },
        created() {
            this.load()
        },
        methods: {
            load() {
                RoleProvider.permissions().then(r => {
                    this.permissions = r.data.permissions.permissions;
                });
                RoleProvider.roles().then(r => {
                    this.roles = r.data.roles;
                });
            },
            openUpdate(role) {
                this.roleToUpdate = role
            },
            openDelete(role) {
                this.roleToDelete = role
            },
            onRoleCreated(role) {
                this.roles.push(role);
                this.flashMessage = this.$t('role.created')
            },
            onRoleDeleted(role) {
                let index = this.roles.findIndex(i => i.id == role.id)
                this.roles.splice(index, 1)
                this.flashMessage = this.$t('role.deleted')
            },
            onRoleUpdated(role) {
                let index = this.roles.findIndex(i => i.id == role.id)
                Vue.set(this.roles, index, role)
                this.flashMessage = this.$t('role.updated')
            }
        }
    }
</script>

<style scoped>

</style>