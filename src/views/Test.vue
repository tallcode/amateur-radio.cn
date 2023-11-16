<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Question from '@/components/Question.vue'
import { useExamStore, useQuestionStore, useWrongStore } from '@/store'

const props = defineProps<{
  id: string
  index: string
}>()

const questionStore = useQuestionStore()
const { category, questions } = storeToRefs(questionStore)
const examStore = useExamStore()
const { exam } = storeToRefs(examStore)
const wrongStore = useWrongStore()
const router = useRouter()

const index = computed(() => {
  const n = Number.parseInt(props.index || '1')
  return Number.isNaN(n) ? 1 : n
})

const examQuestions = computed(() => {
  return exam.value.find(item => item.id === props.id)?.questions || []
})

const finsihed = computed(() => {
  return examQuestions.value.every(item => item.answer !== undefined)
})

const status = computed(() => {
  return [
    examQuestions.value.filter(
      question => question.answer === question.options.indexOf(0),
    ).length,
    examQuestions.value.length,
  ]
})

const currentExamQuestion = computed(() => {
  return examQuestions.value[index.value - 1]
})

const question = computed(() => {
  if (questions.value.length) {
    const q = questions.value.find(item => item.id === currentExamQuestion.value?.id)
    if (q) {
      const { options, answer, ...rest } = q
      return {
        ...rest,
        options: currentExamQuestion.value?.options.map(id => options[id]),
        answer: currentExamQuestion.value?.options.findIndex(id => id === answer),
      } as Question
    }
    else { return undefined }
  }
  else { return undefined }
})

const answer = computed({
  get() {
    return currentExamQuestion.value?.answer
  },
  set(value) {
    if (Number.isSafeInteger(value) && question.value)
      examStore.answer(props.id, question.value?.id, value!)
  },
})

function next() {
  const newIndex = index.value + 1
  if (newIndex <= questions.value.length)
    router.push({ name: 'Test', params: { category: category.value, id: props.id, index: newIndex } })
}

function prev() {
  const newIndex = index.value - 1
  if (newIndex > 0)
    router.push({ name: 'Test', params: { category: category.value, id: props.id, index: newIndex } })
}

function swipe(direction: string) {
  if (direction === 'left' && answer.value !== undefined)
    next()
  else if (direction === 'right')
    prev()
}

function handleNewTest() {
  const id = examStore.create()
  router.push({
    name: 'Test',
    params: {
      category: category.value,
      id,
      index: 1,
    },
  })
}

function handleAnswer(value: number) {
  answer.value = value
  if (question.value?.answer !== value) {
    const originIndex = currentExamQuestion.value.options[value]
    wrongStore.record(currentExamQuestion.value.id, originIndex)
  }
}
</script>

<template>
  <div
    v-touch="{ left: () => swipe('left'), right: () => swipe('right'), up: () => swipe('up') }"
  >
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
    <div class="mb-14">
      <Question
        :question="question"
        mode="test"
        :answer="answer"
        @select="handleAnswer"
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
          :disabled="answer === undefined || index === examQuestions.length"
          @click="next"
        >
          下一题
        </v-btn>
      </template>
    </v-banner>
  </div>
</template>
