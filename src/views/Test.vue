<script lang="ts" setup>
import { xor } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Question from '@/components/Question.vue'
import { useBookmarkStore, useExaminationStore, useQuestionStore } from '@/store'

const props = defineProps<{
  id: string
  index: string
  mode: 'test' | 'history'
}>()

const questionStore = useQuestionStore()
const { category, full } = storeToRefs(questionStore)
const examinationStore = useExaminationStore()
const { examinations } = storeToRefs(examinationStore)
const bookmarkStore = useBookmarkStore()
const router = useRouter()

const index = computed(() => {
  const n = Number.parseInt(props.index || '1')
  return Number.isNaN(n) ? 1 : n
})

const examQuestions = computed(() => {
  return examinations.value.find(item => item.id === props.id)?.questions || []
})

const finsihed = computed(() => {
  return examQuestions.value.length && examQuestions.value.every(item => item.S.length > 0)
})

const status = computed(() => {
  return [
    examQuestions.value.filter(
      question => xor(question.S, question.T).length === 0,
    ).length,
    examQuestions.value.length,
  ]
})

const currentExamQuestion = computed(() => {
  return examQuestions.value[index.value - 1]
})

const question = computed(() => {
  if (full.value.length) {
    const q = full.value.find(item => item.I === currentExamQuestion.value?.I)
    if (q) {
      const { O, T, ...rest } = q
      return {
        ...rest,
        T: currentExamQuestion.value?.T || [],
        O: currentExamQuestion.value?.O.map(id => O[id]),
      } as Question
    }
    else {
      return undefined
    }
  }
  else {
    return undefined
  }
})

const answer = computed({
  get() {
    return currentExamQuestion.value?.S || []
  },
  async set(value) {
    if (question.value) {
      await examinationStore.answer(props.id, question.value?.I, Array.isArray(value) ? value : [])
    }
  },
})

const disableNext = computed(() => {
  if (index.value === examQuestions.value.length) {
    return true
  }
  if (props.mode === 'history') {
    return false
  }
  else {
    return !(Array.isArray(answer.value) && answer.value.length)
  }
})

function next() {
  if (disableNext.value) {
    return
  }
  const isCorrect = currentExamQuestion.value?.S && xor(currentExamQuestion.value?.S, currentExamQuestion.value?.T).length === 0
  if (isCorrect) {
    bookmarkStore.correct(currentExamQuestion.value.I)
  }
  else {
    bookmarkStore.record(currentExamQuestion.value.I, currentExamQuestion.value.S.map(a => currentExamQuestion.value.O[a]))
  }

  if (index.value < full.value.length) {
    router.push({ name: 'Test', params: { mode: props.mode, category: category.value, id: props.id, index: index.value + 1 } })
  }
}

function prev() {
  if (index.value > 1) {
    router.push({ name: 'Test', params: { mode: props.mode, category: category.value, id: props.id, index: index.value - 1 } })
  }
}

async function handleNewTest() {
  const id = await examinationStore.create()
  router.push({
    name: 'Test',
    params: {
      mode: 'test',
      category: category.value,
      id,
      index: 1,
    },
  })
}
</script>

<template>
  <v-banner
    v-if="finsihed"
    :sticky="true"
    lines="one"
    bg-color="teal-lighten-3"
  >
    <template #text>
      {{ `全部完成! (${status.join('/')})` }}
    </template>

    <template #actions>
      <v-btn color="primary" @click="router.push({ name: 'History' })">
        查看历史
      </v-btn>
      <v-btn color="primary" @click="handleNewTest">
        开始新测试
      </v-btn>
    </template>
  </v-banner>
  <div
    v-touch="{
      left: () => next(),
      right: () => prev(),
    }"
    class="h-100 pb-14"
  >
    <Question
      v-model:selected="answer"
      :question="question"
      :mode="mode"
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
      {{ `${index}/${examQuestions.length}` }}
    </template>

    <template #actions>
      <v-btn :disabled="index === 1" @click="prev">
        上一题
      </v-btn>
      <v-btn
        :disabled="disableNext"
        @click="next"
      >
        下一题
      </v-btn>
    </template>
  </v-banner>
</template>
