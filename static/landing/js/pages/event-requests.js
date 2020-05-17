import './../../scss/pages/event-requests.scss';
import commonUtils from './../../../common/js/utils';

(window.eventRequestsAppModule = function() {
    function onEventRequestSwitchIsActiveButtonClick(eventRequestId) {
        const button = document.querySelector(`[data-event-request-id="${eventRequestId}"`);
        const isDisabled = button.dataset.isDisabled === 'true';
        const newIsDisabled = !isDisabled;
        let listItem = button.parentNode;
        while(listItem && listItem.tagName !== 'LI') {
            listItem = listItem.parentNode;
        }

        commonUtils.doDataRequest(`/event_request/${eventRequestId}`, 'PUT', {isDisabled: newIsDisabled});
        button.innerHTML = newIsDisabled ? 'Возобновить заявку' : 'Отменить заявку';
        button.dataset.isDisabled = newIsDisabled;
        if(listItem) {
            listItem.classList[newIsDisabled ? 'add' : 'remove']('disabled-item');
        }
    }

    return {
        onEventRequestSwitchIsActiveButtonClick
    }
}());