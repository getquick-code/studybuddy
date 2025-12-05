import { 
  type User, 
  type InsertUser,
  type UpsertUser,
  type Exam,
  type InsertExam,
  type StudyTask,
  type InsertStudyTask,
  type SubTask,
  type InsertSubTask,
  type ScheduleTemplate,
  type InsertScheduleTemplate,
  type TemplateExam,
  type InsertTemplateExam,
  type TemplateTask,
  type InsertTemplateTask,
  users,
  exams,
  studyTasks,
  subTasks,
  scheduleTemplates,
  templateExams,
  templateTasks
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods for Replit Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  upsertUser(userData: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserByName(name: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreference(id: number, defaultSubtaskDuration: number): Promise<User | undefined>;
  updateUserLanguage(id: number, language: string): Promise<User | undefined>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  
  // Exam methods (user-scoped)
  getExamsForUser(userId: number): Promise<Exam[]>;
  getExam(id: number): Promise<Exam | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;
  updateExam(id: number, updates: Partial<InsertExam>): Promise<Exam | undefined>;
  deleteExam(id: number): Promise<void>;
  
  // StudyTask methods (user-scoped)
  getStudyTasksForUser(userId: number): Promise<StudyTask[]>;
  getStudyTask(id: number): Promise<StudyTask | undefined>;
  createStudyTask(task: InsertStudyTask): Promise<StudyTask>;
  updateStudyTask(id: number, updates: Partial<InsertStudyTask>): Promise<StudyTask | undefined>;
  moveStudyTask(id: number, newDate: string, newOrderIndex: number): Promise<StudyTask | undefined>;
  deleteStudyTask(id: number): Promise<void>;
  duplicateStudyTask(id: number): Promise<StudyTask | undefined>;
  
  // SubTask methods
  getSubTasksByTaskId(taskId: number): Promise<SubTask[]>;
  getAllSubTasksForUser(userId: number): Promise<SubTask[]>;
  createSubTask(subTask: InsertSubTask): Promise<SubTask>;
  updateSubTask(id: number, updates: Partial<InsertSubTask>): Promise<SubTask | undefined>;
  deleteSubTask(id: number): Promise<void>;
  
  // Template methods
  getTemplatesByUser(userId: number): Promise<ScheduleTemplate[]>;
  getPublicTemplates(): Promise<ScheduleTemplate[]>;
  getTemplate(id: number): Promise<ScheduleTemplate | undefined>;
  createTemplate(template: InsertScheduleTemplate): Promise<ScheduleTemplate>;
  deleteTemplate(id: number): Promise<void>;
  
  // Template exam methods
  getTemplateExams(templateId: number): Promise<TemplateExam[]>;
  createTemplateExam(exam: InsertTemplateExam): Promise<TemplateExam>;
  
  // Template task methods
  getTemplateTasks(templateExamId: number): Promise<TemplateTask[]>;
  createTemplateTask(task: InsertTemplateTask): Promise<TemplateTask>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.name);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.replitId, replitId));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const displayName = [userData.firstName, userData.lastName].filter(Boolean).join(' ') || userData.email || 'User';
    
    const [user] = await db
      .insert(users)
      .values({
        replitId: userData.replitId,
        email: userData.email,
        name: displayName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
      })
      .onConflictDoUpdate({
        target: users.replitId,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByName(name: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.name, name));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPreference(id: number, defaultSubtaskDuration: number): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ defaultSubtaskDuration })
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }

  async updateUserLanguage(id: number, language: string): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ language })
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({ role, roleConfirmed: true })
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }

  // Exam methods
  async getExamsForUser(userId: number): Promise<Exam[]> {
    return await db.select().from(exams).where(eq(exams.userId, userId)).orderBy(exams.date);
  }

  async getExam(id: number): Promise<Exam | undefined> {
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    return exam || undefined;
  }

  async createExam(exam: InsertExam): Promise<Exam> {
    const [newExam] = await db.insert(exams).values(exam).returning();
    return newExam;
  }

  async updateExam(id: number, updates: Partial<InsertExam>): Promise<Exam | undefined> {
    const [updated] = await db
      .update(exams)
      .set(updates)
      .where(eq(exams.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteExam(id: number): Promise<void> {
    await db.delete(exams).where(eq(exams.id, id));
  }

  // StudyTask methods
  async getStudyTasksForUser(userId: number): Promise<StudyTask[]> {
    return await db.select().from(studyTasks).where(eq(studyTasks.userId, userId)).orderBy(studyTasks.date, studyTasks.orderIndex);
  }

  async getStudyTask(id: number): Promise<StudyTask | undefined> {
    const [task] = await db.select().from(studyTasks).where(eq(studyTasks.id, id));
    return task || undefined;
  }

  async createStudyTask(task: InsertStudyTask): Promise<StudyTask> {
    const [newTask] = await db.insert(studyTasks).values(task).returning();
    return newTask;
  }

  async updateStudyTask(id: number, updates: Partial<InsertStudyTask>): Promise<StudyTask | undefined> {
    const [updated] = await db
      .update(studyTasks)
      .set(updates)
      .where(eq(studyTasks.id, id))
      .returning();
    return updated || undefined;
  }

  async moveStudyTask(id: number, newDate: string, newOrderIndex: number): Promise<StudyTask | undefined> {
    const [updated] = await db
      .update(studyTasks)
      .set({ date: newDate, orderIndex: newOrderIndex })
      .where(eq(studyTasks.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteStudyTask(id: number): Promise<void> {
    await db.delete(studyTasks).where(eq(studyTasks.id, id));
  }

  async duplicateStudyTask(id: number): Promise<StudyTask | undefined> {
    const original = await this.getStudyTask(id);
    if (!original) return undefined;
    
    const { id: _, createdAt, ...taskData } = original;
    const newTask = await this.createStudyTask({
      ...taskData,
      title: `${taskData.title} (kopie)`,
    });
    
    const originalSubtasks = await this.getSubTasksByTaskId(id);
    for (const subtask of originalSubtasks) {
      await this.createSubTask({
        taskId: newTask.id,
        title: subtask.title,
        completed: false,
        durationMinutes: subtask.durationMinutes,
        orderIndex: subtask.orderIndex,
      });
    }
    
    return newTask;
  }

  // SubTask methods
  async getSubTasksByTaskId(taskId: number): Promise<SubTask[]> {
    return await db
      .select()
      .from(subTasks)
      .where(eq(subTasks.taskId, taskId))
      .orderBy(subTasks.orderIndex);
  }

  async getAllSubTasksForUser(userId: number): Promise<SubTask[]> {
    const userTasks = await this.getStudyTasksForUser(userId);
    const taskIds = userTasks.map(t => t.id);
    if (taskIds.length === 0) return [];
    
    const allSubtasks: SubTask[] = [];
    for (const taskId of taskIds) {
      const taskSubtasks = await this.getSubTasksByTaskId(taskId);
      allSubtasks.push(...taskSubtasks);
    }
    return allSubtasks;
  }

  async createSubTask(subTask: InsertSubTask): Promise<SubTask> {
    const [newSubTask] = await db.insert(subTasks).values(subTask).returning();
    return newSubTask;
  }

  async updateSubTask(id: number, updates: Partial<InsertSubTask>): Promise<SubTask | undefined> {
    const [updated] = await db
      .update(subTasks)
      .set(updates)
      .where(eq(subTasks.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSubTask(id: number): Promise<void> {
    await db.delete(subTasks).where(eq(subTasks.id, id));
  }

  // Template methods
  async getTemplatesByUser(userId: number): Promise<ScheduleTemplate[]> {
    return await db.select().from(scheduleTemplates).where(eq(scheduleTemplates.userId, userId));
  }

  async getPublicTemplates(): Promise<ScheduleTemplate[]> {
    return await db.select().from(scheduleTemplates).where(eq(scheduleTemplates.isPublic, true));
  }

  async getTemplate(id: number): Promise<ScheduleTemplate | undefined> {
    const [template] = await db.select().from(scheduleTemplates).where(eq(scheduleTemplates.id, id));
    return template || undefined;
  }

  async createTemplate(template: InsertScheduleTemplate): Promise<ScheduleTemplate> {
    const [newTemplate] = await db.insert(scheduleTemplates).values(template).returning();
    return newTemplate;
  }

  async deleteTemplate(id: number): Promise<void> {
    await db.delete(scheduleTemplates).where(eq(scheduleTemplates.id, id));
  }

  // Template exam methods
  async getTemplateExams(templateId: number): Promise<TemplateExam[]> {
    return await db.select().from(templateExams).where(eq(templateExams.templateId, templateId));
  }

  async createTemplateExam(exam: InsertTemplateExam): Promise<TemplateExam> {
    const [newExam] = await db.insert(templateExams).values(exam).returning();
    return newExam;
  }

  // Template task methods
  async getTemplateTasks(templateExamId: number): Promise<TemplateTask[]> {
    return await db.select().from(templateTasks).where(eq(templateTasks.templateExamId, templateExamId)).orderBy(templateTasks.orderIndex);
  }

  async createTemplateTask(task: InsertTemplateTask): Promise<TemplateTask> {
    const [newTask] = await db.insert(templateTasks).values(task).returning();
    return newTask;
  }
}

export const storage = new DatabaseStorage();
