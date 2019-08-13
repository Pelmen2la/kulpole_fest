<template>
    <ListPage
            ref="ListPage"
            :pageStateName="pageStateName"
            dataTypeMultipleName="eventRequests"
            dataTypeMultipleText="заявок"
            :hideAddButton="true"
            :getLoadDataExtraParams="getLoadDataExtraParams"
            :gridColumnsCfg="getGridColumnCfg()">
        <template slot="filters_container">
            <md-field>
                <label>Поиск</label>
                <md-input @keyup="onSearchTextChange" v-model="getPageState().searchText"/>
            </md-field>
            <div class="event-request-list-top-filters-container">
                <md-field>
                    <label>Фильтр по костюму</label>
                    <md-select v-model="getPageState().isCostumeAcceptedFilter" @md-selected="onComboFilterChange">
                        <md-option v-for="(filter, index) in wearFilterComboData" :value="filter.id" :key="index">
                            {{filter.name}}
                        </md-option>
                    </md-select>
                </md-field>
                <md-field>
                    <label>Фильтр по доспеху</label>
                    <md-select v-model="getPageState().isArmorAcceptedFilter" @md-selected="onComboFilterChange">
                        <md-option v-for="(filter, index) in wearFilterComboData" :value="filter.id" :key="index">
                            {{filter.name}}
                        </md-option>
                    </md-select>
                </md-field>
                <md-field>
                    <label>Фильтр по региону</label>
                    <md-select v-model="getPageState().regionFilter" @md-selected="onComboFilterChange" multiple>
                        <md-option v-for="(regionName, regionId) in regions" :value="regionId" :key="regionId">
                            {{regionName}}
                        </md-option>
                    </md-select>
                </md-field>
            </div>
            <div class="event-request-list-bottom-filters-container">
                <md-field>
                    <label>Фильтр по статусу</label>
                    <md-select v-model="getPageState().statusFilter" @md-selected="onComboFilterChange">
                        <md-option v-for="(statusName, statusId) in statuses" :value="statusId" :key="statusId">
                            {{statusName}}
                        </md-option>
                    </md-select>
                </md-field>
                <md-field>
                    <label>Фильтр по клубу</label>
                    <md-select v-model="getPageState().clubFilter" @md-selected="onComboFilterChange">
                        <md-option v-for="club in clubsData" :value="club.name" :key="club.name">
                            {{club.name}}
                        </md-option>
                    </md-select>
                </md-field>
            </div>
        </template>
    </ListPage>
</template>

<script>
    import utils from '../../../common/js/utils'
    import ListPage from './../common/ListPage.vue'

    export default {
        name: 'news-list-page',
        components: {
            ListPage
        },
        data() {
            return {
                pageStateName: 'eventRequestsPage',
                loadDataTimeoutId: null,
                wearFilterComboData: [
                    {id: 'all', name: 'Все'},
                    {id: 'yes', name: 'Допущен'},
                    {id: 'no', name: 'Не допущен'}
                ],
                clubsData: []
            }
        },
        methods: {
            getPageState: function() {
                return this.$store.state[this.pageStateName];
            },
            getLoadDataExtraParams: function() {
                const state = this.getPageState();
                var params = {
                    searchText: state.searchText
                };
                ['isCostumeAcceptedFilter', 'isArmorAcceptedFilter'].forEach((propName) => {
                    if(state[propName] !== 'all') {
                        params[propName.replace('Filter', '')] = state[propName];
                    }
                });
                params.regionFilter = state.regionFilter;
                if(state.statusFilter && state.statusFilter !== 'all') {
                    params.statusFilter = state.statusFilter;
                }
                if(state.clubFilter && state.clubFilter !== 'Все') {
                    params.clubFilter = state.clubFilter;
                }
                return params;
            },
            getGridColumnCfg: function() {
                return [
                    {
                        text: 'Название мероприятия',
                        dataIndex: 'eventData',
                        renderer: (rec, val) => val.length ? val[0].title : 'Мероприятие удалено'
                    },
                    {
                        text: 'Имя участника',
                        dataIndex: 'userData',
                        renderer: (rec, val) => val.length ? val[0].fullName : 'Участник удален'
                    },
                    {
                        text: 'Регион',
                        dataIndex: 'region',
                        renderer: (rec, val) => this.regions[val]
                    },
                    {text: 'Костюм допущен', dataIndex: 'isCostumeAccepted', renderType: 'boolIcon'},
                    {text: 'Доспех допущен', dataIndex: 'isArmorAccepted', renderType: 'boolIcon'},
                    {text: 'Дата', dataIndex: 'date', renderType: 'date'}
                ];
            },
            onSearchTextChange: function() {
                window.clearTimeout(this.loadDataTimeoutId);
                this.loadDataTimeoutId = window.setTimeout(this.loadData.bind(this), 300);
            },
            onComboFilterChange: function() {
                this._isMounted && this.loadData();
            },
            loadData: function() {
                this.$refs.ListPage.loadPageByIndex(0);
            },
            loadClubs: function() {
                utils.doRequest('/admin/workspace/clubs', {}, (data) => {
                    const clubs = data.content;
                    clubs.unshift({id: 'all', name: 'Все'});
                    this.clubsData = data.content;
                });
            }
        },
        computed: {
            regions() {
                return window.kulpoleAppData.textResources.eventRequestRegions;
            },
            statuses() {
                return Object.assign({
                    all: 'Все'
                }, window.kulpoleAppData.textResources.eventRequestStatuses);
            }
        },
        mounted: function() {
            this.loadClubs();
        }
    }
</script>

<style lang="scss" scoped>
    .event-request-list-top-filters-container .md-field {
        width: 32%;
        float: left;

        &:not(:last-child) {
            margin-right: 2%;
        }
    }
    .event-request-list-bottom-filters-container .md-field {
        width: 49%;
        float: left;

        &:not(:last-child) {
            margin-right: 2%;
        }
    }
</style>