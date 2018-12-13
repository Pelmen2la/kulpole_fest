export default {
    addInputOnChangeListeners
}

function addInputOnChangeListeners(input, fn) {
    ['keyup', 'change'].forEach((event) => {
        input.addEventListener(event, fn)
    });
};