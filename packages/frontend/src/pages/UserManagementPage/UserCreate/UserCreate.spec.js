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

describe('StartRecoveryForm', () => {


    it('username and email unique', async () => {


        const wrapper = mount(UserCreate, {
                vuetify,
                localVue,
                i18n,
            }
        )

        wrapper.setData({
            form: {
                name: "jhon doe",
                username: 'jhon.doe',
                email: 'jhon.doe@gmail.com',
                phone: '123',
                password: '123',
                password_verify: '123',
                role: '1',
                groups: []
            }
        })

        console.log('After click: ', wrapper.text())
        wrapper.findComponent(SubmitButton).trigger('click')
        await flushPromises()
        //await wrapper.vm.$nextTick()
        console.log('After click: ', wrapper.text())

        expect(wrapper.text()).toMatch('unico')
    })

})