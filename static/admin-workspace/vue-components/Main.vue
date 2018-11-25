<template>
    <div class="admin-workspace-main-container">
        <Sidebar/>
        <div class="main-panel">
            <div class="header-container">
                <h1>{{this.$route.name}}</h1>
                <md-menu md-size="auto" md-align-trigger class="user-menu">
                    <md-button md-menu-trigger>
                        <img src="/resources/icons/knight-head-1-black.svg"/>
                    </md-button>
                    <md-menu-content class="admin-workspace-user-menu-content">
                        <md-menu-item>
                            <a class="logout-button" href="/admin/logout">
                                <img src="/resources/icons/logout.svg"/>
                                <span>Выйти</span>
                            </a>
                        </md-menu-item>
                    </md-menu-content>
                </md-menu>
            </div>
            <div :class="['body-container', animateBodyWidthClass]" id="AdminWorkspaceBodyContainer">
                <router-view
                        v-on:startLoading="onStartLoading"
                        v-on:endLoading="onEndLoading"
                />
                <QsimModalPopup v-if="adminWorkspaceBodyLoadingState.isLoading">
                    <template slot="footer">
                        <md-progress-bar md-mode="indeterminate"></md-progress-bar>
                    </template>
                     <template slot="body">
                         {{adminWorkspaceBodyLoadingState.text}}
                     </template>
                </QsimModalPopup>
            </div>
        </div>
    </div>
</template>

<script>
    import Sidebar from './Sidebar.vue'
    import QsimModalPopup from './../../common/vue-components/ModalPopup.vue'

    export default {
        name: 'admin-workspace-main-container',
        components: {
            Sidebar,
            QsimModalPopup
        },
        data() {
            return {
                animateBodyWidthClass: 'body-width-animate',
                adminWorkspaceBodyLoadingState: {
                    text: '',
                    isLoading: false,
                    timeoutId: null
                }
            }
        },
        watch: {
            $route(to, from) {
                var bodyContainer = document.getElementById('AdminWorkspaceBodyContainer');
                bodyContainer.classList.remove(this.animateBodyWidthClass);
                window.setTimeout(() => bodyContainer.classList.add(this.animateBodyWidthClass), 100);
                this.setBodyLoading(false);
            }
        },
        methods: {
            onStartLoading(params) {
                Object.assign(this.adminWorkspaceBodyLoadingState, params);
                this.setBodyLoading(true);
            },
            onEndLoading() {
                this.setBodyLoading(false);
            },
            setBodyLoading(isLoading) {
                if(isLoading) {
                    this.adminWorkspaceBodyLoadingState.timeoutId = window.setTimeout(() => {
                        this.setBodyLoadingCore(true);
                    }, 500);
                } else {
                    this.setBodyLoadingCore(false);
                }
            },
            setBodyLoadingCore(isLoading) {
                Object.assign(this.adminWorkspaceBodyLoadingState, {isLoading: isLoading});
                window.clearTimeout(this.adminWorkspaceBodyLoadingState.timeoutId);
            }
        }
    }
</script>

<style lang="scss">
    .admin-workspace-main-container {
        overflow: hidden;
        height: 100%;

        .qsim-sidebar {
            float: left;
        }

        .main-panel {
            overflow: hidden;
            width: calc(100% - 200px);
            height: 100%;
            float: left;

            .header-container {
                height: 50px;
                box-sizing: border-box;
                border-bottom: 1px solid #EEE;
                padding: 8px 20px;
                h1 {
                    font-size: 1.5em;
                    color: #3c4858;
                    display: inline-block;
                    margin-top: 5px;
                }

                .user-menu {
                    float: right;
                    .md-button {
                        min-width: 32px;
                        img {
                            height: 32px;
                        }
                    }
                }
            }
            .body-container {
                width: 0;
                height: calc(100% - 50px);
                overflow: auto;
                padding: 8px 20px;
                position: relative;
                &.body-width-animate {
                    width: 100%;
                    transition: width 0.3s;
                }
            }
        }
    }

    .admin-workspace-user-menu-content .md-list-item-content {
        a:hover {
            text-decoration: none;
            img {
                opacity: 1;
            }
        }
        img {
            margin-right: 10px;
            height: 24px;
            opacity: 0.8;
        }
    }
</style>