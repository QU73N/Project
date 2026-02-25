CREATE TABLE "faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"department" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"birthday" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"birthday" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"teacher_id" integer,
	"day" varchar(50) NOT NULL,
	"time" varchar(50) NOT NULL,
	"color" varchar(7) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_teacher_id_faculty_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."faculty"("id") ON DELETE no action ON UPDATE no action;