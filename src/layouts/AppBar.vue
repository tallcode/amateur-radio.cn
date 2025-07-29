<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestionStore } from '@/store'

const questionStore = useQuestionStore()
const { category, full, paragraphs, keyword, paragraph } = storeToRefs(questionStore)
const { match } = questionStore
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

const isAll = computed(() => router.currentRoute.value.name === 'All')

const items = [
  { title: 'A类', value: 'a' },
  { title: 'B类', value: 'b' },
  { title: 'C类', value: 'c' },
]

const jumpNo = ref<number>()
const jumpTip = ref<string>()
function handleJump(callback: () => void) {
  jumpTip.value = ''
  const I = jumpNo.value?.toString().padStart(4, '0')
  const index = I ? full.value.findIndex(q => q.I === I) : -1
  if (I && index >= 0) {
    questionStore.keyword = undefined
    questionStore.paragraph = undefined
    jumpNo.value = undefined
    router.push({ name: 'All', params: { category: category.value, index: Number.parseInt(I) } })
    callback()
  }
  else {
    jumpTip.value = '题号不存在或不属于当前题库'
  }
}

const _keyword = ref(keyword.value)
const _paragraph = ref(paragraph.value)
const filterTip = ref<string>('')
function handleFilter(callback: () => void) {
  filterTip.value = ''
  if (!_keyword.value && !_paragraph.value) {
    questionStore.keyword = undefined
    questionStore.paragraph = undefined
    router.push({ name: 'All', params: { category: category.value, index: 1 } })
    callback()
    return
  }
  const filteredQuestions = full.value.filter(q => match(q, _keyword.value, _paragraph.value))
  if (filteredQuestions.length === 0) {
    filterTip.value = '没有匹配的题目'
  }
  else {
    questionStore.keyword = _keyword.value
    questionStore.paragraph = _paragraph.value
    router.push({ name: 'All', params: { category: category.value, index: Number.parseInt(filteredQuestions[0].I) } })
    callback()
  }
}

function handleClose(callback: () => void) {
  _keyword.value = keyword.value
  _paragraph.value = paragraph.value
  filterTip.value = ''
  jumpNo.value = undefined
  jumpTip.value = ''
  callback()
}
</script>

<template>
  <v-app-bar density="comfortable" color="blue-grey-lighten-1">
    <v-app-bar-title>
      <div class="d-flex ga-1 align-end cursor-pointer" @click="() => router.push({ name: 'Home' })">
        <v-icon icon="mdi-book-open-variant-outline" />{{ category.toUpperCase() }}类
      </div>
    </v-app-bar-title>
    <v-spacer />
    <v-dialog v-if="isAll" max-width="500">
      <template #activator="{ props: activatorProps }">
        <v-btn
          :active="!!(keyword || paragraph)"
          v-bind="activatorProps"
          icon="mdi-filter-outline"
        />
      </template>
      <template #default="{ isActive }">
        <v-card title="过滤题目">
          <v-card-text>
            <v-col cols="12">
              <v-select v-model="_paragraph" label="章节" :items="paragraphs" clearable />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="_keyword" label="关键字" clearable />
            </v-col>
            <v-col cols="12">
              <div>
                {{ filterTip }}
              </div>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text="关闭"
              @click="handleClose(() => isActive.value = false)"
            />
            <v-btn
              text="过滤"
              color="primary"
              @click="handleFilter(() => isActive.value = false)"
            />
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-dialog v-if="isAll" max-width="500">
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          icon="mdi-share-outline"
        />
      </template>
      <template #default="{ isActive }">
        <v-card title="跳转题目">
          <v-card-text>
            <v-col cols="12">
              <v-number-input v-model="jumpNo" label="题号" control-variant="split" />
            </v-col>
            <v-col cols="12">
              <div>
                {{ jumpTip }}
              </div>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text="关闭"
              @click="handleClose(() => isActive.value = false)"
            />
            <v-btn
              text="跳转"
              color="primary"
              @click="handleJump(() => isActive.value = false)"
            />
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
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
