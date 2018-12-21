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
                eventRequestData: {},
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