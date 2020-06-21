<template>

    <v-container v-if="isAuth" fluid fill-height class="grey lighten-3">
        <v-card class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 offset-sm-2 col-sm-8 col-xs-12 offset-xs-0 elevation-12" width="100%">

            <v-card-text class="text-center">
                <profile-avatar :me="me"/>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
                <profile-details :me="me"/>
            </v-card-text>

            <v-card-text class="text-center pt-0 pb-3">
                <v-btn color="secondary" class="onSecondary--text"
                       @click="openDialog" v-t="'user.changeYourPassword'">
                </v-btn>
            </v-card-text>
        </v-card>

        <profile-password :openDialog="dialog" @closeDialog="dialog = false"/>

    </v-container>
</template>

<script>
    import {mapGetters} from 'vuex'
    import ProfileAvatar from "./ProfileAvatar";
    import ProfileDetails from "./ProfileDetails";
    import ProfilePassword from "./ProfilePassword";

    export default {
        name: "Profile",
        components: {ProfilePassword, ProfileDetails, ProfileAvatar},
        data: () => {
            return {
                dialog: false
            }
        },
        computed: {
            ...mapGetters([
                'isAuth',
                'me'
            ]),
        },
        methods: {
            openDialog() {
                this.dialog = true
            }
        }
    }
</script>

<style scoped>

</style>