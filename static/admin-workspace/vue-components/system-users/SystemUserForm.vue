<template>
    <div class="users-form-main-container">
        <md-button class="md-raised" :href="'#' + backUrl">Назад</md-button>
        <md-field>
            <label>Полное имя</label>
            <md-input v-model="userData.name"/>
        </md-field>
        <md-field>
            <label>Логин</label>
            <md-input v-model="userData.login"/>
        </md-field>
        <md-field>
            <label>Пароль</label>
            <md-input v-model="userData.password"/>
        </md-field>
        <md-field>
            <label>Телефон</label>
            <md-input v-model="userData.phone"/>
        </md-field>
        <ButtonWithDisabledTooltip :disabledText="saveButtonDisabledText" :onClick="onSaveBtnClick" text="Сохранить"/>
    </div>
</template>

<script>
    import utils from './../../../common/js/utils'
    import ButtonWithDisabledTooltip from '../../../common/vue-components/button/ButtonWithDisabledTooltip'
    import EmailTextfield from '../../../common/vue-components/field/EmailTextfield'

    export default {
        name: 'user-form',
        components: {
            ButtonWithDisabledTooltip,
            EmailTextfield
        },
        data() {
            return {
                systemUserId: null,
                isSaveInProgress: false,
                backUrl: '/main/systemUsers',
                userData: {
                    name: '',
                    login: '',
                    phone: '',
                    password: ''
                }
            }
        },
        methods: {
            loadUserData: function(systemUserId) {
                var url = '/admin/workspace/systemUsers/' + systemUserId;
                this.$emit('startLoading', {text: 'Загрузка данных аудитора'});
                utils.doRequest(url, {}, function(data) {
                    this.userData = data;
                    this.$emit('endLoading');
                }.bind(this));
            },
            onSaveBtnClick: function() {
                var url = '/admin/workspace/systemUsers/' + (this.systemUserId || '');
                this.isSaveInProgress = true;
                utils.doDataRequest(url, this.systemUserId ? 'PUT' : 'POST', this.userData, function(res) {
                    this.isSaveInProgress = false;
                    this.$router.push(this.backUrl)
                }.bind(this));
            }
        },
        computed: {
            saveButtonDisabledText() {
                if(this.isSaveInProgress) {
                    return 'Сохранение члена исторической комиссии в процессе.';
                }
                if(!this.userData.name) {
                    return 'Необходимо заполнить имя.'
                }
                return '';
            }
        },
        mounted: function() {
            this.systemUserId = this.$route.params.systemUserId;
            if(this.systemUserId) {
                 this.loadUserData(this.systemUserId);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .users-form-main-container {
        padding: 1.5em;
    }
</style>