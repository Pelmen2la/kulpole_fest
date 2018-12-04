import './../../scss/pages/auth-pages.scss'

(window.authAppModule = function() {
    function init() {
        if(document.getElementById('AuthForm')) {
            prepareTextInputs();
        }
    };

    function qn(inputName) {
        return document.querySelector(`[name=${inputName}]`);
    };
    function getInputValue(inputName) {
        return qn(inputName).value;
    };
    function prepareTextInputs() {
        ['email', 'password'].forEach((iName) => {
            const input = qn(iName);
            ['keyup', 'change'].forEach((event) => {
                input.addEventListener(event, ensureAuthButtonState);
            });
        });
    };
    var ensureAuthButtonStateTimeoutId;
    function ensureAuthButtonState() {
        window.clearTimeout(ensureAuthButtonStateTimeoutId);
        ensureAuthButtonStateTimeoutId = window.setTimeout(ensureAuthButtonStateCore, 300);
    };
    function ensureAuthButtonStateCore() {
        const btn = document.getElementById('AuthSubmitButton'),
            isDisabled = !getInputValue('email') || !getInputValue('password');
        btn[isDisabled ? 'setAttribute' : 'removeAttribute']('disabled', true);
    };

    return {
        init
    };
}().init());