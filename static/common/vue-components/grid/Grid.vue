<template>
    <table class="qsim-grid">
        <thead>
            <tr>
                <th v-for="col in columnConfig">{{ col.text }}</th>
                <th v-if="hasEdit"></th>
                <th v-if="hasDelete"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="rec in data">
                <td v-for="colCfg in columnConfig"
                    v-html="getCellInnerHtml(colCfg, rec)"
                    :class="colCfg.tdClass"
                    @click="colCfg.onCellClick && colCfg.onCellClick(rec, $event)"
                />
                <td v-if="hasEdit" class="icon-cell">
                    <img src="/resources/icons/edit.svg" @click="onEditBtnClick(rec)"/>
                </td>
                <td v-if="hasDelete" class="icon-cell">
                    <img src="/resources/icons/delete.svg" @click="onDeleteBtnClick(rec)"/>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: 'grid',
        props: ['columnConfig', 'data', 'hasEdit', 'hasDelete'],
        methods: {
            onEditBtnClick: function(rec) {
                this.$emit('editBtnClick', rec);
            },
            onDeleteBtnClick: function(rec) {
                this.$emit('deleteBtnClick', rec);
            },
            getCellInnerHtml: function(columnCfg, rec) {
                var val = rec[columnCfg.dataIndex];
                if(columnCfg.renderer) {
                    return columnCfg.renderer(rec, val);
                } else {
                    return val;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .qsim-grid {
        width: 100%;
        tr {
            border-bottom: 1px solid #CCC;
            td, th {
                text-align: left;
                padding: 1em;
                &.icon-cell {
                    width: 16px;
                    padding: 0;
                    img {
                        height: 16px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>