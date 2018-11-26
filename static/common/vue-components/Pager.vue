<template>
    <ul class="kulpole-pager" v-if="pagesCount > 1" @click="onItemClick">
        <li v-for="i in pagesCount" :data-index="i - 1" :class="getItemClass(i)">
            {{ i }}
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'pager',
        props: ['pagesCount', 'pageIndex'],
        data() {
            return {
            }
        },
        methods: {
            getItemClass: function(itemIndex) {
                var className = 'md-button md-raised md-theme-default';
                if(itemIndex == parseInt(this.pageIndex) + 1) {
                    className += ' md-primary';
                }
                return className;
            },
            onItemClick: function(e) {
                var index = parseInt(e.target.dataset.index);
                if(index != this.pageIndex) {
                    this.$emit('pageIndexChange', index);
                }
            }
        },
    }
</script>

<style lang="scss">
    .kulpole-pager {
        width: 100%;
        text-align: left;
        margin: 10px 0;

        li {
            display: inline-block;
            min-width: 0;
            min-height: 0;
            font-size: 22px;
            padding: 5px 10px;
            margin-right: 10px;
        }
    }
</style>