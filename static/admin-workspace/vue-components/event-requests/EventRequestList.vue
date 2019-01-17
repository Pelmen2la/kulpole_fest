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
                loadDataTimeoutId: null
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
                    {text: 'Статус', dataIndex: 'status'},
                    {text: 'Дата', dataIndex: 'date'}
                ];
            },
            onSearchTextChange: function() {
                window.clearTimeout(this.loadDataTimeoutId);
                this.loadDataTimeoutId = window.setTimeout(this.loadData.bind(this), 300);
            },
            loadData: function() {
                this.$refs.ListPage.loadPageByIndex(0);
            }
        }
    }
</script>