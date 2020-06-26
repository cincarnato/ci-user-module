import {
    recoveryChangePassword,
    recoveryPassword
} from "../../services/RecoveryService";

export default {
    Mutation: {
        recoveryChangePassword: (_, {token, newPassword}, {user, req}) => {
            return recoveryChangePassword(token, newPassword, user, req)
        },
        recoveryByEmail: (_, {email}) => {
            return recoveryPassword(email)
        },
    }

}
