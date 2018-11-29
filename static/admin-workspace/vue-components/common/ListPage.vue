<template>
    <div>
        <md-button class="md-raised md-primary" href="#/main/users/create">Создать</md-button>
        <slot name="filters_container"></slot>
        <MaterialGrid
                :columnConfig="gridColumnsCfg"
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
    import utils from '../../../common/js/utils'
    import MaterialGrid from '../../../common/vue-components/grid/MaterialGrid.vue'

    export default {
        name: 'list-page',
        components: {
            MaterialGrid
        },
        props: ['dataTypeMultipleName', 'dataTypeMultipleText', 'getLoadDataExtraParams', 'gridColumnsCfg'],
        data() {
            return {
                gridPagingProps: {
                    pageIndex: 0,
                    pagesCount: 0
                },
                gridData: []
            }
        },
        methods: {
            loadData: function() {
                var url = utils.stringFormat('/admin/workspace/{0}?{1}',
                    this.dataTypeMultipleName, this.buildLoadDataParamsString());
                this.$emit('startLoading', {text: 'Загрузка списка ' + this.dataTypeMultipleText});
                utils.doRequest(url, {}, function(data) {
                    this.gridData = data.content;
                    this.gridPagingProps.pagesCount = data.totalPages;
                    this.$emit('endLoading');
                }.bind(this));
            },
            buildLoadDataParamsString: function() {
                var paramsString = 'pageIndex=' + this.gridPagingProps.pageIndex,
                    extraParams = this.getLoadDataExtraParams ? this.getLoadDataExtraParams() : null;
                if(extraParams) {
                    for(var key in extraParams) {
                        paramsString += utils.stringFormat('&{0}={1}', key, extraParams[key]);
                    }
                }
                return paramsString;
            },
            onGridEditBtnClick: function(rec) {
                this.$router.push(utils.stringFormat('/main/{0}/edit/{1}', this.dataTypeMultipleName, rec._id));
            },
            onGridDeleteBtnClick: function(rec) {
                var recId = rec._id,
                    url = utils.stringFormat('/admin/workspace/{0}/{1}', this.dataTypeMultipleName, recId);
                utils.doRequest(url, {method: 'DELETE'}, function(data) {
                    var entry = this.gridData.find((entry) => entry._id == recId);
                    this.gridData.splice(this.gridData.indexOf(entry), 1);
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