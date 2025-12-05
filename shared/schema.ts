import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, boolean, timestamp, date, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with Replit Auth integration
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: varchar("replit_id").unique(),
  email: varchar("email"),
  name: text("name").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").default("student").notNull(),
  roleConfirmed: boolean("role_confirmed").default(false).notNull(),
  defaultSubtaskDuration: integer("default_subtask_duration").default(60).notNull(),
  language: text("language").default("nl").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  roleConfirmed: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type UpsertUser = {
  replitId: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};

// Schedule templates that teachers can create and share
export const scheduleTemplates = pgTable("schedule_templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScheduleTemplateSchema = createInsertSchema(scheduleTemplates).omit({
  id: true,
  createdAt: true,
});
export type InsertScheduleTemplate = z.infer<typeof insertScheduleTemplateSchema>;
export type ScheduleTemplate = typeof scheduleTemplates.$inferSelect;

// Template exams - exams that belong to a template
export const templateExams = pgTable("template_exams", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull().references(() => scheduleTemplates.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  title: text("title").notNull(),
  daysBeforeExam: integer("days_before_exam").default(7).notNull(),
  difficulty: text("difficulty").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTemplateExamSchema = createInsertSchema(templateExams).omit({
  id: true,
  createdAt: true,
});
export type InsertTemplateExam = z.infer<typeof insertTemplateExamSchema>;
export type TemplateExam = typeof templateExams.$inferSelect;

// Template tasks - tasks that belong to a template exam
export const templateTasks = pgTable("template_tasks", {
  id: serial("id").primaryKey(),
  templateExamId: integer("template_exam_id").notNull().references(() => templateExams.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  daysBeforeExam: integer("days_before_exam").default(1).notNull(),
  durationMinutes: integer("duration_minutes").default(60).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTemplateTaskSchema = createInsertSchema(templateTasks).omit({
  id: true,
  createdAt: true,
});
export type InsertTemplateTask = z.infer<typeof insertTemplateTaskSchema>;
export type TemplateTask = typeof templateTasks.$inferSelect;

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  title: text("title").notNull(),
  date: date("date").notNull(),
  difficulty: text("difficulty").notNull(),
  description: text("description"),
  understanding: integer("understanding").default(0).notNull(),
  results: integer("results").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertExamSchema = createInsertSchema(exams).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;

export const studyTasks = pgTable("study_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  date: date("date").notNull(),
  completed: boolean("completed").default(false).notNull(),
  durationMinutes: integer("duration_minutes").default(60).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudyTaskSchema = createInsertSchema(studyTasks).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertStudyTask = z.infer<typeof insertStudyTaskSchema>;
export type StudyTask = typeof studyTasks.$inferSelect;

export const subTasks = pgTable("sub_tasks", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").notNull().references(() => studyTasks.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
  durationMinutes: integer("duration_minutes").default(60).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubTaskSchema = createInsertSchema(subTasks).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertSubTask = z.infer<typeof insertSubTaskSchema>;
export type SubTask = typeof subTasks.$inferSelect;
