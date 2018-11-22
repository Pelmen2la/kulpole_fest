<template>
        <span class="button-with-tooltip-wrapper">
            <md-tooltip md-direction="top" v-show="isTooltipVisible">
                <span class="save-button-tooltip-text">{{tooltipText}}</span>
            </md-tooltip>
            <md-button class="md-raised md-primary" :disabled="isDisabled" @click="onClick">
                {{text}}
            </md-button>
        </span>
</template>

<script>
    export default {
        name: 'qsim-button-with-tooltip',
        props: ['text', 'isDisabled', 'tooltipText', 'isTooltipVisible', 'onClick']
    }
</script>

<style lang="scss" scoped>
    .button-with-tooltip-wrapper {
        display: inline-block;
    }
</style>

<style lang="scss">
    .save-button-tooltip-text {
        font-size: 16px;
    }
</style>

