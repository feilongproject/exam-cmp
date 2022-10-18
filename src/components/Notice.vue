<template>
    <div v-if="noticeShow" class="notice">
        <div class="body">
            <div class="title">
                <span>{{ title }}</span>
            </div>
            <div class="content">
                <slot></slot>
            </div>
            <div>
                <button class="btn" @click="noticeShow = !noticeShow">关闭</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(["title"]);
const title = ref(props.title);

const noticeShow = ref(false);
defineExpose({ noticeShow });
</script>

<style scoped>
.notice {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
}
.body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    height: 80%;
    margin: 10%;
    background-color: #333333;
    box-shadow: 0 0 5px 1px darkgray;
}
.title {
    color: #ffffff;
    margin-top: 10px;
    font-size: 20px;
}
.content {
    width: 500px;
    height: 100%;
    margin-top: 10px;
    text-align: center;
    overflow-y: auto;
}
</style>