import utils from './../utils'
import commonUtils from './../../../common/js/utils'
import './../../scss/pages/event-request.scss'
import './../../../common/scss/event-request-chat.scss'

(window.eventRequestAppModule = function() {
    const eventRequestId = document.querySelector('.event-request-page-wrapper').dataset.eventRequestId;
    const chatMessagesContainer = document.querySelector('.chat-messages-container');
    const chatTextarea = document.getElementById('ChatMessageTextarea');
    const hideChatCheckbox = document.getElementById('HideChatCheckbox');
    const fileInput = document.querySelector('input[type=file]');
    const photoList = document.getElementById('EventRequestPhotoList');
    const getUpdateApiUrl = (action) => `/event_request/${eventRequestId}/${action}/`;

    function init() {
        if(chatTextarea) {
            prepareChat();
        }
        if(fileInput) {
            preparePhotoFileInput();
            preparePhotosTextareas();
        }
        if(hideChatCheckbox) {
            prepareHideChatCheckbox();
        }
    };

    function preparePhotoFileInput() {
        fileInput.addEventListener('change', uploadFile);
    };

    function preparePhotosTextareas() {
        const textareas = document.querySelectorAll('.event-request-photos-container textarea');
        const addPhotoTextareaOnChangeListener = function(textarea) {
            utils.removeInputOnChangeListeners(textarea, onPhotoTextareaChange);
            utils.addInputOnChangeListeners(textarea, onPhotoTextareaChange, 500);
        };
        const onPhotoTextareaChange = function(e) {
            const textarea = e.target;
            const photoContainer = textarea.parentNode;
            const photoIndex = Array.prototype.indexOf.call(photoList.children, photoContainer);
            const description = textarea.value;
            commonUtils.doDataRequest(getUpdateApiUrl('update_photo_description'), 'PUT', {photoIndex, description});
        };
        textareas.forEach((textarea) => addPhotoTextareaOnChangeListener(textarea));
    };

    function prepareHideChatCheckbox() {
        hideChatCheckbox.addEventListener('change', function() {
            const hideChat = arguments[0].target.checked;
            commonUtils.doDataRequest(getUpdateApiUrl('set_hide_chat'), 'PUT', {hideChat});
        });
    };

    function prepareChat() {
        utils.addInputOnChangeListeners(chatTextarea, (e) => {
            if(e.ctrlKey && e.keyCode === 13) {
                trySendChatMessage();
            }
        });
        document.querySelector('.send-chat-message-btn').addEventListener('click', trySendChatMessage);
        scrollChatMessagesContainerToEnd();
    };

    function uploadFile() {
        var xhr = new XMLHttpRequest();
        var data = new FormData();
        const file = fileInput.files[0];

        xhr.onprogress = function (e) {
        };

        xhr.onload = function (e) {
            const imageUrl = e.target.responseText;
            if(imageUrl) {
                photoList.innerHTML += `<li><img src="${imageUrl}"/><textarea rows="3" placeholder="Описание фотографии"></textarea></li>`;
                preparePhotosTextareas();
            }
        };

        xhr.onerror = function (e) {
        };

        xhr.open('post', getUpdateApiUrl('add_photo'), true);
        data.append('photo', file, file.name);
        xhr.send(data);
    };
    function trySendChatMessage() {
        const text = chatTextarea.value;
        if(text) {
            const messageData = {text};
            commonUtils.doDataRequest(getUpdateApiUrl('send_msg'), 'POST', messageData, (res) => {
                chatTextarea.value = '';
                if(res.messageData) {
                    chatMessagesContainer.innerHTML += getMessageHtml(res.messageData);
                    document.querySelector('.empty-chat-message').remove();
                    scrollChatMessagesContainerToEnd();
                }
            });
        }
    };
    function scrollChatMessagesContainerToEnd() {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    };
    function getMessageHtml(messageData) {
        const text = messageData.text.replace(/\n/g, '<br/>');
        return `<div class="chat-message my">${text}</div>`;
    };

    return {
        init
    };
}().init());