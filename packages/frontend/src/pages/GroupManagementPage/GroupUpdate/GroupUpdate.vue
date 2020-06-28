<template>
    <crud-update :open="true"
                 :loading="loading"
                 :title="title"
                 :errorMessage="errorMessage"
                 @update="update"
                 @close="$emit('close')"
    >

        <group-form ref="form" v-model="form" :input-errors="inputErrors"></group-form>
    </crud-update>

</template>

<script>
    import GroupProvider from "../../../providers/GroupProvider";
    import ClientError from '../../../errors/ClientError'
    import InputErrors from "../../../mixins/InputErrors";
    import UserValidations from "../../../mixins/UserValidations";
    import GroupForm from "../GroupForm/GroupForm";
    import {CrudUpdate} from '@ci-common-module/frontend'

    export default {
        name: "GroupUpdate",
        components: {GroupForm,CrudUpdate},
        mixins: [InputErrors, UserValidations],
        props: {
            item: Object
        },
        data() {
            return {
                title: this.$t('group.updateTitle'),
                errorMessage: '',
                inputErrors: {},
                loading: false,
                form: {
                    id: this.item.id,
                    name: this.item.name,
                    color: this.item.color ? this.item.color : '#37474F',
                    users: this.item.users.map(user => user.id?user.id:user )
                },
            }
        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    GroupProvider.updateGroup(this.form).then(r => {
                            if (r) {
                                this.$emit('groupUpdated', r.data.groupUpdate)
                                this.$emit('close')
                            }
                        }
                    ).catch(error => {
                        let clientError = new ClientError(error)
                        this.inputErrors = clientError.inputErrors
                        this.errorMessage = clientError.i18nMessage
                    }).finally(()=>this.loading=false)
                }

            },

        },
    }
</script>

<style scoped>

</style>

