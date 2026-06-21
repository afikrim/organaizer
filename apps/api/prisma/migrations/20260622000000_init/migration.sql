-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."GoalType" AS ENUM ('cleaner', 'safer', 'storage', 'work', 'aesthetics');

-- CreateEnum
CREATE TYPE "public"."AnalysisStatus" AS ENUM ('complete', 'failed');

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analyses" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "goal" "public"."GoalType" NOT NULL,
    "status" "public"."AnalysisStatus" NOT NULL DEFAULT 'complete',
    "summary" TEXT NOT NULL,
    "model" TEXT,
    "zones" JSONB NOT NULL,
    "checklist" JSONB NOT NULL,
    "image_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."image_objects" (
    "key" TEXT NOT NULL,
    "session_id" UUID NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_objects_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."follow_up_turns" (
    "id" UUID NOT NULL,
    "analysis_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "safety_note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_up_turns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "public"."sessions"("token_hash");

-- CreateIndex
CREATE INDEX "analyses_session_id_created_at_idx" ON "public"."analyses"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "analyses_image_key_idx" ON "public"."analyses"("image_key");

-- CreateIndex
CREATE INDEX "image_objects_session_id_created_at_idx" ON "public"."image_objects"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "follow_up_turns_analysis_id_created_at_idx" ON "public"."follow_up_turns"("analysis_id", "created_at");

-- AddForeignKey
ALTER TABLE "public"."analyses" ADD CONSTRAINT "analyses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."analyses" ADD CONSTRAINT "analyses_image_key_fkey" FOREIGN KEY ("image_key") REFERENCES "public"."image_objects"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follow_up_turns" ADD CONSTRAINT "follow_up_turns_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "public"."analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

