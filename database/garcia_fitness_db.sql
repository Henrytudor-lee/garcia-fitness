SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for exercises
-- ----------------------------
DROP TABLE IF EXISTS `exercises`;
CREATE TABLE `exercises` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `session_id` bigint(20) NOT NULL,
  `sequence` int(11) NOT NULL,
  `reps` int(11) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notes` varchar(255) DEFAULT NULL,
  `exercise_id` int(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of exercises
-- ----------------------------
BEGIN;
INSERT INTO `exercises` (`id`, `session_id`, `sequence`, `reps`, `weight`, `create_time`, `update_time`, `notes`, `exercise_id`, `name`) VALUES (1, 2, 0, 20, 20.00, '2025-07-07 23:50:16', '2025-07-07 23:50:16', NULL, 1, 'Bench Front Squat');
INSERT INTO `exercises` (`id`, `session_id`, `sequence`, `reps`, `weight`, `create_time`, `update_time`, `notes`, `exercise_id`, `name`) VALUES (2, 2, 1, 20, 20.00, '2025-07-07 23:50:19', '2025-07-07 23:50:19', NULL, 1, 'Bench Front Squat');
COMMIT;

-- ----------------------------
-- Table structure for exercises_library
-- ----------------------------
DROP TABLE IF EXISTS `exercises_library`;
CREATE TABLE `exercises_library` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `video_name` varchar(50) DEFAULT NULL,
  `video_file` varchar(255) DEFAULT NULL,
  `equipment_id` varchar(50) DEFAULT NULL,
  `body_part_id` varchar(50) DEFAULT NULL,
  `target_muscles_id` varchar(100) DEFAULT NULL,
  `synergist_muscles_id` varchar(100) DEFAULT NULL,
  `exercise_type` varchar(20) DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT '0',
  `num_exercises` int(11) DEFAULT NULL,
  `is_custom` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48278 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of exercises_library
-- ----------------------------
BEGIN;
INSERT INTO `exercises_library` (`id`, `name`, `image_name`, `video_name`, `video_file`, `equipment_id`, `body_part_id`, `target_muscles_id`, `synergist_muscles_id`, `exercise_type`, `is_favorite`, `num_exercises`, `is_custom`) VALUES (3970, 'StrongMan Dumbbell One Arm Clean and Jerk', 'https://xxx.xxx.com/xxx/', 'NULL', 'NULL', '4', '1', 'NULL', 'NULL', 'weight_reps', 0, 12, 0);
INSERT INTO `exercises_library` (`id`, `name`, `image_name`, `video_name`, `video_file`, `equipment_id`, `body_part_id`, `target_muscles_id`, `synergist_muscles_id`, `exercise_type`, `is_favorite`, `num_exercises`, `is_custom`) VALUES (3971, 'StrongMan Apollons Axle', 'https://xxx.xxx.com/xxx/', 'NULL', 'NULL', '1', '1', 'NULL', 'NULL', 'weight_reps', 0, NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `start_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `end_time` datetime DEFAULT NULL,
  `is_done` tinyint(1) NOT NULL,
  `status` varchar(255) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of sessions
-- ----------------------------
BEGIN;
INSERT INTO `sessions` (`id`, `user_id`, `start_time`, `end_time`, `is_done`, `status`, `notes`) VALUES (1, 2, '2025-07-07 23:50:09', '2025-07-07 23:50:09', 1, 'finished', NULL);
INSERT INTO `sessions` (`id`, `user_id`, `start_time`, `end_time`, `is_done`, `status`, `notes`) VALUES (2, 2, '2025-07-07 23:50:37', '2025-07-07 23:50:37', 1, 'finished', NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
