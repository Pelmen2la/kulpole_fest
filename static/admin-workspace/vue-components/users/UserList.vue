<template>
    <ListPage
            ref="ListPage"
            :pageStateName="pageStateName"
            dataTypeMultipleName="users"
            dataTypeMultipleText="пользователей"
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
        name: 'users-list-page',
        components: {
            ListPage
        },
        data() {
            return {
                pageStateName: 'usersPage',
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
                        text: 'Имя',
                        dataIndex: 'name',
                        renderer: function(rec, val) {
                            return rec.name + ' ' + rec.surname;
                        }
                    },
                    {text: 'Email', dataIndex: 'email'},
                    {text: 'Телефон', dataIndex: 'phone'}
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