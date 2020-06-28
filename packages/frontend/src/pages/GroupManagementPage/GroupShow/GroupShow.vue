<template>
    <crud-show :open="open"  @close="$emit('close')">

        <v-card-text>
            <group-show-data :item="item" />
        </v-card-text>


    </crud-show>
</template>

<script>
    import GroupShowData from "./GroupShowData";
    import {CrudShow} from '@ci-common-module/frontend'

    export default {
        name: "GroupShow",
        components: {GroupShowData, CrudShow},
        props: {
            item: Object,
            open: Boolean
        },
        data() {
            return {
                title: "Detalles de Group",
            }
        },
    }
</script>

