import utils from './utils'
import './../scss/index.scss'

(window.mainAppModule = function() {

    function init() {
        prepareTextInputs();
        prepareCustomComboList();
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
    function prepareCustomComboList() {
        const combos = document.querySelectorAll('.custom-combo-container');
        combos.forEach((c) => {
            const list = c.querySelector('.combo-list');
            const input = c.querySelector('input');
            list.addEventListener('click', (event) => {
                if(event.target.tagName === 'LI') {
                    input.value = event.target.dataset.value;
                }
            });
            utils.addInputOnChangeListeners(input, (event) => {
                const searchText = event.target.value;
                list.querySelectorAll('li').forEach((listItem) => {
                    const listItemValue = listItem.dataset.value;
                    const searchRegexp = new RegExp(searchText.toLowerCase(), 'gi');
                    const match = listItemValue.match(searchRegexp);
                    listItem.classList[match ? 'remove' : 'add']('hide');
                    listItem.innerHTML = listItemValue.replace(searchRegexp, `<b>${searchText}</b>`);
                });
            });
        });
    };

    return {
        init
    };
}().init());