<template>
        <ButtonWithTooltip
                :text="text"
                :isDisabled="!!disabledText"
                :tooltipText="disabledText"
                :isTooltipVisible="!!disabledText"
                :onClick="onClick"
        />
</template>

<script>
    import ButtonWithTooltip from './ButtonWithTooltip.vue'

    export default {
        name: 'qsim-save-button',
        components: {
            ButtonWithTooltip
        },
        props: ['disabledText', 'onClick', 'text']
    }
</script>

