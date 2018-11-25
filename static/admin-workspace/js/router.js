import VueRouter from 'vue-router';
import App from './../vue-components/App'
import Main from './../vue-components/Main.vue'
import UsersList from '../vue-components/users/UserList.vue'
import UserForm from '../vue-components/users/UserForm.vue'

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
                        },
                        {
                            path: '/main/users/edit/:userId',
                            component: UserForm,
                            props: true,
                            name: 'Редактирование пользователя'
                        },
                        {
                            path: '/main/users/create',
                            component: UserForm,
                            name: 'Создание пользователя'
                        }
                    ]
                }
            ]
        },
        {
            path: '/main/users*',
            redirect: '/main/users'
        }
    ]
});

export default router;