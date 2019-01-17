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
            <div class="left-right-container">
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
            </div>
        </template>
    </ListPage>
</template>

<script>
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
                ]
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
                        renderer: (rec, val) => val.length ? val[0].name + ' ' + val[0].surname : 'Участник удален'
                    },
                    {text: 'Костюм допущен', dataIndex: 'isCostumeAccepted', renderType: 'boolIcon'},
                    {text: 'Доспех допущен', dataIndex: 'isArmorAccepted', renderType: 'boolIcon'},
                    {text: 'Дата', dataIndex: 'date'}
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
            }
        }
    }
</script>