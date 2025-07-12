USE garcia_fitness;

CREATE TABLE
    `gar_users` (
        `id` bigint NOT NULL AUTO_INCREMENT,
        `email` varchar(255) NOT NULL,
        `password` varchar(255) NOT NULL,
        `name` varchar(100) NOT NULL,
        `avatar` varchar(255) DEFAULT NULL,
        `role` enum ('user', 'admin') NOT NULL DEFAULT 'user',
        `status` tinyint NOT NULL DEFAULT '1' COMMENT '1:active, 0:inactive',
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `email` (`email`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;