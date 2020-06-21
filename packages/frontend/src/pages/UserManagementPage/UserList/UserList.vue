<template>

    <v-row row wrap>
        <v-col cols="12">
            <v-text-field
                    v-model="search"
                    append-icon="search"
                    :label="$t('common.search')"
                    single-line
                    hide-details
                    v-on:keyup.native.enter="updateUsers"
            ></v-text-field>
        </v-col>

        <v-col cols="12">
            <v-data-table
                    class="mt-3"
                    :headers="headers"
                    :items="items"
                    :search="search"
                    :single-expand="false"
                    :server-items-length="totalItems"
                    :items-per-page="itemsPerPage"
                    :loading="loading"
                    :page.sync="pageNumber"
                    :sort-by.sync="orderBy"
                    :sort-desc.sync="orderDesc"
                    @update:page="updateUsers"
                    @update:sort-by="updateUsers"
                    @update:sort-desc="updateUsers"
            >

                <template slot="no-data">
                    <div outline color="info" v-t="'common.noData'"></div>
                </template>

                <template slot="loading">
                    <div color="info" outline class="text-xs-center" v-t="'common.loading'"></div>
                </template>

                <template v-slot:item.img="{ item }">
                    <v-avatar size="36px">
                        <img v-if="item.avatarurl" :src="item.avatarurl"/>
                        <v-icon>user</v-icon>
                    </v-avatar>
                </template>

                <template v-slot:item.active="{ item }">
                    <div v-if="item.active">
                        <v-icon color="success">check_circle</v-icon>
                    </div>
                    <div v-else>
                        <v-icon color="error">highlight_off</v-icon>
                    </div>
                </template>

                <template v-slot:item.action="{ item }">
                    <v-icon
                            small
                            color="info"
                            class="mr-2"
                            @click="$emit('open-show', item)"
                    >
                        search
                    </v-icon>
                    <v-icon
                            small
                            color="purple"
                            class="mr-2"
                            @click="$emit('open-edit', item)"
                    >
                        edit
                    </v-icon>

                    <v-icon
                            small
                            color="purple"
                            class="mr-2"
                            @click="$emit('open-change-password', item)"
                    >
                        lock
                    </v-icon>
                    <v-icon
                            color="red"
                            small
                            class="mr-2"
                            @click="$emit('open-delete', item)"
                    >
                        delete
                    </v-icon>
                </template>

            </v-data-table>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        name: 'UserList',
        props: {
          items: Array,
          totalItems: Number,
          loading: Boolean
        },
        data() {
            return {
                orderBy: null,
                orderDesc: false,
                itemsPerPage: 5,
                pageNumber: 1,
                search: '',
                headers: [
                    {text: '', value: 'img', sortable: false},
                    {text: this.$t('user.label.fullname'), value: 'name'},
                    {text: this.$t('user.label.username'), value: 'username'},
                    {text: this.$t('user.label.email'), value: 'email'},
                    {text: this.$t('user.label.phone'), value: 'phone'},
                    {text: this.$t('user.label.role'), value: 'role.name'},
                    {text: this.$t('user.label.active'), value: 'active'},
                    {text: this.$t('user.label.actions'), value: 'action', sortable: false},
                    {text: '', value: 'data-table-expand'},

                ],
            }
        },
        computed: {
            getOrderBy() {
                return (Array.isArray(this.orderBy)) ? this.orderBy[0] : this.orderBy
            },
            getOrderDesc() {
                return (Array.isArray(this.orderDesc)) ? this.orderDesc[0] : this.orderDesc
            }
        },
        methods:{
            updateUsers(){
                this.$emit('updateUsers',{
                    orderBy: this.getOrderBy,
                    orderDesc: this.getOrderDesc,
                    pageNumber: this.pageNumber,
                    itemsPerPage: this.itemsPerPage,
                    search: this.search
                })
            }
        }

    }
</script>
