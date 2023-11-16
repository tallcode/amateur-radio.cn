<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '@/store'

const questionStore = useQuestionStore()
const { category } = storeToRefs(questionStore)
const router = useRouter()

const selected = computed({
  get() {
    return [category.value]
  },
  set(value) {
    if (Array.isArray(value) && value.length)
      router.push({ name: 'All', params: { category: value[0], index: 1 } })
  },
})

const items = [
  { title: 'A类', value: 'a' },
  { title: 'B类', value: 'b' },
  { title: 'C类', value: 'c' },
]
</script>

<template>
  <v-app-bar density="comfortable" color="blue-grey-lighten-1">
    <v-app-bar-title>
      {{ category.toUpperCase() }}类
    </v-app-bar-title>
    <v-spacer />
    <v-menu>
      <template #activator="{ props }">
        <v-btn icon="mdi-alphabetical" v-bind="props" />
      </template>
      <v-list v-model:selected="selected" color="primary" min-width="100">
        <v-list-item
          v-for="item in items" :key="item.value"
          :value="item.value"
        >
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
