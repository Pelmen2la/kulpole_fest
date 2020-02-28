<template>
    <div>
        <md-button class="md-raised md-primary" :href="'#/main/' + dataTypeMultipleName + '/create'" v-if="!hideAddButton">
            Создать
        </md-button>
        <slot name="filters_container"></slot>
        <MaterialGrid
                :columnConfig="gridColumnsCfg"
                :data="gridData"
                :hasEdit="!hideGridEditBtn"
                :hasDelete="true"
                :pagingProps="getGridState()"
                @editBtnClick="onGridEditBtnClick"
                @deleteBtnClick="onGridDeleteBtnClick"
                @pagerPageIndexChange="onGridPagerPageIndexChange"
        />
        <md-dialog :md-active="confirmDeleteRecordId !== null" class="confirm-delete-window"
                   @md-clicked-outside="resetConfirmDeleteRecordId">
            <md-dialog-title>Удаление записи</md-dialog-title>
            <p>{{'Вы действительно хотите удалить ' + getConfirmDeleteRecordText() + '?'}}</p>
            <md-dialog-actions>
                <md-button class="md-raised" @click="resetConfirmDeleteRecordId">Нет</md-button>
                <md-button class="md-raised md-primary" @click="deleteRecordAfterConfirm">Да</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script>
    import utils from '../../../common/js/utils'
    import MaterialGrid from '../../../common/vue-components/grid/MaterialGrid.vue'

    export default {
        name: 'list-page',
        components: {
            MaterialGrid
        },
        props: ['dataTypeMultipleName', 'dataTypeMultipleText', 'getLoadDataExtraParams', 'gridColumnsCfg', 'hideAddButton',
            'hideGridEditBtn', 'pageStateName', 'getCustomConfirmDeleteRecordText', 'loadDataOnMounted'],
        data() {
            return {
                confirmDeleteRecordId: null
            }
        },
        methods: {
            loadData: function() {
                var url = utils.stringFormat('/admin/workspace/{0}?{1}',
                    this.dataTypeMultipleName, this.buildLoadDataParamsString());
                this.$emit('startLoading', {text: 'Загрузка списка ' + this.dataTypeMultipleText});
                utils.doRequest(url, {}, function(data) {
                    this.updatePageState({
                        data: data.content,
                        pagesCount: data.totalPages
                    });
                    this.$emit('endLoading');
                }.bind(this));
            },
            updatePageState: function(newState) {
                this.$store.commit('changeGridState', {
                    pageName: this.pageStateName,
                    newState
                });
            },
            getPageState: function() {
                return this.$store.state[this.pageStateName];
            },
            getGridState: function() {
                return this.getPageState().grid;
            },
            buildLoadDataParamsString: function() {
                var paramsString = 'pageIndex=' + this.getGridState().pageIndex,
                    extraParams = this.getLoadDataExtraParams ? this.getLoadDataExtraParams() : null;
                if(extraParams) {
                    for(var key in extraParams) {
                        paramsString += utils.stringFormat('&{0}={1}', key, extraParams[key]);
                    }
                }
                return paramsString;
            },
            resetConfirmDeleteRecordId: function() {
                this.confirmDeleteRecordId = null;
            },
            getConfirmDeleteRecord: function() {
                gridData.find((entry) => entry[this.recordIdFieldName] == recId);
            },
            getConfirmDeleteRecordText: function() {
                if(this.getCustomConfirmDeleteRecordText) {
                    return this.getCustomConfirmDeleteRecordText(this.getConfirmDeleteRecord);
                } else {
                    return 'запись';
                }
            },
            onGridEditBtnClick: function(rec) {
                this.$router.push(utils.stringFormat('/main/{0}/edit/{1}', this.dataTypeMultipleName, rec._id));
            },
            onGridDeleteBtnClick: function(rec) {
                this.confirmDeleteRecordId = rec[this.recordIdFieldName];
            },
            deleteRecordAfterConfirm: function() {
                var recId = this.confirmDeleteRecordId,
                    url = utils.stringFormat('/admin/workspace/{0}/{1}', this.dataTypeMultipleName, recId);
                utils.doRequest(url, {method: 'DELETE'}, (data) => {
                    const gridData = this.getGridState().data;
                    const entry = gridData.find((entry) => entry[this.recordIdFieldName] == recId);
                    gridData.splice(gridData.indexOf(entry), 1);
                    this.resetConfirmDeleteRecordId();
                });
            },
            onGridPagerPageIndexChange: function(pageIndex) {
                this.loadPageByIndex(pageIndex);
            },
            loadPageByIndex: function(index) {
                this.updatePageState({
                    pageIndex: index
                });
                this.loadData();
            }
        },
        computed: {
            gridData() {
                return this.getGridState().data;
            },
            recordIdFieldName: function() {
                return '_id';
            }
        },
        mounted: function() {
            if(this.loadDataOnMounted) {
                this.loadPageByIndex(0);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .confirm-delete-window {
        p {
            padding: 24px;
        }
    }
</style>