<template>
    <input type="date" class="qsim-datefield" v-on="listeners"></input>
</template>

<script>
    export default {
        name: 'qsim-datefield',
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
        border: 1px solid #CCC;

        &:focus {
            border-color: #30C366;
        }
    }
</style>