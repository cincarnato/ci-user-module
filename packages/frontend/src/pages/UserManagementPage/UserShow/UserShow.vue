<template>
    <v-card>
        <toolbar-dialog-card
                title="user.showTitle"
                @close="$emit('closeDialog')"
        />
        <v-card-text>
            <user-show-data :item="item"/>
        </v-card-text>


        <v-card-actions>
            <close-button @click="$emit('closeDialog')"></close-button>
            <v-spacer></v-spacer>
        </v-card-actions>

    </v-card>
</template>

<script>
    import UserShowData from "./UserShowData";
    import ToolbarDialogCard from "../../../components/ToolbarDialogCard/ToolbarDialogCard";
    import CloseButton from "../../../components/CloseButton/CloseButton";

    export default {
        name: "UserShow",
        components: {CloseButton, ToolbarDialogCard, UserShowData},
        props: {
            item: Object
        },
        data() {
            return {
                title: this.$t('user.showTitle'),
            }
        },
    }
</script>

