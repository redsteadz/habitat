CREATE TABLE "completions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "completions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"habitId" integer NOT NULL,
	"date" date NOT NULL,
	"completed" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habits" ALTER COLUMN "streak" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "completions" ADD CONSTRAINT "completions_habitId_habits_id_fk" FOREIGN KEY ("habitId") REFERENCES "public"."habits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habits" ADD CONSTRAINT "habits_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habits" DROP COLUMN "completions";