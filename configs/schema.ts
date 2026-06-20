import { integer, json, pgTable, varchar, text } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const HistoryTable = pgTable("historyTable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  recordId: varchar().notNull(),
  content: json(),
  userEmail: varchar("userEmail")
    .references(() => usersTable.email)
    .notNull(),
  createdAt: varchar(),
  aiAgentType: varchar(),
  metaData: varchar(),
});

export const MockInterviewTable = pgTable("mockInterview", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDesc: varchar("jobDesc").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
  userEmail: varchar("userEmail")
    .references(() => usersTable.email)
    .notNull(),
  mockId: varchar("mockId").notNull(),
});

export const UserAnswer = pgTable("userAnswer", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mockId: varchar("mockId").notNull(),
  question: varchar("question").notNull(),
  correctAns: text("correctAns"),
  userAns: text("userAns"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  userEmail: varchar("userEmail")
    .references(() => usersTable.email)
    .notNull(),
  createdAt: varchar("createdAt"),
});
