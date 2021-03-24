<template>
    <div>
        <ListPage
                ref="ListPage"
                :pageStateName="pageStateName"
                dataTypeMultipleName="clubs"
                dataTypeMultipleText="клубов"
                :hideAddButton="true"
                :hideGridEditBtn="true"
                :getLoadDataExtraParams="getLoadDataExtraParams"
                :gridColumnsCfg="getGridColumnCfg()">
            <template slot="filters_container">
                <div class="add-club-panel">
                    <md-field>
                        <label>Введите название клуба</label>
                        <md-input @keyup="onSearchTextChange" v-model="getPageState().searchText"/>
                    </md-field>
                    <md-button class="md-raised md-primary" :disabled="!getPageState().searchText"
                               @click="onAddClubBtnClick">
                        Добавить клуб
                    </md-button>
                </div>
                <div class="join-clubs-panel">
                    <span class="description-text">
                        Клуб
                    </span>
                    <md-field>
                        <label>Выберите клуб</label>
                        <md-select v-model="getPageState().firstClubToJoin">
                            <md-option v-for="club in allClubs" :value="club.name" :key="club.name">
                                {{club.name}}
                            </md-option>
                        </md-select>
                    </md-field>
                    <span class="description-text">
                        будет влит в клуб
                    </span>
                    <md-field>
                        <label>Выберите клуб</label>
                        <md-select v-model="getPageState().secondClubToJoin">
                            <md-option v-for="club in allClubs" :value="club.name" :key="club.name">
                                {{club.name}}
                            </md-option>
                        </md-select>
                    </md-field>
                    <md-button
                            class="md-raised md-primary" :disabled="isJoinClubsButtonDisabled"
                            @click="onJoinClubsButtonClick"
                    >
                        Объединить клубы
                    </md-button>
                </div>
            </template>
        </ListPage>
    </div>
</template>

<script>
    import ListPage from './../common/ListPage.vue'
    import utils from './../../../common/js/utils'

    export default {
        name: 'users-list-page',
        components: {
            ListPage
        },
        data() {
            return {
                pageStateName: 'clubsPage',
                loadDataTimeoutId: null,
                allClubs: [],
            }
        },
        methods: {
            getPageState: function() {
                return this.$store.state[this.pageStateName];
            },
            getLoadDataExtraParams: function() {
                return {
                    searchText: this.getPageState().searchText
                };
            },
            getGridColumnCfg: function() {
                return [
                    {text: 'Название', dataIndex: 'name'}
                ];
            },
            onSearchTextChange: function() {
                window.clearTimeout(this.loadDataTimeoutId);
                this.loadDataTimeoutId = window.setTimeout(this.loadData.bind(this), 300);
            },
            onAddClubBtnClick: function() {
                const clubData = {name: this.getPageState().searchText, isConfirmed: true};
                utils.doDataRequest('/admin/workspace/clubs/', 'POST', clubData, function(res) {
                    this.$refs.ListPage.loadPageByIndex(this.getPageState().grid.pageIndex);
                }.bind(this));
            },
            onJoinClubsButtonClick: function() {
                const {firstClubToJoin, secondClubToJoin} = this.getPageState();
                const data = {firstClubToJoin, secondClubToJoin};
                utils.doDataRequest('/admin/workspace/clubs/join/', 'POST', data, (data) => {
                    const clubToDelete = this.allClubs.find(c => c.name === firstClubToJoin);
                    this.allClubs.splice(this.allClubs.indexOf(clubToDelete), 1);
                    this.loadData();
                    this.getPageState().firstClubToJoin = null;
                });
            },
            loadData: function() {
                this.$refs.ListPage.loadPageByIndex(0);
            },
            loadAllClubs: function() {
                utils.doRequest('/admin/workspace/clubs', {}, (data) => {
                    this.allClubs = data.content;
                });
            }
        },
        computed: {
            isJoinClubsButtonDisabled() {
                const {firstClubToJoin, secondClubToJoin} = this.getPageState();
                return !firstClubToJoin || !secondClubToJoin || firstClubToJoin === secondClubToJoin;
            }
        },
        mounted: function() {
            this.loadAllClubs();
        }
    }
</script>

<style lang="scss" scoped>
    .add-club-panel {
        display: flex;
        margin-bottom: 10px;
        align-items: center;

        .md-field {
            width: 400px;
            margin-right: 10px;
        }
    }

    .join-clubs-panel {
        display: flex;
        align-items: center;

        .description-text {
            white-space: nowrap;
            margin-right: 10px;

            &:not(:first-child) {
                margin-left: 10px;
            }
        }

        .md-field {
            max-width: 300px;
        }

        .md-button {
            width: 160px;
            min-width: 160px;
        }
    }
</style>