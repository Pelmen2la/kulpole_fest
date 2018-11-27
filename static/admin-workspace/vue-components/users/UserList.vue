<template>
    <ListPage
        dataTypeName="user"
        dataTypeMultipleText="пользователей"
        :getLoadDataExtraParams="getLoadDataExtraParams"
        :gridColumnsCfg="getGridColumnCfg()"
    >
    </ListPage>
</template>

<script>
    import ListPage from './../common/ListPage.vue'

    export default {
        name: 'users-list-page',
        components: {
            ListPage
        },
        data() {
            return {}
        },
        methods: {
            getLoadDataExtraParams: function() {
                return {};
            },
            getGridColumnCfg: function() {
                return [
                    {
                        text: 'Имя',
                        dataIndex: 'name',
                        renderer: function(rec, val) {
                            return rec.name + ' ' + rec.surname;
                        }
                    },
                    {text: 'Email', dataIndex: 'email'},
                    {text: 'Телефон', dataIndex: 'phone'}
                ];
            }
        }
    }
</script>