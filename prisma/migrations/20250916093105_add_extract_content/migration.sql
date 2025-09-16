-- CreateTable
CREATE TABLE "public"."extract_content" (
    "id" BIGSERIAL NOT NULL,
    "file_id" BIGINT NOT NULL,
    "raw_content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "extract_content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."extract_content" ADD CONSTRAINT "extract_content_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE CASCADE ON UPDATE CASCADE;
