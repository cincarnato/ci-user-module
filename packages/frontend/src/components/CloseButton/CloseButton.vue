<template>
    <v-btn
            tile
            outlined
            color="grey"
            v-on="$listeners"
            v-t="text"
    >
    </v-btn>
</template>

<script>
    export default {
        name: "CloseButton",
        props: {
            text: {type: String, default: "common.close"},
            loading: {type: Boolean, default: false}
        }
    }
</script>

<style scoped>

</style>