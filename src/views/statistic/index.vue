<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Statistics</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">

            <ion-card>
                <ion-card-header>
                    <ion-card-title class="text-xs p-2">
                        <ion-select label="Exercise" :value="selectExercise" placeholder="Select Exercise"
                            @ionChange="selectExerciseChange($event.detail.value)">
                            <ion-select-option :value="exc.exercise_id" v-for="exc in exerciseList">{{ exc.name
                            }}</ion-select-option>
                        </ion-select></ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <div ref="actionChart" class="chart"></div>
                </ion-card-content>
            </ion-card>
            <!-- <ion-card>
                <ion-card-header>
                    <ion-card-title class="text-xs p-2">
                        Recent Training Duration
                    </ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <div ref="durationChart" class="chart"></div>
                </ion-card-content>
            </ion-card> -->
            <!-- <ion-card>
                <ion-card-header>
                    <ion-card-title class="text-xs p-2"> Favorite Training Exercises</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <div class="max-h-[300px] overflow-auto">
                        <div class="flex items-center space-x-2" v-for="exercise in exerciseCountList"
                            :key="exercise.name">

                            <div class="w-[160px] h-[20px] overflow-hidden relative" >
                                <div class="absolute text-xs left-0 top-0 text-nowrap" style="animation: scroll 8s linear infinite;">
                                    {{ exercise.name }}
                                </div>
                            </div>
                            <div class="flex-1 h-[4px] flex items-center">
                                <div class="bg-red-100 h-full" :style="'width:' + (exercise.totalReps / exerciseCountList[0].totalReps * 100) + '%'"></div>
                            </div>
                            <div class="w-[40px] text-right text-xs">{{ exercise.totalReps }}</div>
                        </div>
                    </div>
                </ion-card-content>
            </ion-card> -->
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import axiosInstance from '@/api'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSelect, IonSelectOption } from '@ionic/vue'
import { ExerciseResponseRecordModel } from '@/types/response.model'

interface Exercise {
    exercise_id: number
    name: string
}
const selectExercise = ref(-1)
const exerciseList = ref<Exercise[]>([]);
const exerciseHistory = ref<ExerciseResponseRecordModel[]>([]);
const selectExerciseChange = (exerciseId: number) => {
    selectExercise.value = exerciseId
    axiosInstance.get('/api/exercise/getExerciseWeightRecord', {
        params: {
            user_id: 2,
            exercise_id: selectExercise.value
        }
    }).then((res) => {
        // 假设返回的数据格式为 { data: { actionHistory, durationHistory, actionRank } }
        exerciseHistory.value = res.data.data;
        renderActionChart()
    })
}

const exerciseCountList = ref<{ name: string, totalReps: number }[]>([]);

const actionChart = ref()
const durationChart = ref()

const renderActionChart = () => {
    const chart = echarts.init(actionChart.value);
    const data = exerciseHistory.value.map((item: ExerciseResponseRecordModel, index: number) => {
        return [index, Number(item.weight)]
    })
    chart.setOption({
        tooltip: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
        xAxis: { type: 'value' },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} kg' // Add unit 'kg' to the y-axis labels
            }
        },
        series: [{
            data,
            type: 'line',
            smooth: true,
        }]
    })
}
const renderDurationChart = (data: { date: string, duration: number }[]) => {
    const chart = echarts.init(durationChart.value)
    chart.setOption({
        tooltip: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '0%',
            top: '5%',
            containLabel: true
        },
        xAxis: { type: 'category', data: data.map(i => i.date) },
        yAxis: { type: 'value' },
        series: [{
            data: data.map(i => i.duration),
            type: 'line',
            smooth: false
        }]
    })
}

// 1、获取用户动作的记录
const getUserExerciseHistory = () => {
    return axiosInstance.get('/api/exercise/getHistoryExercises', {
        params: {
            user_id: 2,
        }
    }).then((res) => {
        exerciseList.value = res.data.data;

        if (exerciseList.value.length === 0) {
            return
        }
        selectExerciseChange(exerciseList.value[0].exercise_id);
    })
}

// 2、获取用户动作的训练时长记录
const getUserExerciseDuration = () => {
    return axiosInstance.get('/api/session/getLastWeekSessionDurations', {
        params: {
            user_id: 2,
            exercise_id: selectExercise.value
        }
    }).then((res) => {
        // 假设返回的数据格式为 { data: { durationHistory } }
        console.log(res.data.data)
        renderDurationChart(res.data.data)
    })
}
// 3、获取用户动作的训练次数排行
const getUserExerciseRank = () => {
    // return axiosInstance.get('/api/exercise/getExerciseCounts', {
    //     params: {
    //         user_id: 2,
    //         exercise_id: selectExercise.value
    //     }
    // }).then((res) => {
    //     // 假设返回的数据格式为 { data: { actionRank } }

    //     exerciseCountList.value = res.data.data.sort((a: { totalReps: number }, b: { totalReps: number }) => b.totalReps - a.totalReps);

    // })
}


onMounted(() => {
    getUserExerciseHistory();
    // getUserExerciseDuration();
    // getUserExerciseRank();
})
</script>

<style scoped>
.chart {
    width: 100%;
    height: 220px;
}

ion-card {
    margin: 8px;
    box-sizing: border-box;
}



.animate-scroll {
    display: inline-block;
    white-space: nowrap;
    position: absolute;
    will-change: transform;
}



.animate-scroll {
    display: inline-block;
    white-space: nowrap;
}
</style>