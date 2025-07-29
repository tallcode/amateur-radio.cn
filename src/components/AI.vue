<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useExplanationStore } from '@/store'
import renderMarkdown from '@/utils/md'

const props = defineProps<{
  question: Question
}>()

const { get } = useExplanationStore()

const explanation = ref<string>()

const show = ref(false)
async function handleClick() {
  show.value = true
}

onMounted(async () => {
  explanation.value = await get(props.question.I)
})
</script>

<template>
  <div v-if="explanation" class="pa-4">
    <v-btn v-if="!show" variant="tonal" color="warning" @click="handleClick">
      查看AI解释
    </v-btn>
    <v-alert v-else :color="explanation ? 'success' : 'error'">
      <div v-if="explanation" class="markdown" v-html="renderMarkdown(explanation)" />
      <div v-else>
        暂无AI解释
      </div>
    </v-alert>
  </div>
</template>
