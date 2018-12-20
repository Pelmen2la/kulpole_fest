<template>
    <ListPage
            ref="ListPage"
            dataTypeMultipleName="eventRequests"
            dataTypeMultipleText="заявок"
            :hideAddButton="true"
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
                    {
                        text: 'Название мероприятия',
                        dataIndex: 'eventData',
                        renderer: (rec, val) => val.length ? val[0].title : 'Мероприятие удалено'
                    },
                    {
                        text: 'Имя участника',
                        dataIndex: 'userData',
                        renderer: (rec, val) => val.length ? val[0].name + ' ' + val[0].surname : 'Участник удален'
                    },
                    {text: 'Статус', dataIndex: 'status'},
                    {text: 'Дата', dataIndex: 'date'}
                ];
            }
        }
    }
</script>