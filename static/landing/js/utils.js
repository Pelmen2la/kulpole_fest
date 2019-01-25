export default {
    addInputOnChangeListeners,
    getInputValue,
    qn,
    addValidationOnChangeListeners,
    ensureInputInvalidState
}

function addInputOnChangeListeners(input, fn) {
    ['keyup', 'change'].forEach((event) => {
        input.addEventListener(event, fn)
    });
};

function qn(inputName, isMultiselect) {
    return document['querySelector' + (isMultiselect ? 'All' : '')](`[name=${inputName}]`);
};

function getInputValue(inputName) {
    return qn(inputName).value;
};

function addValidationOnChangeListeners(input, getInvalidTextFn, afterValidation) {
    addInputOnChangeListeners(input, (e) => {
        ensureInputInvalidState(input, getInvalidTextFn());
        afterValidation && afterValidation();
    });
};

function ensureInputInvalidState(input, invalidText) {
    input.classList[invalidText ? 'add' : 'remove']('invalid');
    input[invalidText ? 'setAttribute' : 'removeAttribute']('title', invalidText);
};