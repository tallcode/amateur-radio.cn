<script lang="ts" setup>
import { ref } from 'vue'
import { useExplanationStore, useQuestionStore } from '@/store'

const libResetTip = ref(false)

async function handleClear() {
  const questionStore = useQuestionStore()
  const explanationStore = useExplanationStore()

  await questionStore.clear()
  await explanationStore.clear()
  libResetTip.value = true
}
</script>

<template>
  <div style="height: 100vh; display: flex; flex-direction: column;">
    <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px;">
      <h2>业余无线电台操作技术能力验证</h2>
      <div>版本：2025</div>
      <div>&nbsp;</div>
      <v-btn class="bg-indigo-lighten-2" to="/a" type="primary" variant="tonal">
        A类题库
      </v-btn>
      <v-btn class="bg-indigo-lighten-2" to="/b" type="primary" variant="tonal">
        B类题库
      </v-btn>
      <v-btn class="bg-indigo-lighten-2" to="/c" type="primary" variant="tonal">
        C类题库
      </v-btn>
    </div>
    <div style="line-height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 10px;">
      <div>本软件无需注册登录，数据保存在浏览器本地。</div>
      <div>题库首次下载后可以离线使用。如果题库异常，点此<a href="#" class="text-blue-darken-4" @click.prevent="handleClear">重新加载</a></div>
      <div>
        <a class="text-blue-darken-4" href="https://beian.miit.gov.cn/">浙ICP备20025327号-2</a>
      </div>
    </div>
  </div>
  <v-snackbar v-model="libResetTip">
    题库已经重置
    <template #actions>
      <v-btn
        color="indigo-lighten-4"
        variant="text"
        @click="libResetTip = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
