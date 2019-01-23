import './../../scss/pages/auth-pages.scss'
import utils from './../utils'

(window.registrationAppModule = function() {
    function init() {
        if(document.getElementById('RegistrationForm')) {
            prepareTextInputs();
            ensureRegistrationButtonState();
        }
    };

    function qn(inputName, isMultiselect) {
        return document['querySelector' + (isMultiselect ? 'All': '')](`[name=${inputName}]`);
    };
    function getInputValue(inputName) {
        return qn(inputName).value;
    };
    function ensureInputInvalidState(input, invalidText) {
        input.classList[invalidText ? 'add' : 'remove']('invalid');
        input[invalidText ? 'setAttribute' : 'removeAttribute']('title', invalidText);
    };
    function getNameInputInvalidText() {
        const val = getInputValue('name');
        if(!val) {
            return 'Необходимо ввести имя.'
        }
        if(val.length < 4) {
            return 'Имя не может быть короче 4 символов.'
        }
        return '';
    };
    function getSurnameInputInvalidText() {
        const val = getInputValue('surname');
        if(val && val.length < 4) {
            return 'Фамилия не может быть короче 4 символов.'
        }
        return '';
    };
    function getEmailInputInvalidText() {
        const val = getInputValue('email'),
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
        const val = getInputValue('password');
        if(!val) {
            return 'Необходимо ввести пароль.'
        }
        if(val.length < 6) {
            return 'Пароль не может быть короче 6 символов.'
        }
        return '';
    };
    function getRepeatPasswordInputInvalidText() {
        const val = getInputValue('repeat-password');
        if(!val) {
            return 'Необходимо ввести пароль пароль.'
        }
        if(val != getInputValue('password')) {
            return 'Введенные вами пароли не совпадают.'
        }
        return '';
    };
    function prepareTextInputs() {
        const addValidationOnChangeListeners = (input, getInvalidTextFn, extraFn) => {
                utils.addInputOnChangeListeners(input, (e) => {
                    ensureInputInvalidState(input, getInvalidTextFn());
                    ensureRegistrationButtonState();
                    extraFn && extraFn();
                });
            };

        addValidationOnChangeListeners(qn('name'), getNameInputInvalidText);
        addValidationOnChangeListeners(qn('surname'), getSurnameInputInvalidText);
        addValidationOnChangeListeners(qn('email'), getEmailInputInvalidText);
        addValidationOnChangeListeners(qn('password'), getPasswordInputInvalidText, () => {
            ensureInputInvalidState(qn('repeat-password'), getRepeatPasswordInputInvalidText());
        });
        addValidationOnChangeListeners(qn('repeat-password'), getRepeatPasswordInputInvalidText);
        qn('sex', true).forEach((radio) => radio.addEventListener('change', ensureRegistrationButtonState));
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