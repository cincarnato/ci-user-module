<template>

    <v-card>
        <v-card-title>

        </v-card-title>
        <v-card-text class="ma-0">
            <v-alert :value="true" color="success" class="ma-0" icon="check_circle" outlined>
                {{message}}
            </v-alert>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" outlined  @click="close" v-t="'common.close'">

            </v-btn>
        </v-card-actions>
    </v-card>

</template>

<script>

    import {mapActions, mapState} from "vuex";

    export default {
        name: "ProfilePasswordConfirm",
        computed: {
            ...mapState({
                message: s => s.profile.changePasswordMessage
            }),
        },
        methods: {
            close(){
                this.$emit('close')
                this.resetPasswordStatus()
            },
            ...mapActions(['resetPasswordStatus']),
        }
    }
</script>

<style scoped>

</style>
