<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  question?: Question
  mode?: 'test' | 'review' | 'view'
  answer?: number
  wrongAnswer?: number
}>()

const emit = defineEmits<{
  (e: 'select', answer: number): void
}>()

const picUrl = computed(() => {
  if (props.question && props.question.picture)
    return (new URL(`/src/assets/picture/${props.question.picture}`, import.meta.url)).href
  else
    return undefined
})

const options = computed(() => {
  if (props.question) {
    return props.question.options.map((option, i) => ({
      title: option,
      value: i,
    }))
  }
  else {
    return []
  }
})

const color = computed(() => {
  if (props.mode === 'test')
    return props.answer === props.question?.answer ? 'success' : 'error'
  return 'primary'
})

const selected = computed({
  get() {
    if (props.mode === 'test')
      return Number.isSafeInteger(props.answer) ? [props.answer] : []
    return undefined
  },
  set(value) {
    if (props.mode === 'test' && Array.isArray(value) && value.length && Number.isSafeInteger(value[0]))
      emit('select', value[0] as number)
  },
})
</script>

<template>
  <div v-if="question" class="pa-4">
    <p class="font-weight-medium mb-2">
      {{ `${question.id}: ${question.question}` }}
    </p>
    <p v-if="picUrl">
      <v-img :src="picUrl" max-height="200" />
    </p>
    <v-list
      v-model:selected="selected"
      :items="options"
    >
      <v-list-item
        v-for="(option, i) in options"
        :key="option.value"
        :value="option.value"
        :color="i === wrongAnswer ? 'error' : color"
        :active="i === answer || i === wrongAnswer"
      >
        {{ `${String.fromCharCode(65 + i)}. ${option.title}` }}
      </v-list-item>
    </v-list>
  </div>
</template>
