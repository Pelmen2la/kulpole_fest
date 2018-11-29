<template>
    <div class="news-form-main-container">
        <md-button class="md-raised" :href="'#' + backUrl">Назад</md-button>
        <md-field>
            <label>Заголовок</label>
            <md-input v-model="newsData.title"/>
        </md-field>
        <ButtonWithDisabledTooltip :disabledText="saveButtonDisabledText" :onClick="onSaveBtnClick" text="Сохранить"/>
    </div>
</template>

<script>
    import utils from './../../../common/js/utils'
    import ButtonWithDisabledTooltip from '../../../common/vue-components/button/ButtonWithDisabledTooltip'
    import EmailTextfield from '../../../common/vue-components/field/EmailTextfield'

    export default {
        name: 'news-form',
        components: {
            ButtonWithDisabledTooltip,
            EmailTextfield
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
                this.newsData.html = this.getHtmlEditor().getContent();
                this.isSaveInProgress = true;
                utils.doDataRequest(url, this.newsId ? 'PUT' : 'POST', this.newsData, function(res) {
                    this.isSaveInProgress = false;
                    this.$router.push(this.backUrl)
                }.bind(this));
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