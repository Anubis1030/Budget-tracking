CREATE TABLE "budget" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"icon" varchar,
	"createdBy" varchar(255) NOT NULL
);
