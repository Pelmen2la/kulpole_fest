import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './../vue-components/App'
import Main from '../vue-components/common/Main.vue'
import UserList from '../vue-components/users/UserList.vue'
import UserForm from '../vue-components/users/UserForm.vue'
import SystemUserList from '../vue-components/system-users/SystemUserList.vue'
import SystemUserForm from '../vue-components/system-users/SystemUserForm.vue'
import NewsList from '../vue-components/news/NewsList.vue'
import NewsForm from '../vue-components/news/NewsForm.vue'
import EventList from '../vue-components/events/EventList.vue'
import EventForm from '../vue-components/events/EventForm.vue'
import EventRequestList from '../vue-components/event-requests/EventRequestList.vue'
import EventRequestForm from '../vue-components/event-requests/EventRequestForm.vue'
import ClubList from '../vue-components/clubs/ClubList.vue'

Vue.use(VueRouter);

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
                            path: '/main/eventRequests',
                            component: EventRequestList,
                            name: 'Список заявок'
                        },
                        {
                            path: '/main/eventRequests/edit/:eventRequestId',
                            component: EventRequestForm,
                            props: true,
                            name: 'Просмотр заявки'
                        },
                        {
                            path: '/main/events',
                            component: EventList,
                            name: 'Список событий'
                        },
                        {
                            path: '/main/events/edit/:eventId',
                            component: EventForm,
                            props: true,
                            name: 'Редактирование события'
                        },
                        {
                            path: '/main/events/create',
                            component: EventForm,
                            name: 'Создание события'
                        },
                        {
                            path: '/main/news',
                            component: NewsList,
                            name: 'Список новостей'
                        },
                        {
                            path: '/main/news/edit/:newsId',
                            component: NewsForm,
                            props: true,
                            name: 'Редактирование новости'
                        },
                        {
                            path: '/main/news/create',
                            component: NewsForm,
                            name: 'Создание новости'
                        },
                        {
                            path: '/main/users',
                            component: UserList,
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
                            path: '/main/clubs',
                            component: ClubList,
                            name: 'Список клубов'
                        },
                        {
                            path: '/main/systemUsers',
                            component: SystemUserList,
                            name: 'Список членов исторической комиссии'
                        },
                        {
                            path: '/main/systemUsers/edit/:systemUserId',
                            component: SystemUserForm,
                            props: true,
                            name: 'Редактирование члена исторической комиссии'
                        },
                        {
                            path: '/main/systemUsers/create',
                            component: SystemUserForm,
                            name: 'Создание члена исторической комиссии'
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