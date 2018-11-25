<template>
    <div>
        <md-button class="md-raised md-primary" href="#/main/users/create">Создать</md-button>
        <MaterialGrid
                :columnConfig="columnConfig"
                :data="gridData"
                :hasEdit="true"
                :hasDelete="true"
                @editBtnClick="onGridEditBtnClick"
                @deleteBtnClick="onGridDeleteBtnClick"
        />
    </div>
</template>

<script>
    import utils from './../../../common/js/utils'
    import MaterialGrid from './../../../common/vue-components/MaterialGrid.vue'

    export default {
        name: 'users-list',
        components: {
            MaterialGrid
        },
        data() {
            return {
                columnConfig: [
                    {
                        text: 'Имя',
                        dataIndex: 'name',
                        renderer: function(rec, val) {
                            return rec.name + ' ' + rec.surname;
                        }
                    },
                    { text: 'Email', dataIndex: 'email'},
                    { text: 'Телефон', dataIndex: 'phone'}
                ],
                gridData: [
                ]
            }
        },
        methods: {
            loadData: function() {
                this.$emit('startLoading', { text: 'Загрузка списка пользователей' });
                utils.doRequest('/admin/workspace/get_users', {}, function(data) {
                    this.gridData = data;
                    this.$emit('endLoading');
                }.bind(this));
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
        },
        mounted: function() {
            this.loadData();
        }
    }
</script>

<style lang="scss" scoped>
</style>