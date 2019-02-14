<template>
    <ListPage
            ref="ListPage"
            :pageStateName="pageStateName"
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
                pageStateName: 'eventsPage'
            }
        },
        methods: {
            getGridColumnCfg: function() {
                return [
                    {text: 'Заголовок', dataIndex: 'title'},
                    {text: 'Дата', dataIndex: 'date', renderType: 'date'}
                ];
            }
        }
    }
</script>