<template>
    <div class="qsim-modal-popup">
        <div class="mask" @click="() => onMaskClick && onMaskClick()"></div>
        <div class="content">
            <div class="header">
                <slot name="header"></slot>
            </div>
            <div class="body">
                <slot name="body"></slot>
            </div>
            <div class="footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'qsim-modal-popup',
        props: ['onMaskClick']
    }
</script>

<style lang="scss" scoped>
    .qsim-modal-popup {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .mask {
            position: absolute;
            width: 100%;
            height: 100%;
            background: #c0c0c0;
            opacity: 0.5;
            z-index: 5;
        }
        .content {
            background: white;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            display: inline-block;
            overflow: auto;
            position: relative;
            top: 50%;
            left: 50%;
            transform: translateY(-50%) translate(-50%);
            z-index: 10;

            .header {
                font-weight: bold;
                font-size: 1.2em;
                width: 100%;
                text-align: center;
            }

            .body {
                padding: 1em;
            }
        }
    }
</style>