import utils from './../utils'
import commonUtils from './../../../common/js/utils'
import './../../scss/pages/event-request.scss'
import './../../../common/scss/event-request-chat.scss'

(window.eventRequestAppModule = function() {

    function init() {
        prepareChat();
    };

    const eventRequestId = document.querySelector('.event-request-page-wrapper').dataset.eventRequestId;
    const chatMessagesContainer = document.querySelector('.chat-messages-container');
    const chatTextarea = document.getElementById('ChatMessageTextarea');

    function prepareChat() {
        utils.addInputOnChangeListeners(chatTextarea, (e) => {
            if(e.ctrlKey && e.keyCode === 13) {
                trySendChatMessage();
            }
        });
        document.querySelector('.send-chat-message-btn').addEventListener('click', trySendChatMessage);
        scrollChatMessagesContainerToEnd();
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