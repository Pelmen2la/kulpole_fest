<template>
    <div class="event-form-main-container">
        <div>
            <md-button class="md-raised" style="float: left" :href="'#' + backUrl">Назад</md-button>
            <md-button class="md-raised md-primary" style="float: right" :href="getDownloadEventRequestsListUrl" target="_blank">
                Список допущенных участников
            </md-button>
        </div>
        <md-field>
            <label>Заголовок</label>
            <md-input v-model="eventData.title"/>
        </md-field>
        <md-datepicker v-model="eventData.date">
            <label>Дата события</label>
        </md-datepicker>
        <md-datepicker v-model="eventData.acceptRequestEndDate">
            <label>Дата окончания приёма заявок</label>
        </md-datepicker>
        <vue-editor
                v-model="eventData.html"
                useCustomImageHandler
                @imageAdded="handleHtmlEditorImageAdded"
        />
        <ButtonWithDisabledTooltip :disabledText="saveButtonDisabledText" :onClick="onSaveBtnClick" text="Сохранить"/>
    </div>
</template>

<script>
    import utils from './../../../common/js/utils'
    import ButtonWithDisabledTooltip from '../../../common/vue-components/button/ButtonWithDisabledTooltip'
    import EmailTextfield from '../../../common/vue-components/field/EmailTextfield'
    import { VueEditor } from 'vue2-editor'

    export default {
        name: 'event-form',
        components: {
            ButtonWithDisabledTooltip,
            EmailTextfield,
            VueEditor
        },
        data() {
            return {
                eventId: null,
                isSaveInProgress: false,
                backUrl: '/main/events',
                editor: null,
                htmlEditorCfg: {},
                dateFieldNames: ['acceptRequestEndDate', 'date'],
                eventData: {
                    title: '',
                    date: new Date,
                    acceptRequestEndDate: new Date,
                    html: ''
                }
            }
        },
        methods: {
            loadEventData: function(eventId) {
                var url = '/admin/workspace/events/' + eventId;
                this.$emit('startLoading', {text: 'Загрузка данных события'});
                utils.doRequest(url, {}, function(data) {
                    if(data) {
                        this.dateFieldNames.forEach(fieldName => {
                            data[fieldName] = (data[fieldName] || '').split('T')[0]
                        });
                    }
                    this.eventData = data;
                    this.$emit('endLoading');
                }.bind(this));
            },
            onSaveBtnClick: function() {
                var url = '/admin/workspace/events/' + (this.eventId || '');
                var requestData = Object.assign({}, this.eventData);
                requestData.acceptRequestEndDate = new Date(requestData.acceptRequestEndDate);
                requestData.acceptRequestEndDate.setHours(23);
                requestData.acceptRequestEndDate.setMinutes(59);
                requestData.acceptRequestEndDate.setSeconds(59);
                requestData.acceptRequestEndDate.setSeconds(59);
                this.isSaveInProgress = true;
                utils.doDataRequest(url, this.eventId ? 'PUT' : 'POST', requestData, function(res) {
                    this.isSaveInProgress = false;
                    this.$router.push(this.backUrl)
                }.bind(this));
            },
            handleHtmlEditorImageAdded: function(file, editor, cursorLocation, resetUploader) {
                let formData = new FormData();
                let xhr = new XMLHttpRequest();
                formData.append('file', file);
                xhr.open('POST', '/admin/workspace/events/upload_image/');
                xhr.send(formData);
                xhr.onload = function() {
                    var imageUrl = xhr.responseText;
                    editor.insertEmbed(cursorLocation, 'image', imageUrl);
                    resetUploader();
                };
                xhr.onerror = function(err) {
                    resetUploader();
                }
            }
        },
        computed: {
            saveButtonDisabledText() {
                if(this.isSaveInProgress) {
                    return 'Сохранение события в процессе.';
                }
                if(!this.eventData.title) {
                    return 'Необходимо заполнить заголовок.'
                }
                return '';
            },
            getDownloadEventRequestsListUrl() {
                return '/admin/workspace/events/' + this.eventId +'/event_requests_list/';
            }
        },
        mounted: function() {
            this.eventId = this.$route.params.eventId;
            if(this.eventId) {
                this.loadEventData(this.eventId);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .event-form-main-container {
        padding: 1.5em;
    }
</style>