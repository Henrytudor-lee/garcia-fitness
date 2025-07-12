import { ExerciseModel } from '@/types/base.model';
import axiosInstance from '.';

interface QueryExerciseParams {
    body_part_id: number;
    equipment_id: number;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export const queryExercises = (params: QueryExerciseParams) => {
    return axiosInstance.get<ApiResponse<ExerciseModel[]>>('/api/exercise/query', { params });
}; 