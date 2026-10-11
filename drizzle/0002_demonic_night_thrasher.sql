ALTER TABLE "links" DROP CONSTRAINT "links_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "links" DROP COLUMN "category_id";