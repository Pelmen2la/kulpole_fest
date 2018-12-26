import utils from './utils'
import './../scss/index.scss'

(window.mainAppModule = function() {

    function init() {
        prepareTextInputs();
        prepareFileInputs();
    };
    function prepareTextInputs() {
        var ensureNotEmptyClsFn = (input) => input.classList[input.value ? 'add' : 'remove']('not-empty');
        ['text', 'password', 'textarea'].forEach((iType) => {
            const inputes = document.querySelectorAll(iType === 'textarea' ? iType : `input[type=${iType}]`);
            inputes.forEach((i) => {utils.addInputOnChangeListeners(i, (event) => {
                i.addEventListener(event, () => ensureNotEmptyClsFn(i));
                ensureNotEmptyClsFn(i);
            })});
        });
    };
    function prepareFileInputs() {
        const inputWrappers = document.querySelectorAll('.file-input-wrapper');
        inputWrappers.forEach((wrapper) => {
            const fileInput = wrapper.querySelector('input[type=file]');
            wrapper.querySelector('button').addEventListener('click', () => fileInput.click());
        });
    };

    return {
        init
    };
}().init());