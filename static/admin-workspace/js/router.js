import VueRouter from 'vue-router';
import App from './../vue-components/App'
import Main from '../vue-components/common/Main.vue'
import UsersList from '../vue-components/users/UserList.vue'
import UserForm from '../vue-components/users/UserForm.vue'
import NewsList from '../vue-components/news/NewsList.vue'
import NewsForm from '../vue-components/news/NewsForm.vue'

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
                        },
                        {
                            path: '/main/news',
                            component: NewsList,
                            name: 'Список новостей'
                        },
                        {
                            path: '/main/news/edit/:userId',
                            component: NewsForm,
                            props: true,
                            name: 'Редактирование новости'
                        },
                        {
                            path: '/main/news/create',
                            component: NewsForm,
                            name: 'Создание новости'
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
            path: '/main/news*',
            redirect: '/main/news'
        }
    ]
});

export default router;