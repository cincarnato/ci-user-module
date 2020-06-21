import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import UserManagementPage from '../pages/UserManagementPage'
import GroupManagementPage from '../pages/GroupManagementPage'
import RoleManagementPage from '../pages/RoleManagementPage'
import RecoveryPage from '../pages/RecoveryPage'
import ActivationPage from '../pages/ActivationPage'
import ProfilePage from '../pages/ProfilePage'
import RegisterPage from '../pages/RegisterPage'

const routes = [
    {name: "home", path: '/home', component: HomePage},
    {name: "login", path: '/login', component: LoginPage},
    {name: "recovery", path: '/recovery', component: RecoveryPage},
    {name: "activation", path: '/activation', component: ActivationPage},
    {name: "profile", path: '/profile', component: ProfilePage},
    {name: "register", path: '/register', component: RegisterPage},

    {name: "userDashboard", path: '/user-dashboard', component: DashboardPage},
    {name: "userManagement", path: '/user-management', component: UserManagementPage},
    {name: "groupManagement", path: '/group-management', component: GroupManagementPage},
    {name: "roleManagement", path: '/role-management', component: RoleManagementPage},

]

export default routes;