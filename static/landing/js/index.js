import './../scss/index.scss'

(window.mainAppModule = function() {

    function init() {
        prepareTextInputs();
    };
    function prepareTextInputs() {
        var ensureNotEmptyClsFn = (input) => input.classList[input.value ? 'add' : 'remove']('not-empty');
        ['text', 'password'].forEach((eType) => {
            const inputes = document.querySelectorAll(`input[type=${eType}]`);
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