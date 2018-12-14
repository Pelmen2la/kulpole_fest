<template>
    <ListPage
            ref="ListPage"
            dataTypeMultipleName="eventRequests"
            dataTypeMultipleText="заявок"
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
                    {text: 'Статус', dataIndex: 'status'},
                    {text: 'Дата', dataIndex: 'date'}
                ];
            }
        }
    }
</script>