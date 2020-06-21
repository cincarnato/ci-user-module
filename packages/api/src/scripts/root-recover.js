import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', true)

import {findUserByUsername,changeRecoveryPassword} from '../services/UserService'
import {INIT_USER_ADMIN} from '../roles'

findUserByUsername("root").then(rootUser => {
    changeRecoveryPassword(rootUser.id, {
        newPassword: INIT_USER_ADMIN.password,
    },rootUser).then(result => {
        console.log(result)
        process.exit()
    })
})
