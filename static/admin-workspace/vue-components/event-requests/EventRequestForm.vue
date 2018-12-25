<template>
    <div class="event-form-main-container">
        <md-button class="md-raised" :href="'#' + backUrl">Назад</md-button>
        <md-field>
            <label>Название мероприятия</label>
            <md-input v-model="eventRequestData.eventTitle" readonly></md-input>
        </md-field>
        <md-field>
            <label>Имя участника</label>
            <md-input v-model="eventRequestData.userFullName" readonly></md-input>
        </md-field>
        <md-field>
            <label>Роль</label>
            <md-input v-model="eventRequestData.role" readonly></md-input>
        </md-field>
        <md-field>
            <label>Текст заявки</label>
            <md-textarea v-model="eventRequestData.text" readonly></md-textarea>
        </md-field>
        <div v-if="eventRequestData.photoUrls && eventRequestData.photoUrls.length">
            <b>Фотографии</b>
            <ul class="photo-list">
                <li v-for="photoUrl in eventRequestData.photoUrls">
                    <img :src="photoUrl" @click="openedImageUrl = photoUrl"/>
                </li>
            </ul>
        </div>
        <FullscreenImage v-if="openedImageUrl" :imageUrl="openedImageUrl" @onMaskClick="() => openedImageUrl = ''"/>
        <md-checkbox v-model="eventRequestData.isCostumeAccepted" @change="(val) => onAcceptedCheckboxChange('isCostumeAccepted', val)">
            Костюм допущен
        </md-checkbox>
        <md-checkbox v-model="eventRequestData.isArmorAccepted" @change="(val) => onAcceptedCheckboxChange('isArmorAccepted', val)">
            Доспех допущен
        </md-checkbox>
        <div class="event-request-chat-container">
            <h2>Переписка</h2>
            <div class="chat-messages-container">
                <p class="empty-chat-message" v-if="!eventRequestData.chatMessages.length">Переписка пуста</p>
                <div v-for="message in eventRequestData.chatMessages"
                     :class="'chat-message ' + (message.owner == 'admin' ? 'my' : '')"
                     v-html="message.text.replace(/\n/g, '<br/>')"/>
            </div>
            <md-field>
                <label>Написать сообщение</label>
                <md-textarea v-model="newMessageText" @keyup.ctrl.enter="trySendChatMessage"></md-textarea>
                <img src="/resources/icons/scroll.svg" class="send-chat-message-btn" 
                     v-if="newMessageText.length"
                     @click="trySendChatMessage"
                />
            </md-field>
        </div>
    </div>
</template>

<script>
    import utils from './../../../common/js/utils'
    import './../../../common/scss/event-request-chat.scss'
    import ButtonWithDisabledTooltip from '../../../common/vue-components/button/ButtonWithDisabledTooltip'
    import FullscreenImage from './FullscreenImage'

    export default {
        name: 'event-request-form',
        components: {
            ButtonWithDisabledTooltip,
            FullscreenImage
        },
        data() {
            return {
                eventId: null,
                isSaveInProgress: false,
                isDataLoadingInProcess: false,
                backUrl: '/main/eventRequests',
                eventRequestData: {
                    chatMessages: []
                },
                newMessageText: '',
                openedImageUrl: ''
            }
        },
        methods: {
            loadEventRequestData: function(eventRequestId) {
                var url = '/admin/workspace/eventRequests/' + eventRequestId;
                this.$emit('startLoading', {text: 'Загрузка данных заявки'});
                this.isDataLoadingInProcess = true;
                utils.doRequest(url, {}, function(data) {
                    this.eventRequestData = Object.assign(data, {
                        eventTitle: data.eventData.length ? data.eventData[0].title : 'Мероприятие удалено',
                        userFullName: data.userData.length ? (data.userData[0].name + ' ' + data.userData[0].surname) : 'Пользователь удален'
                    });
                    this.$emit('endLoading');
                    window.setTimeout(() => this.isDataLoadingInProcess = false, 0);
                }.bind(this));
            },
            onAcceptedCheckboxChange: function(propName, val) {
                if(this.isDataLoadingInProcess) {
                    return;
                }
                var updateData = {};
                updateData[propName] = val;
                utils.doDataRequest('/admin/workspace/eventRequests/' + this.eventRequestId, 'PUT', updateData, () => null);
            },
            trySendChatMessage: function() {
                if(!this.newMessageText) {
                    return;
                }
                const postData = { text: this.newMessageText };
                utils.doDataRequest('/admin/workspace/send_event_request_msg/' + this.eventRequestId, 'POST', postData, (res) => {
                    if(res.success) {
                        this.eventRequestData.chatMessages.push(res.messageData);
                        this.newMessageText = '';
                    }
                });
            }
        },
        computed: {},
        mounted: function() {
            this.eventRequestId = this.$route.params.eventRequestId;
            this.loadEventRequestData(this.eventRequestId);
        }
    }
</script>

<style lang="scss" scoped>
    .event-form-main-container {
        .photo-list {
            margin-top: 1em;
            li {
                display: inline-block;
                margin-right: 1em;

                img {
                    height: 150px;
                    cursor: pointer;
                }
            }
        }
    }
</style>