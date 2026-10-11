CREATE TABLE "link_categories" (
	"link_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "link_categories_link_id_category_id_pk" PRIMARY KEY("link_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "personal_note" text;--> statement-breakpoint
ALTER TABLE "link_categories" ADD CONSTRAINT "link_categories_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_categories" ADD CONSTRAINT "link_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;