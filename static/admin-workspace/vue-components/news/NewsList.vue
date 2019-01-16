<template>
    <ListPage
            ref="ListPage"
            pageStateName="newsPage"
            dataTypeMultipleName="news"
            dataTypeMultipleText="новостей"
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
                searchText: ''
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
                    {text: 'Заголовок', dataIndex: 'title'},
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