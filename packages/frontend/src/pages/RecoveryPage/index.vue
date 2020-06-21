<template>
    <v-container fluid fill-height class="grey lighten-3">
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <recovery-password v-if="isToken" ></recovery-password>
                <start-recovery-form v-else/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    import StartRecoveryForm from './StartRecoveryForm'
    import RecoveryPassword from "./RecoveryPassword/RecoveryPassword";

    export default {
        name: "Recovery",
        components: {RecoveryPassword, StartRecoveryForm},
        computed: {
            isToken(){
                return !!this.$route.params.token
            }
        }
    }
</script>

