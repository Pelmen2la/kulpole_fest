<template>
    <ListPage
            ref="ListPage"
            :pageStateName="pageStateName"
            dataTypeMultipleName="systemUsers"
            dataTypeMultipleText="члены исторической комиссии"
            :gridColumnsCfg="getGridColumnCfg()">
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
            return {
                pageStateName: 'systemUsersPage'
            }
        },
        methods: {
            getPageState: function() {
                return this.$store.state[this.pageStateName];
            },
            getGridColumnCfg: function() {
                return [
                    {text: 'Имя', dataIndex: 'name'},
                    {text: 'Логин', dataIndex: 'login'},
                    {text: 'Телефон', dataIndex: 'phone'}
                ];
            }
        }
    }
</script>