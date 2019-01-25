import './../../scss/pages/add-event-request.scss'
import utils from './../utils'

(window.addEventRequestModule = function() {
    const requestTextarea = document.getElementById('RequestTextTextarea');

    function init() {
        prepareFileInput();
        utils.addInputOnChangeListeners(requestTextarea, ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('city'), ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('club'), ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('socialNetworkLink'), ensureAuthButtonState);
        utils.qn('region', true).forEach((radio) => radio.addEventListener('change', ensureSubmitRequestBtnStateCore));
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
    function getCityFieldInvalidText() {
        return utils.getInputValue('city') ? '' : 'Введите город.';
    };
    function getClubFieldInvalidText() {
        return utils.getInputValue('club') ? '' : 'Введите название клуба.';
    };
    function getSocialNetworkLinkFieldInvalidText() {
        return utils.getInputValue('socialNetworkLink') ? '' : 'Введите адрес в социальных сетях.';
    };
    function getRegionRadioButtonsText() {
        const selectedRadio = document.querySelector('input[type=radio][name=region]:checked');
        if(!selectedRadio) {
            return 'Необходимо выбрать регион.';
        }
        return '';
    };
    function getFileInputInvalidText() {
        const files = document.body.querySelector('input[type=file]').files.length;
        return files < 3 || files > 5 ? 'Количество фотографий должно быть от 3 до 5.' : '';
    };
    function getRequestFieldInvalidText() {
        return requestTextarea.value ? '' : 'Введите текст заявки.';
    };
    var ensureSubmitRequestBtnStateTimeoutId;
    function ensureAuthButtonState() {
        window.clearTimeout(ensureSubmitRequestBtnStateTimeoutId);
        ensureSubmitRequestBtnStateTimeoutId = window.setTimeout(ensureSubmitRequestBtnStateCore, 300);
    };
    function ensureSubmitRequestBtnStateCore() {
        const btn = document.getElementById('RequestSubmitButton'),
            disabledText = getCityFieldInvalidText() || getClubFieldInvalidText() || getFileInputInvalidText() ||
                getSocialNetworkLinkFieldInvalidText() || getRegionRadioButtonsText() || getRequestFieldInvalidText();
        btn[disabledText ? 'setAttribute' : 'removeAttribute']('disabled', true);
        btn[disabledText ? 'setAttribute' : 'removeAttribute']('title', disabledText);
    };

    return {
        init
    };
}().init());