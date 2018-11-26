<template>
    <button class="qsim-button" v-on="listeners">{{ text }}</button>
</template>

<script>
    export default {
        name: 'qsim-button',
        props: {
            text: {
                type: String
            }
        },
        computed: {
            listeners() {
                var listeners = this.$listeners;
                listeners.input = event => this.$emit('input', event.target.value);
                return listeners;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .qsim-button {
        border: 1px solid #CCC;
        padding: 0.5em 1em;
        border-radius: 5px;
        color: white;
        background-color: #30C366;

        &:not([disabled]) {
            &:focus,
            &:hover {
                border-color: #39A265;
            }
        }
    }
</style>