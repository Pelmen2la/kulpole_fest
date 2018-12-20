<template>
    <ListPage
            ref="ListPage"
            dataTypeMultipleName="eventRequests"
            dataTypeMultipleText="заявок"
            :hideAddButton="true"
            :getLoadDataExtraParams="getLoadDataExtraParams"
            :gridColumnsCfg="getGridColumnCfg()">
        <template slot="filters_container">
            <md-field>
                <label>Поиск</label>
                <md-input @keyup="onSearchTextChange" v-model="searchText"/>
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
                searchText: '',
                loadDataTimeoutId: null
            }
        },
        methods: {
            getLoadDataExtraParams: function() {
                return {
                    searchText: this.searchText
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