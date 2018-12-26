import './../../scss/pages/add-event-request.scss'
import utils from './../utils'

(window.addEventRequestModule = function() {
    function init() {
        prepareFileInput();
        utils.addInputOnChangeListeners(document.getElementById('RequestTextTextarea'), ensureAuthButtonState);
    };

    function prepareFileInput() {
        const wrapper = document.querySelector('.file-input-wrapper'),
            fileInput = wrapper.querySelector('input[type=file]'),
            notificationSpan = wrapper.querySelector('.notification-text'),
            uploadedFilesTextSpan = wrapper.querySelector('.uploaded-files-text');
        fileInput.addEventListener('change', () => {
            const filesArr = Array.prototype.slice.call(fileInput.files),
                notificationText = getFileInputInvalidText();
            uploadedFilesTextSpan.innerHTML = 'Загружены фотографии: ' + filesArr.map((f) => f.name).join(', ') + '.';
            notificationSpan.innerHTML = notificationText;
            ensureAuthButtonState();
        });
    };
    function getFileInputInvalidText() {
        const files = document.body.querySelector('input[type=file]').files.length;
        return files < 3 || files > 5 ? 'Количество фотографий должно быть от 3 до 5' : '';
    };
    function getRequestFieldInvalidText() {
        const requestTextarea = document.getElementById('RequestTextTextarea');
        return requestTextarea.value ? '' : 'Текст заявки';
    };
    var ensureSubmitRequestBtnStateTimeoutId;
    function ensureAuthButtonState() {
        window.clearTimeout(ensureSubmitRequestBtnStateTimeoutId);
        ensureSubmitRequestBtnStateTimeoutId = window.setTimeout(ensureSubmitRequestBtnStateCore, 300);
    };
    function ensureSubmitRequestBtnStateCore() {
        const btn = document.getElementById('RequestSubmitButton'),
            disabledText = getFileInputInvalidText() || getRequestFieldInvalidText();
        btn[disabledText ? 'setAttribute' : 'removeAttribute']('disabled', true);
        btn[disabledText ? 'setAttribute' : 'removeAttribute']('title', disabledText);
    };

    return {
        init
    };
}().init());