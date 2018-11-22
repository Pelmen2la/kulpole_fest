import VueRouter from 'vue-router';
import App from './../vue-components/App'
import Main from './../vue-components/Main.vue'
import UsersList from '../vue-components/users/UserList.vue'

const router = new VueRouter({
    routes: [
        {
            path: '*',
            redirect: '/main/interviews'
        },
        {
            path: '/',
            component: App,
            children: [
                {
                    path: '/main',
                    component: Main,
                    children: [
                        {
                            path: '/main/users',
                            component: UsersList,
                            name: 'Список пользователей'
                        }
                    ]
                }
            ]
        },
        {
            path: '/main/users*',
            redirect: '/main/users'
        },
        {
            path: '/main/tasks*',
            redirect: '/main/tasks'
        },
        {
            path: '/main/checkers*',
            redirect: '/main/checkers'
        }
    ]
});

export default router;