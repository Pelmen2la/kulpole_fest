<template>
    <div class="fullscreen-image-container">
        <div class="mask" @click="onMaskClick"></div>
        <img :src="imageUrl"/>
    </div>
</template>

<script>
    export default {
        name: 'fullscreen-image',
        props: ['imageUrl'],
        methods: {
            onMaskClick() {
                this.$emit('onMaskClick');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fullscreen-image-container {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;

        .mask {
            position: absolute;
            width: 100%;
            height: 100%;
            background: #CACACA;
            top: 0;
            left: 0;
            opacity: 0.5;
            z-index: 5;
        }

        img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-height: 90%;
            max-width: 90%;
            z-index: 10;
        }
    }
</style>