import './../../scss/pages/add-event-request.scss'
import utils from './../utils'

(window.addEventRequestModule = function() {
    const requestTextarea = document.getElementById('RequestTextTextarea');
    const eventRequestReferencePhotosList = document.getElementById('EventRequestReferencePhotoList');
    const photoList = document.getElementById('EventRequestPhotoList');
    const addEventRequestForm = document.getElementById('AddEventRequestForm');
    const acceptDocumentsCheckbox = document.getElementById('AcceptDocumentsCheckbox');
    var photos = [];

    function init() {
        if(eventRequestReferencePhotosList) {
            initEventRequestReferencePhotosList(eventRequestReferencePhotosList);
        }
        prepareFileInput();
        utils.addInputOnChangeListeners(requestTextarea, ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('city'), ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('club'), ensureAuthButtonState);
        utils.addInputOnChangeListeners(utils.qn('socialNetworkLink'), ensureAuthButtonState);
        utils.qn('region', true).forEach((radio) => radio.addEventListener('change', ensureSubmitRequestBtnStateCore));
        acceptDocumentsCheckbox.addEventListener('change', ensureAuthButtonState);

        addEventRequestForm.addEventListener('submit', function(e) {
            const form = e.target;
            const photoDescriptions = [];
            var formData = new FormData(form);
            var xhr = new XMLHttpRequest();

            photoList.querySelectorAll('textarea').forEach(textarea => photoDescriptions.push(textarea.value));
            photos.forEach(p => formData.append('photo[]', p, p.name));
            formData.append('photoDescriptions', photoDescriptions);

            if(eventRequestReferencePhotosList) {
                const eventRequestReferencePhotoDescriptions = [];
                const eventRequestReferencePhotoUrls = [];
                eventRequestReferencePhotosList.querySelectorAll('textarea').forEach(textarea => {
                    eventRequestReferencePhotoDescriptions.push(textarea.value);
                });
                eventRequestReferencePhotosList.querySelectorAll('.photo').forEach(image => {
                    eventRequestReferencePhotoUrls.push(image.src.replace(window.location.origin, ''));
                });
                formData.append('eventRequestReferencePhotoDescriptions', eventRequestReferencePhotoDescriptions);
                formData.append('eventRequestReferencePhotoUrls', eventRequestReferencePhotoUrls);
            }

            xhr.onload = () => window.location.replace('/user_event_requests/');
            xhr.open('POST', form.action);
            xhr.send(formData);
            e.preventDefault();
        });
    };

    function initEventRequestReferencePhotosList(photosList) {
        photosList.querySelectorAll('.delete-icon-wrapper').forEach(deletePhotoBtn => {
            deletePhotoBtn.addEventListener('click', () => {
                photosList.removeChild(deletePhotoBtn.parentNode);
                if(photosList.childNodes.length === 0) {
                    addEventRequestForm.removeChild(document.getElementById('EventRequestReferencePhotoListContainer'));
                }
                this.ensureSubmitRequestBtnStateCore();
            });
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
            photoList.innerHTML += `<li>
                <img src="${src}" class="photo"/>
                <textarea rows="3" placeholder="Описание фотографии" class="photo-description"></textarea>
            </li>`;
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
        const photosCount = photos.length + (eventRequestReferencePhotosList ? eventRequestReferencePhotosList.childNodes.length : 0);
        return photosCount < 3 || photosCount > 10 ? 'Количество фотографий должно быть не менее 3х и меньше 10ти.' : '';
    };
    function getRequestFieldInvalidText() {
        return requestTextarea.value ? '' : 'Введите описание костюма.';
    };
    function getAcceptDocumentsCheckboxInvalidText() {
        return acceptDocumentsCheckbox.checked ? '' : 'Необходимо ознакомиться с документрами фестиваля.';
    };
    var ensureSubmitRequestBtnStateTimeoutId;
    function ensureAuthButtonState() {
        window.clearTimeout(ensureSubmitRequestBtnStateTimeoutId);
        ensureSubmitRequestBtnStateTimeoutId = window.setTimeout(ensureSubmitRequestBtnStateCore, 300);
    };
    function ensureSubmitRequestBtnStateCore() {
        const btn = document.getElementById('RequestSubmitButton'),
            disabledText = getCityFieldInvalidText() || getClubFieldInvalidText() || getFileInputInvalidText() ||
                getSocialNetworkLinkFieldInvalidText() || getRegionRadioButtonsText() || getRequestFieldInvalidText() ||
                getAcceptDocumentsCheckboxInvalidText();
        btn[disabledText ? 'setAttribute' : 'removeAttribute']('disabled', true);
        btn[disabledText ? 'setAttribute' : 'removeAttribute']('title', disabledText);
    };

    return {
        init
    };
}().init());