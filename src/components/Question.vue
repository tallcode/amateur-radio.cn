<script setup lang="ts">
import { difference, union, xor } from 'lodash-es'
import { computed } from 'vue'

const props = defineProps<{
  question?: Question
  mode: 'test' | 'review' | 'view' | 'history' // 考试模式、复习模式、查看模式
}>()

// 用户选择的选项
const selected = defineModel<number[]>('selected', {
  default: () => [],
})

const picUrl = computed(() => {
  if (props.question && props.question.F)
    return `/question/picture/${props.question.F}`
  else
    return undefined
})

const options = computed(() => {
  if (props.question) {
    return props.question.O.map((option, i) => ({
      title: option,
      value: i,
    }))
  }
  else {
    return []
  }
})

const _selected = computed({
  get: () => {
    if (props.mode === 'review') {
      return union(props.question?.T || [], selected.value) // 复习模式下，选中所有正确答案
    }
    else {
      return selected.value
    }
  },
  set: (value: number[]) => {
    if (props.mode === 'test' || props.mode === 'view') {
      selected.value = value
    }
  },
})

function color(i: number) {
  // 首先是只有选中项目才有颜色
  // 如果多选题完全答对，那么返回'success'颜色
  // 如果多选题答错，那么返回'error'颜色
  // 如果少选了，那么返回'warning'颜色

  if (selected.value.includes(i)) {
    if (props.mode === 'test') {
      return 'primary'
    }
    else if (xor(props.question?.T || [], selected.value).length === 0) {
      return 'success'
    }
    else if (difference(selected.value, props.question?.T || []).length === 0) {
      return 'warning'
    }
    else {
      return 'error'
    }
  }
  else if (props.mode === 'review' && props.question?.T.includes(i)) {
    return 'success'
  }
}
</script>

<template>
  <div v-if="question" class="pa-4">
    <p class="font-weight-medium mb-2">
      {{ `${question.I}: ${question.Q}` }}
    </p>
    <p v-if="picUrl">
      <v-img :src="picUrl" max-height="200" />
    </p>
    <v-list
      v-model:selected="_selected"
      select-strategy="leaf"
      :items="options"
    >
      <v-list-item
        v-for="(option, i) in options"
        :key="option.value"
        :value="option.value"
        :color="color(i)"
      >
        {{ `${String.fromCharCode(65 + i)}. ${option.title}` }}
      </v-list-item>
    </v-list>
  </div>
</template>
