<template>
    <div class="auth-form-main-container modal-panel">
        <md-field>
            <label>Логин</label>
            <md-input v-model="login" @keyup="onInputKeyUp"></md-input>
        </md-field>
        <md-field>
            <label>Пароль</label>
            <md-input v-model="password" @keyup="onInputKeyUp"></md-input>
        </md-field>
        <span class="error-text">{{ errorText }}</span>
        <md-button class="md-raised md-primary" :disabled="isSubmitBtnDisabled" @click="onSubmitBtnClick">Войти</md-button>
    </div>
</template>

<script>
    import QsimTextfield from '../../common/vue-components/field/Textfield.vue'
    import QsimButton from '../../common/vue-components/button/Button.vue'
    import utils from './../../common/js/utils'

    export default {
        name: 'auth-form',
        components: {
            QsimTextfield,
            QsimButton
        },
        data() {
            return {
                login: 'john',
                password: 'smith',
                isSubmitBtnDisabled: false,
                errorText: ''
            }
        },
        methods: {
            onInputKeyUp: function(e) {
                this.isSubmitBtnDisabled = !this.login || !this.password;
                if(e.keyCode === 13 && !this.isSubmitBtnDisabled) {
                    this.onSubmitBtnClick();
                }
            },
            onSubmitBtnClick: function() {
                utils.doRequest('/client/check_exist?login=' + this.login + '&password=' + this.password, {}, function(data) {
                    if(data.success) {
                        this.errorText = '';
                        this.$store.dispatch('setAuthKey', data.apiKey);
                        this.$router.push('/main/candidates');
                    } else {
                        this.errorText = data.error;
                    }
                }.bind(this));
            }
        }
    }
</script>

<style lang="scss" scoped>
    .auth-form-main-container {
        max-width: 1024px;
        max-height: 16em;
        overflow: hidden;
        padding: 2em;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

        button {
            margin: 0 auto 2em;
            display: block;
        }

        .error-text {
            width: 100%;
            display: inline-block;
            text-align: center;
            color: #CD0505;
            margin-bottom: 1em;
        }
    }
</style>