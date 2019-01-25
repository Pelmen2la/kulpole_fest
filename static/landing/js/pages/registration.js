import './../../scss/pages/auth-pages.scss'
import utils from './../utils'

(window.registrationAppModule = function() {
    function init() {
        if(document.getElementById('RegistrationForm')) {
            prepareTextInputs();
            ensureRegistrationButtonState();
        }
    };
    
    function getNameInputInvalidText() {
        const val = utils.getInputValue('name');
        if(!val) {
            return 'Необходимо ввести имя.'
        }
        if(val.length < 4) {
            return 'Имя не может быть короче 4 символов.'
        }
        return '';
    };
    function getSurnameInputInvalidText() {
        const val = utils.getInputValue('surname');
        if(val && val.length < 4) {
            return 'Фамилия не может быть короче 4 символов.'
        }
        return '';
    };
    function getEmailInputInvalidText() {
        const val = utils.getInputValue('email'),
            emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!val) {
            return 'Необходимо ввести email.'
        }
        if(!emailRe.test(val.toLowerCase())) {
            return 'Email введен в не верном формате.'
        }
        return '';
    };
    function getSexRadioButtonsText() {
        const selectedRadio = document.querySelector('input[type=radio][name=sex]:checked');
        if(!selectedRadio) {
            return 'Необходимо выбрать ваш пол.';
        }
        return '';
    };
    function getPasswordInputInvalidText() {
        const val = utils.getInputValue('password');
        if(!val) {
            return 'Необходимо ввести пароль.'
        }
        if(val.length < 6) {
            return 'Пароль не может быть короче 6 символов.'
        }
        return '';
    };
    function getRepeatPasswordInputInvalidText() {
        const val = utils.getInputValue('repeat-password');
        if(!val) {
            return 'Необходимо ввести пароль пароль.'
        }
        if(val != utils.getInputValue('password')) {
            return 'Введенные вами пароли не совпадают.'
        }
        return '';
    };
    function prepareTextInputs() {
        utils.addValidationOnChangeListeners(utils.qn('name'), getNameInputInvalidText, ensureRegistrationButtonStateCore);
        utils.addValidationOnChangeListeners(utils.qn('surname'), getSurnameInputInvalidText, ensureRegistrationButtonStateCore);
        utils.addValidationOnChangeListeners(utils.qn('email'), getEmailInputInvalidText, ensureRegistrationButtonStateCore);
        utils.addValidationOnChangeListeners(utils.qn('password'), getPasswordInputInvalidText, () => {
            utils.ensureInputInvalidState(utils.qn('repeat-password'), getRepeatPasswordInputInvalidText());
            ensureRegistrationButtonStateCore();
        });
        utils.addValidationOnChangeListeners(utils.qn('repeat-password'), getRepeatPasswordInputInvalidText, ensureRegistrationButtonStateCore);
        utils.qn('sex', true).forEach((radio) => radio.addEventListener('change', ensureRegistrationButtonState));
    };
    function getRegistrationButtonDisabledText() {
        return getNameInputInvalidText() || getSurnameInputInvalidText() || getEmailInputInvalidText() ||
            getSexRadioButtonsText() || getPasswordInputInvalidText() || getRepeatPasswordInputInvalidText() || '';
    };
    var ensureRegistrationButtonStateTimeoutId;
    function ensureRegistrationButtonState() {
        window.clearTimeout(ensureRegistrationButtonStateTimeoutId);
        ensureRegistrationButtonStateTimeoutId = window.setTimeout(ensureRegistrationButtonStateCore, 300);
    };
    function ensureRegistrationButtonStateCore() {
        const btn = document.getElementById('RegistrationSubmitButton'),
            disabledText = getRegistrationButtonDisabledText();
        btn[disabledText ? 'setAttribute' : 'removeAttribute']('disabled', true);
        btn[disabledText ? 'setAttribute' : 'removeAttribute']('title', disabledText);
    };

    return {
        init
    };
}().init());