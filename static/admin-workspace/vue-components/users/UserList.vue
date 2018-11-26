<template>
    <div>
        <md-button class="md-raised md-primary" href="#/main/users/create">Создать</md-button>
        <MaterialGrid
                :columnConfig="getGridColumnCfg()"
                :data="gridData"
                :hasEdit="true"
                :hasDelete="true"
                :pagingProps="gridPagingProps"
                @editBtnClick="onGridEditBtnClick"
                @deleteBtnClick="onGridDeleteBtnClick"
                @pagerPageIndexChange="onGridPagerPageIndexChange"
        />
    </div>
</template>

<script>
    import utils from './../../../common/js/utils'
    import MaterialGrid from '../../../common/vue-components/grid/MaterialGrid.vue'

    export default {
        name: 'users-list',
        components: {
            MaterialGrid
        },
        data() {
            return {
                gridPagingProps: {
                    pageIndex: 0,
                    pagesCount: 0
                },
                gridData: [
                ]
            }
        },
        methods: {
            loadData: function() {
                this.$emit('startLoading', { text: 'Загрузка списка пользователей' });
                utils.doRequest('/admin/workspace/get_users?pageIndex=' + this.gridPagingProps.pageIndex, {}, function(data) {
                    this.gridData = data.content;
                    this.gridPagingProps.pagesCount = data.totalPages;
                    this.$emit('endLoading');
                }.bind(this));
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
                    { text: 'Email', dataIndex: 'email'},
                    { text: 'Телефон', dataIndex: 'phone'}
                ];
            },
            onGridEditBtnClick: function(rec) {
                this.$router.push('/main/users/edit/' + rec._id);
            },
            onGridDeleteBtnClick: function(rec) {
                var userId = rec._id;
                utils.doRequest('/admin/workspace/user/' + userId, {method: 'DELETE'}, function(data) {
                    var user = this.gridData.find((u) => u._id == userId);
                    this.gridData.splice(this.gridData.indexOf(user), 1);
                }.bind(this));
            },
            onGridPagerPageIndexChange: function(pageIndex) {
                this.loadPageByIndex(pageIndex);
            },
            loadPageByIndex: function(index) {
                this.gridPagingProps.pageIndex = index;
                this.loadData();
            }
        },
        mounted: function() {
           this.loadPageByIndex(0);
        }
    }
</script>

<style lang="scss" scoped>
</style>