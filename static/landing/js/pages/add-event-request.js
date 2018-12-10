import './../../scss/pages/add-event-request.scss'

(window.addEventRequestModule = function() {
    function init() {
        prepareFileInputs();
    };

    function prepareFileInputs(inputName) {
        const inputWrappers = document.querySelectorAll('.file-input-wrapper');
        inputWrappers.forEach((wrapper) => {
            const fileInput = wrapper.querySelector('input[type=file]');
            wrapper.querySelector('button').addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', () => { debugger; });
        });
    };

    return {
        init
    };
}().init());