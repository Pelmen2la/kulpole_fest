import utils from './../utils'
import commonUtils from './../../../common/js/utils'
import './../../scss/pages/event-request.scss'
import './../../../common/scss/event-request-chat.scss'

(window.eventRequestAppModule = function() {
    const eventRequestId = document.querySelector('.event-request-page-wrapper').dataset.eventRequestId;
    const chatMessagesContainer = document.querySelector('.chat-messages-container');
    const chatTextarea = document.getElementById('ChatMessageTextarea');
    const fileInput = document.querySelector('input[type=file]');
    const photoList = document.getElementById('EventRequestPhotoList');

    function init() {
        if(chatTextarea) {
            prepareChat();
        }
        if(fileInput) {
            preparePhotoFileInput();
        }
    };

    function preparePhotoFileInput() {
        fileInput.addEventListener('change', uploadFile);
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
                photoList.innerHTML += `<li><img src="${imageUrl}"/></li>`;
            }
        };

        xhr.onerror = function (e) {
        };

        xhr.open('post', `/event_request/${eventRequestId}/add_photo`, true);
        data.append('photo', file, file.name);
        xhr.send(data);
    };
    function trySendChatMessage() {
        const text = chatTextarea.value;
        if(text) {
            const messageData = {text};
            commonUtils.doDataRequest(`/event_request/${eventRequestId}/send_msg`, 'POST', messageData, (res) => {
                chatTextarea.value = '';
                if(res.messageData) {
                    chatMessagesContainer.innerHTML += getMessageHtml(res.messageData);
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