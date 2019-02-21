<template>
        <md-field :class="value && !isValid ? 'md-invalid' : ''">
            <label>Email адрес</label>
            <md-input :value="value"
                      @input="onInputChange"
                      class="checker-email-input"
                       :required="!!isRequired"
            />
            <span class="md-error">Email введен в неверном формате</span>
        </md-field>
</template>

<script>
    export default {
        name: 'qsim-email-textfield',
        props: ['value', 'isRequired'],
        data() {
            return {
                isValid: false
            };
        },
        methods: {
            onInputChange(val) {
                this.$emit('input', val);
                const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                var isEmailValid = emailRegex.test(this.value);
                if(isEmailValid !== this.isValid) {
                    this.isValid = isEmailValid;
                    this.$emit('validityChange', this.isValid);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .checker-email-input:focus + .md-error {
        visibility: hidden;
    }
</style>
