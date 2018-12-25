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
        <div class="chat-container">
            <h2>Переписка</h2>
            <div ref="ChatMessagesContainer" class="chat-messages-container">
                <p class="empty-chat-message" v-if="!eventRequestData.chatMessages.length">Переписка пуста</p>
                <div :class="'chat-message ' + message.owner" v-for="message in eventRequestData.chatMessages">
                    {{ message.text }}
                </div>
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
        .chat-container {
            max-width: 1024px;
            margin: 0 auto;
            overflow: auto;

            h2 {
                font-size: 1.2em;
                font-weight: bold;
                margin: 1em 0;
            }
            .chat-messages-container {
                max-height: 600px;
                overflow-y: auto;
                border: 1px solid #919191;
                border-bottom: none;
                padding: 0.5em;

                .empty-chat-message {
                    text-align: center;
                    margin: 1em 0;
                }
                .chat-message {
                    overflow: auto;
                    padding: 0.3em;
                    width: calc(100% - 2em);
                    margin: 5px 0;
                    border-radius: 5px;

                    &.admin {
                        margin-left: 1.5em;
                        margin-right: 0.5em;
                        background: #C7EDFC;
                    }
                }
            }
            .md-has-textarea {
                margin-top: 0;
            }
            .send-chat-message-btn {
                position: absolute;
                cursor: pointer;
                height: 2em;
                bottom: 5px;
                right: 20px;
                opacity: 0.5;

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
</style>