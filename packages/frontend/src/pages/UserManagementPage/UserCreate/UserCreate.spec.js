import {mount, createLocalVue} from '@vue/test-utils'

export const localVue = createLocalVue()

import i18n from "../../../i18n"
import vuetify from "../../../plugins/vuetify-manual"

import UserCreate from "./UserCreate";

//GraphQl Client Mock
import mockGqlClient from '../../../../gqlc-mock/gqlc-mock-data'
import UserProvider from "../../../providers/UserProvider";
import RoleProvider from "../../../providers/RoleProvider";
import GroupProvider from "../../../providers/GroupProvider";

RoleProvider.setGqlc(mockGqlClient)
GroupProvider.setGqlc(mockGqlClient)
UserProvider.setGqlc(mockGqlClient)

import {SubmitButton} from "../../../components/SubmitButton";
import flushPromises from "flush-promises";

describe('UserCreate.vue', () => {


    it('username and email unique', async () => {


        const wrapper = mount(UserCreate, {
                vuetify,
                localVue,
                i18n,
                data() {
                    return {
                        title: this.$t('user.createTitle'),
                        errorMessage: null,
                        loading: false,
                        loadingRoles: false,
                        loadingGroups: false,
                        roles: [],
                        groups: [],
                        form: {
                            name: "jhon doe",
                            username: 'jhon.doe',
                            email: 'jhon.doe@gmail.com',
                            phone: '123',
                            password: '123',
                            password_verify: '123',
                            role: 1,
                            groups: [],
                            active: true
                        }
                    }
                }
            }
        )



        console.log('Before click: ', wrapper.text())
        wrapper.findComponent(SubmitButton).trigger('click')
        console.log('CLICK')
        await flushPromises()
        await wrapper.vm.$nextTick()
        await wrapper.vm.$nextTick()
        console.log('After click: ', wrapper.text())

        expect(wrapper.text()).toMatch('unique')
    })

})