import './../../scss/pages/add-event-request.scss'
import utils from './../utils'

(window.addEventRequestModule = function() {
    const requestTextarea = document.getElementById('RequestTextTextarea');
    const photoList = document.getElementById('EventRequestPhotoList');
    var photos = [];

    function init() {
        prepareFileInput();
        utils.addInputOnChangeListeners(requestTextarea, ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('city'), ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('club'), ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('socialNetworkLink'), ensureAuthButtonState);
        utils.qn('region', true).forEach((radio) => radio.addEventListener('change', ensureSubmitRequestBtnStateCore));

        document.getElementById('AuthForm').addEventListener('submit', function(e) {
            const form = e.target;
            const photoDescriptions = [];
            var formData = new FormData(form);
            var xhr = new XMLHttpRequest();

            photoList.querySelectorAll('textarea').forEach(textarea => photoDescriptions.push(textarea.value));

            photos.forEach(p => formData.append('photo[]', p, p.name));
            formData.append('photoDescriptions', photoDescriptions);
            xhr.onload = () => window.location.replace('/user_event_requests/');
            xhr.open('POST', form.action);
            xhr.send(formData);
            e.preventDefault();
        });
    };

    function prepareFileInput() {
        const wrapper = document.querySelector('.file-input-wrapper'),
            fileInput = wrapper.querySelector('input[type=file]');
        fileInput.addEventListener('change', () => {
            const uploadedPhotos = Array.prototype.slice.call(fileInput.files);
            createImagesPreview(uploadedPhotos);
            photos = photos.concat(uploadedPhotos);
            ensureAuthButtonState();
        });
    };
    function createImagesPreview(images) {
        const reader = new FileReader();
        var counter = 0;
        reader.onload = function(e) {
            const src = e.target.result;
            photoList.innerHTML += `<li><img src="${src}"/><textarea rows="3" placeholder="Описание фотографии"></textarea></li>`;
            counter++;
            if(images[counter]) {
                reader.readAsDataURL(images[counter]);
            }
        }
        reader.readAsDataURL(images[0]);
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
        return photos.length < 2 ? 'Количество фотографий должно быть 2 и более.' : '';
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