import { pgTable, serial, text, timestamp, integer, varchar, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Faculty table
export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  birthday: timestamp("birthday").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  birthday: timestamp("birthday").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Subjects table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  teacherId: integer("teacher_id").references(() => faculty.id),
  day: varchar("day", { length: 50 }).notNull(),
  time: varchar("time", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Relations
export const facultyRelations = relations(faculty, ({ many }) => ({
  subjects: many(subjects),
}))

export const studentsRelations = relations(students, ({ many }) => ({
  // Add student-subject relations if needed
}))

export const subjectsRelations = relations(subjects, ({ one }) => ({
  teacher: one(faculty, {
    fields: [subjects.teacherId],
    references: [faculty.id],
  }),
}))

// Mock data
export const mockFaculty = [
  {
    id: 1,
    firstName: "EDGAR P.",
    lastName: "HABANA Jr",
    department: "Physical Education",
    password: "HABANA123",
    birthday: new Date("1980-05-15"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    firstName: "John Michael",
    lastName: "Calizon",
    department: "Computer Science",
    password: "CALIZON123",
    birthday: new Date("1985-08-22"),
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: 3,
    firstName: "Psalmmirac Le Pineda",
    lastName: "MARIANO",
    department: "Computer Science",
    password: "MARIANO123",
    birthday: new Date("1987-03-10"),
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: 4,
    firstName: "BEA ANGLY",
    lastName: "MAGNO",
    department: "Research",
    password: "MAGNO123",
    birthday: new Date("1986-11-28"),
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: 5,
    firstName: "RENEIL P.",
    lastName: "ARNADO",
    department: "Business",
    password: "ARNADO123",
    birthday: new Date("1984-07-12"),
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: 6,
    firstName: "EGNACIO Y",
    lastName: "ELLO Jr",
    department: "Work Immersion",
    password: "ELLO123",
    birthday: new Date("1983-09-05"),
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
]

export const mockStudents = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Dela Cruz",
    password: "DELA CRUZ123",
    birthday: new Date("2005-02-14"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Santos",
    password: "SANTOS123",
    birthday: new Date("2005-06-20"),
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
]

export const mockSubjects = [
  {
    id: 1,
    name: "Physical Education and Health 4",
    teacherId: 1,
    day: "Monday",
    time: "7:00 AM - 9:00 AM",
    color: "#10b981",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Computer/Web Programming 6 - Computer Programming NC III (.NET Technology)",
    teacherId: 2,
    day: "Monday",
    time: "10:00 AM - 1:00 PM",
    color: "#3b82f6",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 3,
    name: "Mobile App Programming 2",
    teacherId: 3,
    day: "Monday",
    time: "1:00 PM - 4:00 PM",
    color: "#8b5cf6",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 4,
    name: "Contemporary Arts from the regions",
    teacherId: 1,
    day: "Tuesday",
    time: "10:00 AM - 1:00 PM",
    color: "#ec4899",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 5,
    name: "Homeroom",
    teacherId: 1,
    day: "Tuesday",
    time: "2:00 PM - 4:00 PM",
    color: "#f59e0b",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 6,
    name: "Work Immersion-Practicum Type",
    teacherId: 6,
    day: "Tuesday",
    time: "2:00 PM - 4:00 PM",
    color: "#ef4444",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 7,
    name: "Inquiries Investigation and Immersion",
    teacherId: 4,
    day: "Tuesday & Thursday",
    time: "8:30 AM - 10:00 AM",
    color: "#06b6d4",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 8,
    name: "Empowerment Technologies: ICT",
    teacherId: 2,
    day: "Thursday",
    time: "10:00 AM - 1:00 PM",
    color: "#3b82f6",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 9,
    name: "Entrepreneurship",
    teacherId: 5,
    day: "Thursday",
    time: "2:30 PM - 5:20 PM",
    color: "#84cc16",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
]