<template>
    <ListPage
            ref="ListPage"
            :pageStateName="pageStateName"
            dataTypeMultipleName="news"
            dataTypeMultipleText="новостей"
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
                pageStateName: 'newsPage',
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
                    {text: 'Заголовок', dataIndex: 'title'},
                    {text: 'Дата', dataIndex: 'date', renderType: 'date'}
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