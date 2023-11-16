<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useExamStore } from '@/store'

const examStore = useExamStore()
const { exam } = storeToRefs(examStore)
const router = useRouter()

const list = computed(() => {
  return exam.value.map((item) => {
    return {
      id: item.id,
      category: item.category,
      createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      status: [
        item.questions.filter(
          question => question.answer === question.options.indexOf(0),
        ).length,
        item.questions.filter(
          question => question.answer !== undefined && question.answer !== question.options.indexOf(0),
        ).length,
        item.questions.length,
      ],
    }
  })
})
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          时间
        </th>
        <th class="text-left">
          结果
        </th>
        <th class="text-left">
          操作
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in list"
        :key="item.id"
        @click="() => router.push({ name: 'Test', params: { id: item.id, index: 1 } })"
      >
        <td>{{ item.createdAt }}</td>
        <td>{{ item.status.join('/') }}</td>
        <td>
          <v-btn
            prepend-icon="mdi-delete"
            variant="tonal" size="small"
            @click.stop="() => examStore.remove(item.id)"
          >
            删除
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
