<template>
    <v-card class="elevation-6">

        <v-card-title class="title" v-t="'group.title'"></v-card-title>
        <v-card-subtitle class="" v-t="'group.description'"></v-card-subtitle>

        <v-card-text>
            <group-list
                    @open-delete="openDelete"
                    @open-edit="openEdit"
                    @open-show="openShow"
                    :items="items" :totalItems="totalItems" :loading="loading"
                    @update="loadGroups"
            ></group-list>
        </v-card-text>

        <v-dialog :value="showing" width="850" persistent>
            <group-show :item="itemToShow" v-if="showing" v-on:closeDialog="showing=false"/>
        </v-dialog>

        <v-dialog :value="deleting" width="850" persistent>
            <group-delete :item="itemToDelete"
                          v-if="deleting"
                          @groupDeleted="onGroupDeleted"
                          v-on:closeDialog="deleting=false"
            />
        </v-dialog>

        <v-dialog :value="creating" width="850" fullscreen persistent>
            <group-create v-if="creating"
                          v-on:groupCreated="onGroupCreated"
                          v-on:closeDialog="creating=false"
            />
        </v-dialog>

        <v-dialog :value="updating" width="850" persistent>
            <group-update v-if="updating"
                          :item="itemToEdit"
                          v-on:groupUpdated="onGroupUpdated"
                          v-on:closeDialog="updating=false"
            />
        </v-dialog>

        <add-button  @click="creating = true"></add-button>

        <snackbar :message="flashMessage"/>
    </v-card>
</template>

<script>
    import GroupShow from "./GroupShow";
    import GroupDelete from "./GroupDelete";
    import GroupCreate from "./GroupCreate";
    import GroupUpdate from "./GroupUpdate";
    import GroupList from "./GroupList";
    import GroupProvider from "../../providers/GroupProvider";
    import AddButton from "../../components/AddButton/AddButton";
    import Snackbar from "../../components/Snackbar/Snackbar";

    export default {
        name: "GroupCrud",
        components: {Snackbar, AddButton, GroupList, GroupUpdate, GroupCreate, GroupDelete, GroupShow},
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
                loading: false,
                flashMessage: null
            }
        },
        created() {
            this.loadGroups()
        },
        methods: {
            onGroupCreated(item) {
                this.items.push(item)
                this.totalItems++
                this.flashMessage = this.$t('group.created')
            },
            onGroupUpdated(item) {
                let index = this.items.findIndex(i => i.id == item.id)
                this.$set(this.items, index, item)
                this.flashMessage = this.$t('group.updated')
            },
            onGroupDeleted(item){
                let index = this.items.findIndex(i => i.id == item.id)
                this.totalItems--
                this.items.splice(index,1)
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
                pageNumber: 1,
                itemsPerPage: 5,
                search: ''
            }) {
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