<template>
    <div class="qsim-sidebar">
        <div class="main-menu-wrapper">
            <md-list class="nav">
                <md-list-item>
                    <a class="logo-cnt" href="/">
                        <img src="/resources/images/logo.png"/>
                    </a>
                </md-list-item>
                <md-list-item v-for="(itemCfg, itemIndex) in menuItemsCfg" :key="itemIndex">
                    <router-link :to="itemCfg.url">
                        <img :src="'/resources/icons/' + itemCfg.iconName + '.svg'"/>
                        <span>{{itemCfg.text}}</span>
                    </router-link>
                </md-list-item>
            </md-list>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'sidebar',
        data() {
            return {
                menuItemsCfg: [
                    {
                        text: 'Пользователи',
                        url: '/main/users',
                        iconName: 'knight-head-2'
                    },
                    {
                        text: 'Новости',
                        url: '/main/news',
                        iconName: 'parchment'
                    },
                    {
                        text: 'События',
                        url: '/main/events',
                        iconName: 'swords-cross'
                    }
                ]
            }
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .qsim-sidebar {
        height: 100%;
    }

    .main-menu-wrapper {
        width: 200px;
        height: 100%;
        background-color: rgba(59, 59, 59, 0.9);

        .md-list {
            height: 100%;
            background-color: rgba(59, 59, 59, 0.9);

            a {
                padding: 15px;
                text-decoration: none;
                span {
                    color: white;
                }
            }
            a.logo-cnt {
                padding-top: 0;
                img {
                    width: 100%;
                }
            }
            a:not(.logo-cnt) {
                width: 100%;
                border-radius: 2px;
                &.router-link-active,
                &:hover {
                    background-color: hsla(0, 0%, 78.4%, .2);
                }
                img {
                    height: 25px;
                    width: 25px;
                    margin-right: 20px;
                }
            }
        }
    }
</style>