<template>
    <crud-layout title="group.title" subtitle="group.description">

        <template v-slot:list>
            <group-list
                    @open-delete="openDelete"
                    @open-edit="openEdit"
                    @open-show="openShow"
                    :items="items" :totalItems="totalItems" :loading="loading"
                    @update="loadGroups"
            ></group-list>
        </template>

        <group-show v-if="showing"
                    :open="showing"
                    :item="itemToShow"
                    v-on:close="showing=false"/>


        <group-delete v-if="deleting"
                      :open="deleting"
                      :item="itemToDelete"
                      @groupDeleted="onGroupDeleted"
                      v-on:close="deleting=false"
        />


        <group-create v-if="creating"
                      :open="creating"
                      v-on:groupCreated="onGroupCreated"
                      v-on:close="creating=false"
        />


        <group-update v-if="updating"
                      :open="updating"
                      :item="itemToEdit"
                      v-on:groupUpdated="onGroupUpdated"
                      v-on:close="updating=false"
        />


        <add-button @click="creating = true"></add-button>

        <snackbar :message="flashMessage"/>
    </crud-layout>
</template>

<script>
    import GroupShow from "./GroupShow";
    import GroupDelete from "./GroupDelete";
    import GroupCreate from "./GroupCreate";
    import GroupUpdate from "./GroupUpdate";
    import GroupList from "./GroupList";
    import GroupProvider from "../../providers/GroupProvider";
    import {CrudLayout, AddButton, Snackbar} from "@ci-common-module/frontend"

    export default {
        name: "GroupCrud",
        components: {CrudLayout, Snackbar, AddButton, GroupList, GroupUpdate, GroupCreate, GroupDelete, GroupShow},
        data() {
            return {
                title: this.$t('group.title'),
                description: this.$t('group.description'),
                creating: false,
                updating: false,
                deleting: false,
                showing: false,
                expanded: [],
                itemToEdit: null,
                itemToDelete: null,
                itemToShow: null,
                items: [],
                totalItems: 0,
                page: 1,
                itemsPerPage: 5,
                loading: false,
                flashMessage: null
            }
        },
        created() {
            this.loadGroups()
        },
        methods: {
            onGroupCreated() {
                this.loadGroups()
                this.flashMessage = this.$t('group.created')
            },
            onGroupUpdated() {
                this.loadGroups()
                this.flashMessage = this.$t('group.updated')
            },
            onGroupDeleted() {
                this.loadGroups()
                this.flashMessage = this.$t('group.deleted')

            },
            openEdit(item) {
                this.updating = true
                this.itemToEdit = item
            },
            openShow(item) {
                this.showing = true
                this.itemToShow = item
            },
            openDelete(item) {
                this.deleting = true
                this.itemToDelete = item
            },
            update() {
                this.loading = true
                GroupProvider.groups().then(r => {
                    this.items = r.data.groups
                    this.loading = false
                })
            },
            loadGroups(options = {
                orderBy: null,
                orderDesc: false,
                pageNumber: this.page,
                itemsPerPage: this.itemsPerPage,
                search: ''
            }) {
                //Update current options
                this.page = options.pageNumber
                this.itemsPerPage = options.itemsPerPage

                this.loading = true
                GroupProvider.paginateGroups(
                    options.itemsPerPage,
                    options.pageNumber,
                    options.search,
                    options.orderBy,
                    options.orderDesc
                )
                    .then(r => {
                        this.items = r.data.groupsPaginate.items
                        this.totalItems = r.data.groupsPaginate.totalItems
                    }).catch(err => {
                    //TODO improve handle error (show messages to user)
                    console.error(err)
                }).finally(() => this.loading = false)
            }
        },


    }
</script>

<style scoped>

</style>