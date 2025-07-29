<script setup lang="ts">
import dayjs from 'dayjs'
import { xor } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useExaminationStore } from '@/store'

const examinationStore = useExaminationStore()
const { examinations } = storeToRefs(examinationStore)
const router = useRouter()

const list = computed(() => {
  return examinations.value.map((item) => {
    return {
      id: item.id,
      category: item.category,
      createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      status: [
        item.questions.filter(
          question => xor(question.S, question.T).length === 0,
        ).length,
        item.questions.filter(
          question => question.S.length > 0 && xor(question.S, question.T).length > 0,
        ).length,
        item.questions.length,
      ],
    }
  })
})

async function remove(id: string) {
  await examinationStore.remove(id)
}
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
        @click="() => router.push({ name: 'Test', params: { id: item.id, index: 1, mode: 'history' } })"
      >
        <td>{{ item.createdAt }}</td>
        <td>{{ item.status.join('/') }}</td>
        <td>
          <v-btn
            prepend-icon="mdi-delete"
            variant="tonal" size="small"
            @click.stop="remove(item.id)"
          >
            删除
          </v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
