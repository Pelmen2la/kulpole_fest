<template>
    <div class="news-form-main-container">
        <md-button class="md-raised" :href="'#' + backUrl">Назад</md-button>
        <md-field>
            <label>Заголовок</label>
            <md-input v-model="newsData.title"/>
        </md-field>
        <md-field>
            <label>Ссылка</label>
            <md-input v-model="newsData.seoUrl"/>
        </md-field>
        <md-field>
            <label>Краткое описание</label>
            <md-textarea v-model="newsData.shortDescription"></md-textarea>
        </md-field>
        <vue-editor
                v-model="newsData.html"
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
        name: 'news-form',
        components: {
            ButtonWithDisabledTooltip,
            EmailTextfield,
            VueEditor
        },
        data() {
            return {
                newsId: null,
                isSaveInProgress: false,
                backUrl: '/main/news',
                editor: null,
                htmlEditorCfg: {},
                newsData: {
                    title: '',
                    seoUrl: '',
                    html: ''
                }
            }
        },
        methods: {
            loadNewsData: function(newsId) {
                var url = '/admin/workspace/news/' + newsId;
                this.$emit('startLoading', {text: 'Загрузка данных новости'});
                utils.doRequest(url, {}, function(data) {
                    this.newsData = data;
                    this.$emit('endLoading');
                }.bind(this));
            },
            onSaveBtnClick: function() {
                var url = '/admin/workspace/news/' + (this.newsId || '');
                this.isSaveInProgress = true;
                utils.doDataRequest(url, this.newsId ? 'PUT' : 'POST', this.newsData, function(res) {
                    this.isSaveInProgress = false;
                    this.$router.push(this.backUrl)
                }.bind(this));
            },
            handleHtmlEditorImageAdded: function(file, editor, cursorLocation, resetUploader) {
                let formData = new FormData();
                let xhr = new XMLHttpRequest();
                formData.append('file', file);
                xhr.open('POST', '/admin/workspace/news/upload_image/');
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
                    return 'Сохранение пользователя в процессе.';
                }
                if(!this.newsData.title) {
                    return 'Необходимо заполнить заголовок.'
                }
                return '';
            }
        },
        mounted: function() {
            this.newsId = this.$route.params.newsId;
            if(this.newsId) {
                this.loadNewsData(this.newsId);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .news-form-main-container {
        padding: 1.5em;
    }
</style>