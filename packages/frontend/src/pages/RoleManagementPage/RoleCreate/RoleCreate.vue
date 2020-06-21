<template>
  <v-card>

    <toolbar-dialog-card :title="title" @close="$emit('closeDialog')"></toolbar-dialog-card>

    <v-card-text class="pt-3">
      <v-alert v-if="errorMessage" type="error" dense text>{{errorMessage}}</v-alert>
    </v-card-text>

    <v-card-text>
      <v-form ref="form" autocomplete="off" @submit.prevent="save">
        <v-col cols="12" sm="6">
          <v-text-field
                  prepend-icon="account_box"
                  name="name"
                  type="text"
                  v-model="form.name"
                  :label="$t('role.label.name')"
                  :placeholder="$t('role.label.name')"
                  class="pa-3"
                  :rules="requiredRule"
                  :error="hasInputErrors('name')"
                  :error-messages="getInputErrors('name')"
                  required
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-row>
            <v-col cols="12" class="py-0" v-for="(permission,index) in permissions" :key="index">

              <v-checkbox v-model="form.permissions"
                          :label="getPermissionsTranslation(permission)"
                          :value="permission"
                          @input="inputPermission(permission)"
                          dense hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-col>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <close-button @click="$emit('closeDialog')"></close-button>
      <v-spacer></v-spacer>
      <submit-button @click="save" :loading="loading"></submit-button>
    </v-card-actions>
  </v-card>
</template>

<script>
  import RoleProvider from "../../../providers/RoleProvider";
  import ClientError from "../../../errors/ClientError";
  import CloseButton from "../../../components/CloseButton/CloseButton";
  import SubmitButton from "../../../components/SubmitButton/SubmitButton";
  import ToolbarDialogCard from "../../../components/ToolbarDialogCard/ToolbarDialogCard";
  import InputErrors from "../../../mixins/InputErrors";
  import UserValidations from "../../../mixins/UserValidations";
  import {RoleMixin} from "../RoleMixin";


  export default {
    name: "RoleUpdate",
    components: {ToolbarDialogCard, SubmitButton, CloseButton},
    mixins: [InputErrors, UserValidations, RoleMixin],
    props: {
      permissions: Array,
    },
    data() {
      return {
        title: "role.createTitle",
        errorMessage: "",
        inputErrors: {},
        loading: false,
        form: {
          name: null,
          permissions: []
        }

      };
    },
    computed:{
      hasPermission(){
        return (permission) => {
          return this.form.permissions.includes(permission)
        }
      }
    },

    methods: {
      inputPermission(permission){
        if(this.hasPermission(permission)){
          this.form.permissions = this.form.permissions.filter(p => p != permission)
        }else{
          this.form.permissions.push(permission)
        }
      },
      save() {
        if (this.$refs.form.validate()) {
          this.loading = true
          RoleProvider.roleCreate(this.form)
                  .then(r => {
                    if (r) {
                      this.$emit("roleCreated", r.data.roleCreate)
                      this.$emit("closeDialog")
                    }
                  })
                  .catch(error => {
                    let clientError = new ClientError(error);
                    this.inputErrors = clientError.inputErrors
                    this.errorMessage = clientError.i18nMessage
                  }).finally(() => this.loading = false)
        }
      },
    }
  };
</script>

<style scoped>
</style>

