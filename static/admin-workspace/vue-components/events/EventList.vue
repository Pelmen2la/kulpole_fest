<template>
    <ListPage
            ref="ListPage"
            dataTypeMultipleName="events"
            dataTypeMultipleText="событий"
            :gridColumnsCfg="getGridColumnCfg()">
    </ListPage>
</template>

<script>
    import ListPage from './../common/ListPage.vue'

    export default {
        name: 'news-list-page',
        components: {
            ListPage
        },
        data() {
            return {
                searchText: ''
            }
        },
        methods: {
            getGridColumnCfg: function() {
                return [
                    {text: 'Заголовок', dataIndex: 'title'},
                    {text: 'Дата', dataIndex: 'date'}
                ];
            }
        }
    }
</script>