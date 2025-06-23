<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import renderMarkdown from '@/utils/md'

const props = defineProps<{
  question: Question
}>()

const explanationMap = ref<Record<string, string>>({})
const explanation = computed(() => props.question?.id ? (explanationMap.value?.[props.question.id] ?? null) : null)

async function fetchAIExplanation() {
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

const hasExplanation = ref(false)
async function checkAIExplanation() {
  try {
    const response = await fetch(`/src/assets/ai/${props.question.id}.txt`, {
      method: 'HEAD',
    })
    if (response.ok) {
      hasExplanation.value = true
    }
  }
  catch (error) {
    console.error(error)
  }
}

const show = ref(false)
async function handleClick() {
  await fetchAIExplanation()
  show.value = true
}

onMounted(async () => {
  await checkAIExplanation()
})
</script>

<template>
  <div v-if="hasExplanation" class="pa-4">
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
