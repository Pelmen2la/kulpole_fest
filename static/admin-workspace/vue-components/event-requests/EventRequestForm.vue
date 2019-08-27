<template>
    <div class="event-form-main-container">
        <md-button class="md-raised" :href="'#' + backUrl">Назад</md-button>
        <md-field>
            <label>Название мероприятия</label>
            <md-input v-model="eventRequestData.eventTitle" readonly></md-input>
        </md-field>
        <md-field>
            <label>Имя участника</label>
            <md-input v-model="eventRequestData.participantName || eventRequestData.userFullName" readonly></md-input>
        </md-field>
        <md-field>
            <label>Статус участника</label>
            <md-input v-model="eventRequestData.role" readonly></md-input>
        </md-field>
        <md-field>
            <label>Город</label>
            <md-input v-model="eventRequestData.city" readonly></md-input>
        </md-field>
        <md-field>
            <label>Клуб</label>
            <md-input v-model="eventRequestData.club" readonly></md-input>
        </md-field>
        <md-field>
            <label>Клубное имя</label>
            <md-input v-model="eventRequestData.clubName" readonly></md-input>
        </md-field>
        <md-field>
            <label>Ссылка на социальные сети</label>
            <md-input v-model="eventRequestData.socialNetworkLink" readonly></md-input>
        </md-field>
        <md-field>
            <label>Регион</label>
            <md-input v-model="eventRequestData.regionName" readonly></md-input>
        </md-field>
        <md-field>
            <label>Описание костюма</label>
            <md-textarea v-model="eventRequestData.text" readonly></md-textarea>
        </md-field>
        <div v-if="eventRequestData.photosProps && eventRequestData.photosProps.length">
            <b>Фотографии</b>
            <ul class="photo-list">
                <li v-for="photoProps in eventRequestData.photosProps">
                    <img :src="photoProps.url" @click="openedImageUrl = photoProps.url"/>
                    <p>{{photoProps.description || 'Без описания'}}</p>
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
        <md-field>
            <label>Статус заявки</label>
            <md-select v-model="eventRequestData.status" @md-selected="onStatusComboChange">
                <md-option v-for="(val, key) in statuses" :value="key" :key="key">
                    {{val}}
                </md-option>
            </md-select>
        </md-field>
        <div v-if="isChangesLogAllowed && eventRequestChanges.length > 0">
            <span class="link-like-button" @click="onToggleChangesLogVisibilityBtnClick">
                {{isChangesLogVisible ? 'Скрыть историю изменений' : 'Показать историю изменений'}}
            </span>
            <ul v-if="isChangesLogVisible" class="event-request-changes-list">
                <li v-for="changes in eventRequestChanges">
                    <span>{{formatDate(changes.date)}}</span> -
                    <b>{{changes.userName}}</b> -
                    <span>{{changes.changeBody}}</span>
                </li>
            </ul>
        </div>
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
                    chatMessages: [],
                    changes: []
                },
                newMessageText: '',
                openedImageUrl: '',
                isChangesLogVisible: false
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
                        userFullName: data.userData.length ? (data.userData[0].name + ' ' + data.userData[0].surname) : 'Пользователь удален',
                        regionName: window.kulpoleAppData.textResources.eventRequestRegions[data.region]
                    });
                    this.$emit('endLoading');
                    window.setTimeout(() => this.isDataLoadingInProcess = false, 0);
                }.bind(this));
            },
            onAcceptedCheckboxChange: function(propName, val) {
                if(this.isDataLoadingInProcess) {
                    return;
                }
                this.updateEventRequestData({[propName]: val});
            },
            onStatusComboChange: function() {
                if(this.isDataLoadingInProcess) {
                    return;
                }
                this.updateEventRequestData({status: this.eventRequestData.status});
            },
            updateEventRequestData: function(updateData) {
                utils.doDataRequest('/admin/workspace/eventRequests/' + this.eventRequestId, 'PUT', updateData, () => null);
            },
            onToggleChangesLogVisibilityBtnClick: function() {
                this.isChangesLogVisible = !this.isChangesLogVisible;
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
            },
            formatDate(date) {
               return utils.formatDbDateToWeb(date);
            }
        },
        computed: {
            statuses() {
                return window.kulpoleAppData.textResources.eventRequestStatuses;
            },
            isChangesLogAllowed() {
                return window.kulpoleAppData.isAdmin
            },
            eventRequestChanges() {
                return this.eventRequestData.changes.sort((a, b) => new Date(a) - new Date(b) < 0 ? 1 : -1);
            }
        },
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
            overflow: auto;

            li {
                float: left;
                width: 25%;
                padding: 0.5em;
                box-sizing: border-box;

                img {
                    display: block;
                    max-width: 100%;
                    height: 200px;
                    margin: 0 auto;
                    cursor: pointer;
                }
                p {
                    line-height: 1.2em;
                    height: calc(3.6em + 3px);
                    padding: 3px;
                    width: 100%;
                    border: 1px solid black;
                    overflow: hidden;
                }
            }
        }
    }
    .event-request-changes-list {
        margin: 10px 0;

        li {
            padding: 4px 0
        }
    }
</style>