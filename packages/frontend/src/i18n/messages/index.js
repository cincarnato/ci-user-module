import merge from 'deepmerge'
import UserMessages from './user-messages'
import ClientMessages from './client-messages'
import GroupMessages from './group-messages'
import RoleMessages from './role-messages'
import CommonMessages from './common-messages'
import VuetifyMessages from './vuetify-messages'
import AuthMessages from './auth-messages'
import AuditMessages from './audit-messages'
import MetricsMessages from './metrics-messages'
import SessionMessages from './session-messages'

const messages = merge.all([
    UserMessages,
    ClientMessages,
    GroupMessages,
    RoleMessages,
    CommonMessages,
    VuetifyMessages,
    AuthMessages,
    AuditMessages,
    MetricsMessages,
    SessionMessages
])

export default messages
