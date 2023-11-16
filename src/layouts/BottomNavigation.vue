<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useExamStore, useQuestionStore } from '@/store'

const questionStore = useQuestionStore()
const { category } = storeToRefs(questionStore)
const { create } = useExamStore()
const { exam } = storeToRefs(useExamStore())
const router = useRouter()
const route = useRoute()

const selected = computed({
  get() {
    return route.name
  },
  set(value) {
    switch (value) {
      case 'All':
        router.push({ name: 'All', params: { category: category.value, index: 1 } })
        break
      case 'Bookmark':
        router.push({ name: 'Bookmark' })
        break
      case 'History':
        router.push({ name: 'History' })
        break
      case 'Test':
        handleTest()
        break
    }
  },
})

function handleTest() {
  if (selected.value === 'Test')
    return
  const last = exam.value[0]
  const finsihed = last ? last?.questions.every(item => item.answer !== undefined) : true
  const id = finsihed ? create() : last?.id
  const index = finsihed ? 1 : last?.questions.findIndex(item => item.answer === undefined) + 1
  router.push({
    name: 'Test',
    params: {
      category: category.value,
      id,
      index,
    },
  })
}
</script>

<template>
  <v-bottom-navigation v-model:model-value="selected" grow>
    <v-btn value="All">
      <v-icon>mdi-folder</v-icon>
      <span>全部</span>
    </v-btn>

    <v-btn value="Bookmark">
      <v-icon>mdi-book</v-icon>
      <span>错题</span>
    </v-btn>

    <v-btn value="History">
      <v-icon>mdi-history</v-icon>
      <span>历史</span>
    </v-btn>

    <v-btn value="Test">
      <v-icon>mdi-note-edit</v-icon>
      <span>测试</span>
    </v-btn>
  </v-bottom-navigation>
</template>
