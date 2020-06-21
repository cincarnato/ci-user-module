import GroupUpdate from "./GroupUpdate"
import i18n from "../../../i18n"
import router from "../../../router"
import store from "../../../store"

const decorator = () => `
        <v-container fluid>
            <v-row>
                <v-col cols="12" md="8" offset-md="2">
                    <story/>
                </v-col>
            </v-row>
        </v-container>`

export default {
    title: "PageComponents/GroupManagement",
    decorators: [decorator]
};


const data = {
        id: 1,
        name: "Developers",
        color: "#00FF00",
        users: [
            {id: 1, username: "jhon.doe"},
            {id: 2, username: "jane.doe"}
        ]
    }

export const groupUpdate = () => ({
    components: {GroupUpdate},
    props: {
        data: {default: data}
    },
    template: '<GroupUpdate :item="data" />',
    i18n, router, store
})
