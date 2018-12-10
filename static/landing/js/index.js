import './../scss/index.scss'

(window.mainAppModule = function() {

    function init() {
        prepareTextInputs();
    };
    function prepareTextInputs() {
        var ensureNotEmptyClsFn = (input) => input.classList[input.value ? 'add' : 'remove']('not-empty');
        ['text', 'password', 'textarea'].forEach((iType) => {
            const inputes = document.querySelectorAll(iType === 'textarea' ? iType : `input[type=${iType}]`);
            inputes.forEach((i) => ['keyup', 'change'].forEach((event) => {
                i.addEventListener(event, () => ensureNotEmptyClsFn(i));
                ensureNotEmptyClsFn(i);
            }));
        });
    };

    return {
        init
    };
}().init());