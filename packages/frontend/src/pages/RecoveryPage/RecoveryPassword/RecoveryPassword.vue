<template>
    <v-card class="mx-auto elevation-8">

        <v-card-text class="pt-4 px-8 my-0 pb-0 text-center">
            <v-btn fab dark color="primary">
                <v-icon>lock</v-icon>
            </v-btn>
            <h2 class="mt-3" v-t="'auth.passwordRecovery'"></h2>
        </v-card-text>

        <v-card-text v-if="recoverStatus" class="pb-1">
            <recovery-password-success></recovery-password-success>
        </v-card-text>

        <v-card-text v-else-if="tokenStatus" class="pb-1">
            <recovery-password-change-form @recover="recover"></recovery-password-change-form>
        </v-card-text>

        <v-card-text v-else class="pb-1">
            <recovery-password-invalid-token></recovery-password-invalid-token>
        </v-card-text>

    </v-card>

</template>

<script>
    import {mapActions} from 'vuex'
    import RecoveryPasswordChangeForm from "./RecoveryPasswordForm";
    import RecoveryPasswordInvalidToken from "./RecoveryPasswordInvalidToken";

    export default {
        name: "RecoveryPassword",
        components: {RecoveryPasswordInvalidToken, RecoveryPasswordChangeForm},
        data: () => {
            return {
                tokenStatus: null,
                recoverStatus: null,
            }
        },
        methods: {
            ...mapActions(['verifyToken']),
            recover(status) {
                this.recoverStatus = status
            }
        },
        mounted() {
            this.tokenStatus = this.verifyToken(this.$route.params.token)
        }
    }
</script>
