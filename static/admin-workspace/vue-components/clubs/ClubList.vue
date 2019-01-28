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
                <md-field>
                    <label>Введите название клуба</label>
                    <md-input @keyup="onSearchTextChange" v-model="getPageState().searchText"/>
                </md-field>
                <md-button class="md-raised md-primary" :disabled="!getPageState().searchText" @click="onAddClubBtnClick">
                    Добавить клуб
                </md-button>
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
            loadData: function() {
                this.$refs.ListPage.loadPageByIndex(0);
            }
        }
    }
</script>