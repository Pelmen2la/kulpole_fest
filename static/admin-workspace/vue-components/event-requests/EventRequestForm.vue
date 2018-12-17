<template>
    <div class="event-form-main-container">
        <md-button class="md-raised" :href="'#' + backUrl">Назад</md-button>
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
                backUrl: '/main/eventRequests',
                eventRequestData: {},
                openedImageUrl: ''
            }
        },
        methods: {
            loadEventRequestData: function(eventRequestId) {
                var url = '/admin/workspace/eventRequests/' + eventRequestId;
                this.$emit('startLoading', {text: 'Загрузка данных заявки'});
                utils.doRequest(url, {}, function(data) {
                    this.eventRequestData = data;
                    this.$emit('endLoading');
                }.bind(this));
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