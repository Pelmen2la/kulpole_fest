<template>
    <div class="users-form-main-container">
        <md-button class="md-raised" :href="'#' + backUrl">Назад</md-button>
        <md-field>
            <label>Имя</label>
            <md-input v-model="userData.name"/>
        </md-field>
        <md-field>
            <label>Фамилия</label>
            <md-input v-model="userData.surname"/>
        </md-field>
        <EmailTextfield v-model="userData.email" @validityChange="(isValid) => isEmailValid = isValid"/>
        <md-field>
            <label>Название клуба</label>
            <md-input v-model="userData.club"/>
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
                userId: null,
                isSaveInProgress: false,
                backUrl: '/main/users',
                isEmailValid: false,
                userData: {
                    name: '',
                    surname: '',
                    email: '',
                    phone: '',
                    password: '',
                    club: ''
                }
            }
        },
        methods: {
            loadUserData: function(userId) {
                var url = '/admin/workspace/users/' + userId;
                this.$emit('startLoading', {text: 'Загрузка данных пользователя'});
                utils.doRequest(url, {}, function(data) {
                    this.userData = data;
                    this.$emit('endLoading');
                }.bind(this));
            },
            onSaveBtnClick: function() {
                var url = '/admin/workspace/users/' + (this.userId || '');
                this.isSaveInProgress = true;
                utils.doDataRequest(url, this.userId ? 'PUT' : 'POST', this.userData, function(res) {
                    this.isSaveInProgress = false;
                    this.$router.push(this.backUrl)
                }.bind(this));
            }
        },
        computed: {
            saveButtonDisabledText() {
                if(this.isSaveInProgress) {
                    return 'Сохранение пользователя в процессе.';
                }
                if(!this.userData.name) {
                    return 'Необходимо заполнить имя пользователя.'
                }
                if(this.userData.email && !this.isEmailValid) {
                    return 'Email введен в неверном форм.emailате.'
                }
                return '';
            }
        },
        mounted: function() {
            this.userId = this.$route.params.userId;
            if(this.userId) {
                 this.loadUserData(this.userId);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .users-form-main-container {
        padding: 1.5em;
    }
</style>