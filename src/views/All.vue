<script lang="ts" setup>
import { shuffle } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AI from '@/components/AI.vue'
import Question from '@/components/Question.vue'
import { useQuestionStore } from '@/store'

const props = defineProps<{
  index?: string
}>()

const showAnswer = ref(false)

const questionStore = useQuestionStore()
const { questions } = storeToRefs(questionStore)
const router = useRouter()

const index = computed(() => {
  const n = Number.parseInt(props.index || '1')
  const I = (Number.isNaN(n) ? 1 : n).toString().padStart(4, '0')
  const i = questions.value.findIndex(q => q.I === I)
  return i >= 0 ? i + 1 : 1
})

const question = computed(() => {
  if (questions.value.length)
    return questions.value[index.value - 1]
  else
    return undefined
})

function next() {
  const newIndex = index.value + 1
  if (newIndex <= questions.value.length) {
    const I = questions.value[newIndex - 1].I
    router.push({ name: 'All', params: { index: Number.parseInt(I) } })
  }
}

function prev() {
  const newIndex = index.value - 1
  if (newIndex > 0) {
    const I = questions.value[newIndex - 1].I
    router.push({ name: 'All', params: { index: Number.parseInt(I) } })
  }
}

function random() {
  const newIndex = Math.ceil(Math.random() * questions.value.length)
  const I = questions.value[newIndex - 1].I
  router.push({ name: 'All', params: { index: Number.parseInt(I) } })
}

const _question = computed(() => {
  if (showAnswer.value) {
    return question.value
  }
  else if (question.value) {
    const { O, T, ...rest } = question.value
    const randomOptions = shuffle([0, 1, 2, 3])
    return {
      ...rest,
      O: randomOptions.map(i => O[i]),
      T: T.map(id => randomOptions.indexOf(id)),
    }
  }
  else {
    return undefined
  }
})

const selected = ref<number[]>([])
const _selected = computed({
  get: () => {
    if (showAnswer.value) {
      return question.value?.T || []
    }
    return selected.value
  },
  set: (value: number[]) => {
    selected.value = value
  },
})

watch(_question, () => {
  selected.value = []
})
</script>

<template>
  <div
    v-touch="{
      left: () => next(),
      right: () => prev(),
      down: () => random(),
    }" class="pb-14 h-100"
  >
    <Question
      v-model:selected="_selected"
      mode="view"
      :question="_question"
    />
    <AI
      v-if="question && showAnswer"
      :key="question.I"
      :question="question"
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
      <v-btn :variant="showAnswer ? 'tonal' : undefined" color="primary" @click="showAnswer = !showAnswer">
        学习模式
      </v-btn>
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
</template>
