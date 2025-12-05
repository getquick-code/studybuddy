import type { Exam, StudyTask, SubTask, User } from "@shared/schema";

const API_BASE = "/api";

// User API
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

export async function createUser(name: string): Promise<User> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
}

export async function seedUserData(userId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/seed/${userId}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to seed data");
}

// Exams API (user-scoped)
export async function fetchExams(userId: number): Promise<Exam[]> {
  const response = await fetch(`${API_BASE}/exams?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch exams");
  return response.json();
}

export async function updateExam(id: number, updates: Partial<Exam>): Promise<Exam> {
  const response = await fetch(`${API_BASE}/exams/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update exam");
  return response.json();
}

export async function createExam(exam: Partial<Exam>): Promise<Exam> {
  const response = await fetch(`${API_BASE}/exams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exam),
  });
  if (!response.ok) throw new Error("Failed to create exam");
  return response.json();
}

export async function deleteExam(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/exams/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete exam");
}

// Tasks API (user-scoped)
export async function fetchTasks(userId: number): Promise<StudyTask[]> {
  const response = await fetch(`${API_BASE}/tasks?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

export async function createTask(task: Partial<StudyTask>): Promise<StudyTask> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

export async function updateTask(id: number, updates: Partial<StudyTask>): Promise<StudyTask> {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

export async function moveTask(id: number, date: string, orderIndex: number): Promise<StudyTask> {
  const response = await fetch(`${API_BASE}/tasks/${id}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, orderIndex }),
  });
  if (!response.ok) throw new Error("Failed to move task");
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete task");
}

export async function duplicateTask(id: number): Promise<StudyTask> {
  const response = await fetch(`${API_BASE}/tasks/${id}/duplicate`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to duplicate task");
  return response.json();
}

// Subtasks API
export async function fetchAllSubTasks(userId: number): Promise<SubTask[]> {
  const response = await fetch(`${API_BASE}/subtasks?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch subtasks");
  return response.json();
}

export async function fetchSubTasks(taskId: number): Promise<SubTask[]> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`);
  if (!response.ok) throw new Error("Failed to fetch subtasks");
  return response.json();
}

export async function createSubTask(taskId: number, title: string, orderIndex: number): Promise<SubTask> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, orderIndex, completed: false, durationMinutes: 60 }),
  });
  if (!response.ok) throw new Error("Failed to create subtask");
  return response.json();
}

export async function updateUserPreference(userId: number, defaultSubtaskDuration: number): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${userId}/preferences`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ defaultSubtaskDuration }),
  });
  if (!response.ok) throw new Error("Failed to update user preferences");
  return response.json();
}

export async function updateUserLanguage(userId: number, language: string): Promise<User> {
  const response = await fetch(`${API_BASE}/users/${userId}/language`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language }),
  });
  if (!response.ok) throw new Error("Failed to update user language");
  return response.json();
}

export async function updateSubTask(id: number, updates: Partial<SubTask>): Promise<SubTask> {
  const response = await fetch(`${API_BASE}/subtasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update subtask");
  return response.json();
}

export async function deleteSubTask(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/subtasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete subtask");
}
