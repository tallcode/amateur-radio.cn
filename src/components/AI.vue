<script setup lang="ts">
import { computed, ref } from 'vue'
import renderMarkdown from '@/utils/md'

const props = defineProps<{
  question?: Question
}>()

const explanationMap = ref<Record<string, string>>({})
const explanation = computed(() => props.question?.id ? (explanationMap.value?.[props.question.id] ?? null) : null)

async function fetchAIExplanation() {
  if (!props.question || !props.question.id)
    return
  try {
    const response = await fetch(`/src/assets/ai/${props.question.id}.txt`)
    if (response.ok) {
      explanationMap.value[props.question.id] = await response.text()
    }
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div v-if="question" class="pa-4">
    <v-btn v-if="explanation === null" variant="tonal" color="warning" @click="fetchAIExplanation">
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
