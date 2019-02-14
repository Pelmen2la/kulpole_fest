export default {
    addInputOnChangeListeners,
    removeInputOnChangeListeners,
    getInputValue,
    qn,
    addValidationOnChangeListeners,
    ensureInputInvalidState
}

function addInputOnChangeListeners(input, fn, delay) {
    ['keyup', 'change'].forEach((event) => {
        var timeoutId;
        input.addEventListener(event, (e) => {
            if(delay) {
                window.clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => fn(e), delay);
            } else {
                fn(e);
            }
        });
    });
};

function removeInputOnChangeListeners(input, fn) {
    ['keyup', 'change'].forEach((event) => input.removeEventListener(event, fn));
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