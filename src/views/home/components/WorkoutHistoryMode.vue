<template>
  <div class="px-4">
    <div class="bg-gray-800 text-gray-100 rounded-lg shadow-md p-4">
      <h2 class="text-lg font-bold mb-4">History</h2>
      
      <!-- 日历选择器 -->
      <DatePicker
        v-model="selectedDate"
        :masks="masks"
        :attributes="attributes"
        is-dark
        class="custom-calendar"
      />

      <!-- 训练记录列表 -->
      <div class="max-h-[400px] overflow-y-auto mt-4">
        <div v-if="error" class="bg-red-900/50 text-red-200 rounded-lg p-4 mb-4">
          {{ error }}
        </div>

        <div v-if="loading" class="space-y-4">
          <div v-for="i in 2" :key="i" class="bg-gray-700 rounded-lg p-4 animate-pulse">
            <div class="h-4 bg-gray-600 rounded w-1/4 mb-3"></div>
            <div class="h-3 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="!sessions.length" class="flex h-32 items-center justify-center text-gray-400">
          Today is a rest day
        </div>

        <div v-else class="space-y-4">
          <div v-for="session in sessions" 
               :key="session.id" 
               class="bg-gray-700 rounded-lg p-4">
            <!-- 训练时间信息 -->
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-200">
                  {{ formatTime(session.start_time) }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ formatDuration(session.start_time, session.end_time) }}
                </span>
              </div>
            </div>

            <!-- 训练项目列表 -->
            <div class="space-y-2">
              <div v-for="exercise in session.exercises" 
                   :key="exercise.id"
                   class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-gray-200">
                    {{ exercise.name }}
                  </span>
                  <div class="text-gray-400">
                    <template v-if="exercise.reps">
                      {{ exercise.reps }}*
                    </template>
                    <template v-if="exercise.weight">
                      {{ exercise.weight }}kg
                    </template>
                    <template v-if="exercise.duration_sec">
                      {{ exercise.duration_sec }}秒
                    </template>
                  </div>
                </div>
                <div v-if="exercise.notes" class="text-gray-400">
                  {{ exercise.notes }}
                </div>
              </div>
            </div>
            
            <!-- 训练备注 -->
            <div v-if="session.notes" class="mt-2 text-sm text-gray-400">
              备注: {{ session.notes }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { format } from 'date-fns'
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import axiosInstance from '@/api'
import { RequestUrl } from '@/types/requestUrl.model'

interface Exercise {
  id: number
  name: string
  sequence: number
  reps?: number
  weight?: number
  duration_sec?: number
  notes?: string
}

interface Session {
  id: number
  user_id: number
  start_time: string
  end_time: string | null
  is_done: number
  status: string
  notes?: string
  exercises: Exercise[]
}

const selectedDate = ref<Date>(new Date())
const sessions = ref<Session[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// 日历配置
const masks = {
  input: 'YYYY-MM-DD'
}

const attributes = [
  {
    key: 'today',
    highlight: {
      color: 'blue',
      fillMode: 'light'
    },
    dates: new Date()
  }
]

// 获取训练记录
const fetchSessions = async (date: Date) => {
  loading.value = true
  error.value = null
  try {
    const formattedDate = format(date, 'yyyy-MM-dd')
    const response = await axiosInstance.get(RequestUrl.Get_History_By_Date, {
      params: {
        date: formattedDate
      }
    })
    if (response.data.success) {
      sessions.value = response.data.data
    } else {
      error.value = response.data.error || '获取数据失败'
    }
  } catch (err) {
    console.error('获取训练记录失败:', err)
    error.value = '网络请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (dateString: string) => {
  return format(new Date(dateString), 'HH:mm')
}

// 格式化持续时间
const formatDuration = (start: string, end: string | null) => {
  if (!end) return '';
  const startTime = new Date(start);
  const endTime = new Date(end);
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  return `${durationMinutes} 分钟`;
}

// 获取器械名称
const equipmentMap: Record<number, string> = {
  1: '杠铃',
  2: '哑铃',
  3: '器械',
  // ... 添加更多器械映射
}

const getEquipmentName = (equipmentId: number) => {
  return equipmentMap[equipmentId] || `器械${equipmentId}`
}

onMounted(() => {
  fetchSessions(selectedDate.value)
})

watch(selectedDate, (newDate) => {
  if (newDate) {
    fetchSessions(newDate)
  }
})
</script>

<style>
.custom-calendar {
  --vc-bg-dark: #1f2937;
  --vc-border-dark: #374151;
  --vc-text-dark: #e5e7eb;
  --vc-accent-dark: #3b82f6;
  --vc-highlight-dark: #60a5fa;
  --vc-highlight-content-dark: #1f2937;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--vc-border-dark);
}

.custom-calendar :deep(.vc-container) {
  border: none;
}

.custom-calendar :deep(.vc-weeks) {
  padding: 0 1rem;
}

.custom-calendar :deep(.vc-day) {
  height: 36px;
}
</style>