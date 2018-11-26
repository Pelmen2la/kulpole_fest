<template>
    <input type="text" class="qsim-textfield" v-on="listeners"></input>
</template>

<script>
    export default {
        name: 'qsim-textfield',
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
    .qsim-textfield {
        width: 100%;
        height: 2em;
        text-indent: 0.5em;
        border-bottom: 1px solid #CCC;

        &:focus {
            border-color: #4CAF50;
        }
    }
</style>