<template>
    <div>
        <md-table class="qsim-material-grid">
            <md-table-row>
                <md-table-head v-for="(col, thIndex) in columnConfig" :key="thIndex">{{ col.text }}</md-table-head>
                <md-table-head v-if="hasEdit" class="icon-cell-th"></md-table-head>
                <md-table-head v-if="hasDelete" class="icon-cell-th"></md-table-head>
            </md-table-row>
            <md-table-row v-for="(rec , trIndex) in data" @click="onRowClick(trIndex, rec)" :key="trIndex"
                          :class="{ 'md-selected-single' : trIndex == selectedRowIndex }">
                <md-table-cell v-for="(colCfg, tdIndex) in columnConfig" :key="tdIndex"
                               :class="colCfg.tdClass">
                    <div v-html="getCellInnerHtml(colCfg, rec)"
                         @click="colCfg.onCellClick && colCfg.onCellClick(rec, $event)"/>
                </md-table-cell>
                <md-table-cell v-if="hasEdit" class="icon-cell">
                    <img src="/resources/icons/edit.svg" @click="onEditBtnClick(rec)"/>
                </md-table-cell>
                <md-table-cell v-if="hasDelete" class="icon-cell">
                    <img src="/resources/icons/delete.svg" @click="onDeleteBtnClick(rec)"/>
                </md-table-cell>
            </md-table-row>
        </md-table>
        <Pager
                v-if="pagingProps"
                :pagesCount="pagingProps.pagesCount"
                :pageIndex="pagingProps.pageIndex"
                @pageIndexChange="onPagerPageIndexChange"
        />
    </div>
</template>

<script>
    import Pager from "./../Pager"

    export default {
        name: 'material-grid',
        components: {
            Pager
        },
        props: ['columnConfig', 'data', 'hasEdit', 'hasDelete', 'onRowSelect', 'pagingProps'],
        data() {
            return {
                selectedRowIndex: null
            }
        },
        methods: {
            onEditBtnClick(rec) {
                this.$emit('editBtnClick', rec);
            },
            onDeleteBtnClick(rec) {
                this.$emit('deleteBtnClick', rec);
            },
            getCellInnerHtml(columnCfg, rec) {
                var val = rec[columnCfg.dataIndex];
                if(columnCfg.renderer) {
                    return columnCfg.renderer(rec, val);
                }
                if(columnCfg.renderType) {
                    return this.getTypeCellRender(columnCfg.renderType, val);
                }
                return val;
            },
            getTypeCellRender(type, val) {
                if(type === 'boolIcon') {
                    let imageName = val ? 'check-green' : 'cross-red';
                    return `<img style="height: 16px;" src="/resources/icons/${imageName}.svg"/>`
                } else if(type === 'date') {
                    let splittedDate = val.split('T');
                    return splittedDate[1].split('.')[0] + ' ' + splittedDate[0];
                }
                return val;
            },
            onRowClick(index, rec) {
                if(this.onRowSelect) {
                    this.selectedRowIndex = index;
                    this.onRowSelect(index, rec);
                }
            },
            onPagerPageIndexChange(index) {
                this.$emit('pagerPageIndexChange', index);
            }
        },
    }
</script>

<style lang="scss">
    .qsim-material-grid {
        width: 100%;
        tr {
            border-bottom: 1px solid #CCC;
            td, th {
                text-align: left;
                padding: 1em;
                &.md-table-head,
                &.md-table-cell {
                    font-size: 16px;
                }
                &.icon-cell {
                    width: 16px;
                    .md-table-cell-container {
                        padding: 0;
                        width: 16px;
                        img {
                            height: 16px;
                            cursor: pointer;
                        }
                    }
                }
                &.icon-cell-th {
                    width: 16px;
                    .md-table-head-container {
                        width: 16px;
                        padding: 0;
                        .md-table-head-label {
                            display: none;
                        }
                    }
                }
            }
        }
    }
</style>