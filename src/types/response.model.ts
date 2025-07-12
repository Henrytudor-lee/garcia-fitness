export interface ExerciseResponseRecordModel {
    id: number;
    session_id: number;
    sequence: number;
    reps: number;
    weight: string;
    create_time: string;
    update_time: string;
    notes: string | null;
    exercise_id: number;
    name: string;
    user_id: number;
}