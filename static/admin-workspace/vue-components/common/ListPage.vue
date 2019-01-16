<template>
    <div>
        <md-button class="md-raised md-primary" :href="'#/main/' + dataTypeMultipleName + '/create'" v-if="!hideAddButton">
            Создать
        </md-button>
        <slot name="filters_container"></slot>
        <MaterialGrid
                :columnConfig="gridColumnsCfg"
                :data="getGridState().data"
                :hasEdit="true"
                :hasDelete="true"
                :pagingProps="getGridState()"
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
        props: ['dataTypeMultipleName', 'dataTypeMultipleText', 'getLoadDataExtraParams', 'gridColumnsCfg', 'hideAddButton', 'pageStateName'],
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
                this.updatePageState({
                    pageIndex: index
                });
                this.loadData();
            }
        },
        mounted: function() {
            this.loadPageByIndex(0);
        }
    }
</script>