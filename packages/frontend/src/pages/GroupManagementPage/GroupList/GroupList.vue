<template>
    <v-row row wrap>

        <v-col md6 xs12 class="offset-md6">
            <v-text-field
                    v-model="search"
                    v-on:keyup.native.enter="update"
                    append-icon="search"
                    label="Buscar"
                    hide-details
            />
        </v-col>

        <v-col cols="12">
            <v-data-table class="mt-3" :headers="headers" :items="items"
                          :search="search" :single-expand="false" :loading="loading"
                          :server-items-length="totalItems"
                          :items-per-page.sync="limit" :page.sync="pageNumber"
                          :sort-by.sync="orderBy" :sort-desc.sync="orderDesc"
                          @update:page="update"
                          @update:items-per-page="update"
                          @update:sort-by="update"
                          @update:sort-desc="update"
            >

                <div slot="no-data" color="info" outline class="text-xs-center">Sin datos</div>

                <div slot="loading" outline color="info">Cargando</div>

                <template v-slot:item.avatar="{ item }">
                    <v-avatar size="36px" :color="item.color?item.color:'grey'">
                        <span class="white--text headline">{{item.name.charAt(0)}}</span>
                    </v-avatar>
                </template>

                <template v-slot:item.users="{ item }">
                    <span>
                        {{item.users.map(user => user.username).join(", ")}}
                    </span>
                </template>

                <template v-slot:item.action="{ item }">
                    <v-icon color="info"
                            small class="mr-2"
                            @click="$emit('open-show', item)"
                    >
                        search
                    </v-icon>

                    <v-icon color="primary"
                            small
                            class="mr-2"
                            @click="$emit('open-edit', item)"
                    >
                        edit
                    </v-icon>

                    <v-icon color="red"
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
        name: "GroupList",
        props: {
            items: Array,
            totalItems: Number,
            loading: Boolean
        },
        data() {
            return {
                search: '',
                limit: 5,
                pageNumber: 1,
                orderBy: null,
                orderDesc: false,
                headers: [
                    {text: this.$t('group.label.avatar'), value: 'avatar'},
                    {text: this.$t('group.label.name'), value: 'name'},
                    {text: this.$t('group.label.color'), value: 'color'},
                    {text: this.$t('group.label.users'), value: 'users'},
                    {text: this.$t('common.actions'), value: 'action', sortable: false},
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
        methods: {
            update() {
                this.$emit('update', {
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


