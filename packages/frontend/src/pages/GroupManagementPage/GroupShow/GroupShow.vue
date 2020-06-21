<template>
    <v-card>

        <v-toolbar  flat dark color="primary">
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn icon dark @click="$emit('closeDialog')">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
            <group-show-data :item="item" />
        </v-card-text>


        <v-card-actions>
            <v-btn color="grey" tile outlined @click="$emit('closeDialog')">
                {{$t('common.close')}}
            </v-btn>
            <v-spacer></v-spacer>
        </v-card-actions>

    </v-card>
</template>

<script>
    import GroupShowData from "./GroupShowData";

    export default {
        name: "GroupShow",
        components: {GroupShowData},
        props: {
            item: Object
        },
        data() {
            return {
                title: "Detalles de Group",
            }
        },
    }
</script>

