import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Topics table
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Topic = typeof topics.$inferSelect;
export const insertTopicSchema = createInsertSchema(topics);
export type InsertTopic = z.infer<typeof insertTopicSchema>;

// Parliaments table
export const parliaments = pgTable("parliaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  isFederal: boolean("is_federal").notNull(),
  region: text("region"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Parliament = typeof parliaments.$inferSelect;
export const insertParliamentSchema = createInsertSchema(parliaments);
export type InsertParliament = z.infer<typeof insertParliamentSchema>;

// Parties table
export const parties = pgTable("parties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  color: text("color").notNull(),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Party = typeof parties.$inferSelect;
export const insertPartySchema = createInsertSchema(parties);
export type InsertParty = z.infer<typeof insertPartySchema>;

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  topicId: integer("topic_id").references(() => topics.id).notNull(),
  parliamentId: integer("parliament_id").references(() => parliaments.id).notNull(),
  isFederal: boolean("is_federal").notNull(),
  date: date("date").notNull(),
  year: integer("year").notNull(),
  agreeText: text("agree_text").notNull(),
  disagreeText: text("disagree_text").notNull(),
  detailedInfo: text("detailed_info").notNull(),
  sourceUrl: text("source_url").notNull(),
  sourceDescription: text("source_description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Question = typeof questions.$inferSelect;
export const insertQuestionSchema = createInsertSchema(questions);
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

// Votes table
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  partyId: integer("party_id").references(() => parties.id).notNull(),
  position: text("position").notNull(), // "agree", "disagree", "neutral"
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Vote = typeof votes.$inferSelect;
export const insertVoteSchema = createInsertSchema(votes);
export type InsertVote = z.infer<typeof insertVoteSchema>;

// Relations
export const topicsRelations = relations(topics, ({ many }) => ({
  questions: many(questions),
}));

export const parliamentsRelations = relations(parliaments, ({ many }) => ({
  questions: many(questions),
}));

export const partiesRelations = relations(parties, ({ many }) => ({
  votes: many(votes),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  topic: one(topics, { fields: [questions.topicId], references: [topics.id] }),
  parliament: one(parliaments, { fields: [questions.parliamentId], references: [parliaments.id] }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  question: one(questions, { fields: [votes.questionId], references: [questions.id] }),
  party: one(parties, { fields: [votes.partyId], references: [parties.id] }),
}));

// Keep the users table as required by the schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Gästebuch-Schema
export const guestbook = pgTable("guestbook", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  message: text("message").notNull(),
  isSpam: boolean("is_spam").default(false).notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GuestbookEntry = typeof guestbook.$inferSelect;
export const insertGuestbookSchema = createInsertSchema(guestbook);

// Erweitertes Schema mit Validierungen für das Frontend
export const guestbookValidationSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein"),
  email: z.string().email("Bitte gültige E-Mail-Adresse angeben").optional().or(z.literal('')),
  message: z.string().min(5, "Nachricht muss mindestens 5 Zeichen lang sein").max(1000, "Nachricht darf maximal 1000 Zeichen lang sein"),
});

export type InsertGuestbookEntry = z.infer<typeof insertGuestbookSchema>;
