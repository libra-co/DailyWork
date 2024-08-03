-- CreateTable
CREATE TABLE `User` (
    `uid` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `gender` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDelete` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `projectId` VARCHAR(191) NOT NULL,
    `projectName` VARCHAR(191) NOT NULL,
    `updatedTime` DATETIME(3) NOT NULL,
    `createdTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishTime` DATETIME(3) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `creatorId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `notion` VARCHAR(191) NULL,
    `isDeleted` INTEGER NOT NULL DEFAULT 0,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isDelete` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `taskId` VARCHAR(191) NOT NULL,
    `taskName` VARCHAR(191) NOT NULL,
    `creatorId` VARCHAR(191) NOT NULL,
    `assigneeId` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `order` INTEGER NOT NULL DEFAULT 0,
    `description` VARCHAR(191) NULL DEFAULT '',
    `createdTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedTime` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NULL,
    `finishTime` DATETIME(3) NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `parentTaskId` VARCHAR(191) NULL DEFAULT '',
    `columnId` VARCHAR(191) NOT NULL,
    `notion` VARCHAR(191) NULL,
    `isDeleted` INTEGER NOT NULL DEFAULT 0,
    `customItemList` VARCHAR(191) NULL,
    `isDelete` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`taskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Column` (
    `columnId` VARCHAR(191) NOT NULL,
    `columnName` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `updatedTime` DATETIME(3) NOT NULL,
    `isDelete` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`columnId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notion` (
    `notionId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `content` VARCHAR(191) NOT NULL DEFAULT '',
    `updateTime` DATETIME(3) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `creatorId` VARCHAR(191) NOT NULL,
    `isDelete` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`notionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
