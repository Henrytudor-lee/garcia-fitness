export interface Equipment {
  id: number;
  name: string;
}

export interface Muscle {
  id: number;
  name: string;
}

export interface ExerciseDifficulty {
  id: number;
  name: DiffType;
}

export interface ExerciseModel {
  id: number;
  name: string;
  image_name: string;
  video_name: string;
  video_file: string;
  equipment_id: number;
  body_part_id: number[];
  exercise_type: 'weight_reps' | string;
  is_favorite: boolean;
}

export interface ExerciseResponseModel {
  id: number;
  name: string;
  image_name: string;
  video_name: string;
  equipment_id: string;
  body_part_id: string;
  exercise_type: 'weight_reps' | string;
  is_favorite: boolean;
}

export enum DiffType {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Novice = "Novice",
}
