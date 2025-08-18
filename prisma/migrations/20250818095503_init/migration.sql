-- CreateEnum
CREATE TYPE "public"."schedule_rule" AS ENUM ('WEEKLY', 'MONTHLY', 'ONE_OFF');

-- CreateTable
CREATE TABLE "public"."files" (
    "file_id" BIGSERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT,
    "file_size" BIGINT,
    "sha256" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "public"."company" (
    "company_id" BIGSERIAL NOT NULL,
    "company_name" TEXT,
    "company_address" TEXT,

    CONSTRAINT "company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "public"."sites" (
    "site_id" BIGSERIAL NOT NULL,
    "company_id" BIGINT NOT NULL,
    "site_name" TEXT NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("site_id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "task_id" BIGSERIAL NOT NULL,
    "task_name" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "public"."area_tasks" (
    "area_task_id" BIGSERIAL NOT NULL,
    "site_id" BIGINT NOT NULL,
    "task_id" BIGINT NOT NULL,

    CONSTRAINT "area_tasks_pkey" PRIMARY KEY ("area_task_id")
);

-- CreateTable
CREATE TABLE "public"."schedules" (
    "schedule_id" BIGSERIAL NOT NULL,
    "area_task_id" BIGINT NOT NULL,
    "rule_type" "public"."schedule_rule" NOT NULL,
    "mon" BOOLEAN,
    "tue" BOOLEAN,
    "wed" BOOLEAN,
    "thu" BOOLEAN,
    "fri" BOOLEAN,
    "sat" BOOLEAN,
    "sun" BOOLEAN,
    "by_month_day" INTEGER[],
    "ordinal_week" INTEGER,
    "ordinal_wday" INTEGER,
    "occurs_on" TIMESTAMP(3),
    "effective_from" TIMESTAMP(3),
    "effective_to" TIMESTAMP(3),
    "rrule" TEXT,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_sha256_key" ON "public"."files"("sha256");

-- AddForeignKey
ALTER TABLE "public"."sites" ADD CONSTRAINT "sites_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."area_tasks" ADD CONSTRAINT "area_tasks_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("site_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."area_tasks" ADD CONSTRAINT "area_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_area_task_id_fkey" FOREIGN KEY ("area_task_id") REFERENCES "public"."area_tasks"("area_task_id") ON DELETE CASCADE ON UPDATE CASCADE;
