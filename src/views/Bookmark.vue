<script setup lang="ts">
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AI from '@/components/AI.vue'
import Question from '@/components/Question.vue'
import { useBookmarkStore, useQuestionStore } from '@/store'

const props = defineProps<{
  id?: string
}>()

const bookmarkStore = useBookmarkStore()
const { bookmarks } = storeToRefs(bookmarkStore)
const questionStore = useQuestionStore()
const { full } = storeToRefs(questionStore)
const router = useRouter()

const list = computed(() => {
  return bookmarks.value.map((item) => {
    return {
      id: item.id,
      category: item.category,
      time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'),
      questionId: item.questionId,
      S: item.S,
    }
  })
})

const index = computed(() => {
  return list.value.findIndex(item => item.id === props.id) + 1
})

const currentBookmark = computed(() => {
  return index.value > 0 ? list.value[index.value - 1] : undefined
})

const question = computed(() => {
  if (full.value.length && currentBookmark.value)
    return full.value.find(item => item.I === currentBookmark.value?.questionId)
  else
    return undefined
})

function handleView(id?: string) {
  router.push({ name: 'Bookmark', params: { id } })
}

function prev() {
  if (index.value > 1) {
    handleView(bookmarks.value[index.value - 2].id)
  }
}

function next() {
  if (index.value < bookmarks.value.length) {
    handleView(bookmarks.value[index.value].id)
  }
}

async function remove() {
  if (currentBookmark.value?.id) {
    const nextId = bookmarks.value[index.value]?.id
    await bookmarkStore.remove(currentBookmark.value?.id)
    handleView(nextId)
  }
}

async function clear() {
  await bookmarkStore.clear()
}
</script>

<template>
  <div v-if="!question">
    <v-table class="mb-14">
      <thead>
        <tr>
          <th class="text-left">
            时间
          </th>
          <th class="text-left">
            题号
          </th>
          <th class="text-left">
            你的答案
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in list"
          :key="item.id"
          @click="handleView(item.id)"
        >
          <td>{{ item.time }}</td>
          <td>{{ item.questionId }}</td>
          <td>{{ item.S.map(a => String.fromCharCode(65 + a)).join(',') }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-banner
      position="fixed"
      lines="one"
      color="primary"
      bg-color="white"
      :style="{ bottom: '55px', borderTopWidth: '1px' }"
    >
      <template #actions>
        <v-btn
          @click="clear()"
        >
          清空
        </v-btn>
      </template>
    </v-banner>
  </div>
  <tempalte v-else>
    <div
      v-touch="{
        left: () => next(),
        right: () => prev(),
      }" class="pb-14 h-100"
    >
      <Question
        mode="review"
        :question="question"
        :answer="question?.T"
        :selected="currentBookmark?.S"
      />
      <AI
        v-if="question"
        :question="question"
      />
      <v-card variant="tonal" color="amber" class="ma-4">
        <template #text>
          上次答错：{{ currentBookmark?.time }}
        </template>
        <v-card-actions>
          <div class="w-100 text-end">
            <v-btn
              variant="text"
              color="amber-darken-4"
              @click="remove()"
            >
              删除这条记录
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </div>
    <v-banner
      position="fixed"
      lines="one"
      color="primary"
      bg-color="white"
      style="bottom: 55px;"
    >
      <template #text>
        {{ `${index}/${bookmarks.length}` }}
      </template>
      <template #actions>
        <v-btn @click="handleView()">
          返回
        </v-btn>
        <v-btn :disabled="index === 1" @click="prev">
          上一题
        </v-btn>
        <v-btn :disabled="index === bookmarks.length" @click="next">
          下一题
        </v-btn>
      </template>
    </v-banner>
  </tempalte>
</template>
