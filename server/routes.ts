import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertExamSchema, insertStudyTaskSchema, insertSubTaskSchema, insertUserSchema, insertScheduleTemplateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes - get current authenticated user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub;
      const user = await storage.getUserByReplitId(replitId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User routes
  app.get("/api/users", async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validated);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.patch("/api/users/:id/preferences", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { defaultSubtaskDuration } = req.body;
      const user = await storage.updateUserPreference(id, defaultSubtaskDuration);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user preferences" });
    }
  });

  app.patch("/api/users/:id/language", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { language } = req.body;
      if (!language || !['nl', 'fr', 'en'].includes(language)) {
        res.status(400).json({ error: "Invalid language. Must be 'nl', 'fr', or 'en'" });
        return;
      }
      const user = await storage.updateUserLanguage(id, language);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user language" });
    }
  });

  app.patch("/api/users/:id/role", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { role } = req.body;
      if (!role || !['student', 'teacher'].includes(role)) {
        res.status(400).json({ error: "Invalid role. Must be 'student' or 'teacher'" });
        return;
      }
      const updatedUser = await storage.updateUserRole(id, role);
      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  // Exams routes (user-scoped)
  app.get("/api/exams", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }
      const exams = await storage.getExamsForUser(userId);
      res.json(exams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exams" });
    }
  });

  app.post("/api/exams", async (req, res) => {
    try {
      const validated = insertExamSchema.parse(req.body);
      const exam = await storage.createExam(validated);
      res.status(201).json(exam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create exam" });
      }
    }
  });

  app.patch("/api/exams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const exam = await storage.updateExam(id, updates);
      if (!exam) {
        res.status(404).json({ error: "Exam not found" });
        return;
      }
      res.json(exam);
    } catch (error) {
      res.status(500).json({ error: "Failed to update exam" });
    }
  });

  app.delete("/api/exams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteExam(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete exam" });
    }
  });

  // StudyTasks routes (user-scoped)
  app.get("/api/tasks", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }
      const tasks = await storage.getStudyTasksForUser(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validated = insertStudyTaskSchema.parse(req.body);
      const task = await storage.createStudyTask(validated);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create task" });
      }
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const task = await storage.updateStudyTask(id, updates);
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.post("/api/tasks/:id/move", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { date, orderIndex } = req.body;
      const task = await storage.moveStudyTask(id, date, orderIndex);
      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to move task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStudyTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  app.post("/api/tasks/:id/duplicate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const duplicatedTask = await storage.duplicateStudyTask(id);
      if (!duplicatedTask) {
        res.status(404).json({ error: "Task not found" });
        return;
      }
      res.status(201).json(duplicatedTask);
    } catch (error) {
      console.error("Duplicate error:", error);
      res.status(500).json({ error: "Failed to duplicate task" });
    }
  });

  // SubTasks routes
  app.get("/api/subtasks", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }
      const subtasks = await storage.getAllSubTasksForUser(userId);
      res.json(subtasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subtasks" });
    }
  });

  app.get("/api/tasks/:taskId/subtasks", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const subtasks = await storage.getSubTasksByTaskId(taskId);
      res.json(subtasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subtasks" });
    }
  });

  app.post("/api/tasks/:taskId/subtasks", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const validated = insertSubTaskSchema.parse({ ...req.body, taskId });
      const subtask = await storage.createSubTask(validated);
      res.status(201).json(subtask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create subtask" });
      }
    }
  });

  app.patch("/api/subtasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const subtask = await storage.updateSubTask(id, updates);
      if (!subtask) {
        res.status(404).json({ error: "Subtask not found" });
        return;
      }
      res.json(subtask);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subtask" });
    }
  });

  app.delete("/api/subtasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subtask" });
    }
  });

  // Template routes
  app.get("/api/templates", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub;
      const user = await storage.getUserByReplitId(replitId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const userTemplates = await storage.getTemplatesByUser(user.id);
      const publicTemplates = await storage.getPublicTemplates();
      const allTemplates = [...userTemplates, ...publicTemplates.filter(t => t.userId !== user.id)];
      res.json(allTemplates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/public", async (_req, res) => {
    try {
      const templates = await storage.getPublicTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch public templates" });
    }
  });

  app.post("/api/templates", isAuthenticated, async (req: any, res) => {
    try {
      const replitId = req.user.claims.sub;
      const user = await storage.getUserByReplitId(replitId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      
      const { name, description, isPublic, examIds } = req.body;
      const validated = insertScheduleTemplateSchema.parse({ name, description, isPublic, userId: user.id });
      const template = await storage.createTemplate(validated);
      
      if (examIds && examIds.length > 0) {
        const userExams = await storage.getExamsForUser(user.id);
        const userTasks = await storage.getStudyTasksForUser(user.id);
        
        const selectedExams = userExams.filter(e => examIds.includes(e.id));
        const latestExamDate = selectedExams.reduce((latest, exam) => {
          const examDate = new Date(exam.date);
          return examDate > latest ? examDate : latest;
        }, new Date(0));
        
        for (const examId of examIds) {
          const exam = userExams.find(e => e.id === examId);
          if (!exam) continue;
          
          const examDate = new Date(exam.date);
          const daysBeforeLatest = Math.floor((latestExamDate.getTime() - examDate.getTime()) / (1000 * 60 * 60 * 24));
          
          const templateExam = await storage.createTemplateExam({
            templateId: template.id,
            subject: exam.subject,
            title: exam.title,
            daysBeforeExam: daysBeforeLatest,
            difficulty: exam.difficulty,
            description: exam.description,
          });
          
          const examTasks = userTasks.filter(t => t.examId === examId);
          for (const task of examTasks) {
            const taskDate = new Date(task.date);
            const daysBeforeLatestExam = Math.floor((latestExamDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
            
            await storage.createTemplateTask({
              templateExamId: templateExam.id,
              title: task.title,
              daysBeforeExam: daysBeforeLatestExam,
              durationMinutes: task.durationMinutes,
              orderIndex: task.orderIndex,
            });
          }
        }
      }
      
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Create template error:", error);
        res.status(500).json({ error: "Failed to create template" });
      }
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);
      if (!template) {
        res.status(404).json({ error: "Template not found" });
        return;
      }
      const templateExams = await storage.getTemplateExams(id);
      const examsWithTasks = await Promise.all(
        templateExams.map(async (exam) => ({
          ...exam,
          tasks: await storage.getTemplateTasks(exam.id),
        }))
      );
      res.json({ ...template, exams: examsWithTasks });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.delete("/api/templates/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplate(id);
      if (!template) {
        res.status(404).json({ error: "Template not found" });
        return;
      }
      const replitId = req.user.claims.sub;
      const user = await storage.getUserByReplitId(replitId);
      if (!user || template.userId !== user.id) {
        res.status(403).json({ error: "Not authorized to delete this template" });
        return;
      }
      await storage.deleteTemplate(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // Copy template to user's schedule
  app.post("/api/templates/:id/copy", isAuthenticated, async (req: any, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const { examDate } = req.body;
      
      const replitId = req.user.claims.sub;
      const user = await storage.getUserByReplitId(replitId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const template = await storage.getTemplate(templateId);
      if (!template) {
        res.status(404).json({ error: "Template not found" });
        return;
      }

      const templateExams = await storage.getTemplateExams(templateId);
      const createdExams = [];
      const createdTasks = [];

      const targetDate = new Date(examDate);
      
      for (const templateExam of templateExams) {
        const actualExamDate = new Date(targetDate);
        actualExamDate.setDate(actualExamDate.getDate() - templateExam.daysBeforeExam);
        
        const newExam = await storage.createExam({
          userId: user.id,
          subject: templateExam.subject,
          title: templateExam.title,
          date: actualExamDate.toISOString().split('T')[0],
          difficulty: templateExam.difficulty,
          description: templateExam.description,
        });
        createdExams.push(newExam);

        const templateTasks = await storage.getTemplateTasks(templateExam.id);
        for (const templateTask of templateTasks) {
          const taskDate = new Date(targetDate);
          taskDate.setDate(taskDate.getDate() - templateTask.daysBeforeExam);
          
          const newTask = await storage.createStudyTask({
            userId: user.id,
            examId: newExam.id,
            title: templateTask.title,
            date: taskDate.toISOString().split('T')[0],
            durationMinutes: templateTask.durationMinutes,
            orderIndex: templateTask.orderIndex,
          });
          createdTasks.push(newTask);
        }
      }

      res.status(201).json({ 
        message: "Template copied successfully", 
        exams: createdExams.length, 
        tasks: createdTasks.length 
      });
    } catch (error) {
      console.error("Copy template error:", error);
      res.status(500).json({ error: "Failed to copy template" });
    }
  });

  // Seed data endpoint for initial setup (now requires userId)
  app.post("/api/seed/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const existingExams = await storage.getExamsForUser(userId);
      if (existingExams.length > 0) {
        res.json({ message: "Data already exists for this user" });
        return;
      }

      const examData = [
        { userId, subject: "latin", title: "Examen Latijn", date: "2025-12-08", difficulty: "hard", description: "Woordenschat & Grammatica: Declinaties 1-3", understanding: 60 },
        { userId, subject: "dutch", title: "Examen Nederlands", date: "2025-12-10", difficulty: "medium", description: "Begrijpend lezen & Spelling", understanding: 0 },
        { userId, subject: "science", title: "Examen Natuurkunde", date: "2025-12-11", difficulty: "easy", description: "Europese Landen & Klimaat", understanding: 75 },
        { userId, subject: "geography", title: "Examen Aardrijkskunde", date: "2025-12-11", difficulty: "easy", description: "Ecosystemen & Cellen", understanding: 70 },
        { userId, subject: "math", title: "Examen Wiskunde", date: "2025-12-09", difficulty: "hard", description: "Algebra & Meetkunde", understanding: 45 },
        { userId, subject: "french", title: "Examen Frans", date: "2025-12-12", difficulty: "medium", description: "Werkwoorden 'avoir' & 'être', basiswoordenschat", understanding: 50 },
      ];

      const createdExams = await Promise.all(examData.map(e => storage.createExam(e)));

      const taskData = [
        { userId, examId: createdExams[0].id, title: "Latijn: Woordenschat herhalen", date: "2025-12-01", completed: false, durationMinutes: 45, orderIndex: 0 },
        { userId, examId: createdExams[4].id, title: "Wiskunde: Algebra oefeningen", date: "2025-12-02", completed: false, durationMinutes: 45, orderIndex: 0 },
        { userId, examId: createdExams[5].id, title: "Frans: Woordenlijst", date: "2025-12-02", completed: false, durationMinutes: 30, orderIndex: 1 },
        { userId, examId: createdExams[0].id, title: "Latijn: Grammatica regels", date: "2025-12-03", completed: false, durationMinutes: 45, orderIndex: 0 },
        { userId, examId: createdExams[1].id, title: "Nederlands: Spellingregels", date: "2025-12-04", completed: false, durationMinutes: 40, orderIndex: 0 },
        { userId, examId: createdExams[4].id, title: "Wiskunde: Meetkunde begrippen", date: "2025-12-05", completed: false, durationMinutes: 45, orderIndex: 0 },
        { userId, examId: createdExams[3].id, title: "Aardrijkskunde: Hfdst 4 lezen", date: "2025-12-05", completed: false, durationMinutes: 40, orderIndex: 1 },
        { userId, examId: createdExams[0].id, title: "Latijn: Oefentoets verhalen", date: "2025-12-06", completed: false, durationMinutes: 45, orderIndex: 0 },
        { userId, examId: createdExams[2].id, title: "Natuurkunde: Toetsen maken", date: "2025-12-06", completed: false, durationMinutes: 45, orderIndex: 1 },
        { userId, examId: createdExams[0].id, title: "Latijn: Alles herhalen", date: "2025-12-07", completed: false, durationMinutes: 60, orderIndex: 0 },
        { userId, examId: createdExams[4].id, title: "Wiskunde: Proefexamen", date: "2025-12-07", completed: false, durationMinutes: 60, orderIndex: 1 },
        { userId, examId: createdExams[4].id, title: "Wiskunde: Formules leren", date: "2025-12-08", completed: false, durationMinutes: 45, orderIndex: 0 },
        { userId, examId: createdExams[1].id, title: "Nederlands: Leesoefening", date: "2025-12-08", completed: false, durationMinutes: 40, orderIndex: 1 },
        { userId, examId: createdExams[1].id, title: "Nederlands: Samenvatting", date: "2025-12-09", completed: false, durationMinutes: 45, orderIndex: 0 },
        { userId, examId: createdExams[2].id, title: "Natuurkunde: Hoofdstukken quiz", date: "2025-12-09", completed: false, durationMinutes: 45, orderIndex: 1 },
        { userId, examId: createdExams[3].id, title: "Aardrijkskunde: Definities", date: "2025-12-10", completed: false, durationMinutes: 40, orderIndex: 0 },
        { userId, examId: createdExams[5].id, title: "Frans: Werkwoorden vervoegen", date: "2025-12-10", completed: false, durationMinutes: 45, orderIndex: 1 },
        { userId, examId: createdExams[5].id, title: "Frans: Mondeling oefenen", date: "2025-12-11", completed: false, durationMinutes: 45, orderIndex: 0 },
      ];

      const createdTasks = await Promise.all(taskData.map(t => storage.createStudyTask(t)));

      res.json({ message: "Seed data created", exams: createdExams.length, tasks: createdTasks.length });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  return httpServer;
}
