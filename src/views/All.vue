<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '@/store'
import Question from '@/components/Question.vue'

const props = defineProps<{
  index?: string
}>()

const questionStore = useQuestionStore()
const { questions } = storeToRefs(questionStore)
const router = useRouter()

const index = computed(() => {
  const n = Number.parseInt(props.index || '1')
  return Number.isNaN(n) ? 1 : n
})

const question = computed(() => {
  if (questions.value.length)
    return questions.value[index.value - 1]
  else
    return undefined
})

function next() {
  const newIndex = index.value + 1
  if (newIndex <= questions.value.length)
    router.push({ name: 'All', params: { index: newIndex } })
}

function prev() {
  const newIndex = index.value - 1
  if (newIndex > 0)
    router.push({ name: 'All', params: { index: newIndex } })
}

function random() {
  const newIndex = Math.floor(Math.random() * questions.value.length)
  router.push({ name: 'All', params: { index: newIndex } })
}

function swipe(direction: string) {
  if (direction === 'right')
    prev()
  else if (direction === 'left')
    next()
  else if (direction === 'up')
    random()
}
</script>

<template>
  <div
    v-touch="{ left: () => swipe('left'), right: () => swipe('right'), up: () => swipe('up') }"
  >
    <div class="mb-14">
      <Question
        mode="view"
        :question="question"
        :answer="question?.answer"
      />
    </div>
    <v-banner
      position="fixed"
      lines="one"
      color="primary"
      bg-color="white"
      :style="{ bottom: '55px', borderTopWidth: '1px' }"
    >
      <template #text>
        {{ `${index}/${questions.length}` }}
      </template>
      <template #actions>
        <v-btn @click="random">
          随机
        </v-btn>
        <v-btn :disabled="index === 1" @click="prev">
          上一题
        </v-btn>
        <v-btn :disabled="index === questions.length" @click="next">
          下一题
        </v-btn>
      </template>
    </v-banner>
  </div>
</template>
