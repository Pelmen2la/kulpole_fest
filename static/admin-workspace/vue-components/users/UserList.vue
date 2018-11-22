<template>
    <div>
        <md-button class="md-raised md-primary" href="#/main/candidates/create">Создать</md-button>
        <MaterialGrid
                :columnConfig="columnConfig"
                :data="data"
                :hasEdit="true"
                @editBtnClick="onGridEditBtnClick"
        />
    </div>
</template>

<script>
    import utils from './../../../common/js/utils'
    import MaterialGrid from './../../../common/vue-components/MaterialGrid.vue'

    export default {
        name: 'candidates-list',
        components: {
            MaterialGrid
        },
        data() {
            return {
                columnConfig: [
                    { text: 'ФИО', dataIndex: 'name'}
                ],
                data: [
                ]
            }
        },
        methods: {
            loadData: function() {
                this.$emit('startLoading', { text: 'Загрузка списка пользователей' });
                utils.doRequest('/admin/workspace/get_users', {}, function(data) {
                    this.data = data;
                    this.$emit('endLoading');
                }.bind(this));
            },
            onGridEditBtnClick: function(rec) {
                this.$router.push('/main/candidates/edit/' + rec.candidateId);
            }
        },
        mounted: function() {
            this.loadData();
        }
    }
</script>

<style lang="scss" scoped>
</style>