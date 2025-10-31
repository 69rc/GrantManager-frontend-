import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number"),
  role: text("role").notNull().default("user"), // "user" or "admin"
  suspended: boolean("suspended").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});



// Public registration schema - omits role for security
export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  phoneNumber: z.string().nullable().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// User insert schema without ID and timestamps
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  phoneNumber: z.string().nullable().optional(),
  role: z.string().optional().default("user"),
  suspended: z.boolean().optional().default(false),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
// Define User type with all fields from the users table
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;

// Grant Applications table
export const grantApplications = pgTable("grant_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  projectTitle: text("project_title").notNull(),
  projectDescription: text("project_description").notNull(),
  grantType: text("grant_type").notNull(), // "education", "business", "community", "research"
  requestedAmount: integer("requested_amount").notNull(),
  fileUrl: text("file_url"), // URL of uploaded proposal/budget file
  fileName: text("file_name"),
  status: text("status").notNull().default("pending"), // "pending", "under_review", "approved", "rejected"
  adminNotes: text("admin_notes"),
  disbursementAmount: integer("disbursement_amount"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertGrantApplicationSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  projectTitle: z.string(),
  projectDescription: z.string(),
  grantType: z.string(),
  requestedAmount: z.number(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  disbursementAmount: z.number().optional(),
});

export const updateGrantApplicationStatusSchema = z.object({
  status: z.enum(["pending", "under_review", "approved", "rejected"]),
  adminNotes: z.string().optional(),
  disbursementAmount: z.number().optional(),
});

export type InsertGrantApplication = z.infer<typeof insertGrantApplicationSchema>;
export type GrantApplication = typeof grantApplications.$inferSelect;
export type UpdateGrantApplicationStatus = z.infer<typeof updateGrantApplicationStatusSchema>;

// Chat Messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  senderRole: text("sender_role").notNull(), // "user" or "admin"
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChatMessageSchema = z.object({
  userId: z.string(),
  senderRole: z.string(),
  message: z.string(),
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Grant Types configuration (for display purposes)
export const grantTypes = [
  {
    id: "education",
    name: "Education Grant",
    description: "Support for students, teachers, and educational initiatives",
    amountRange: "$1,000 - $25,000",
    icon: "GraduationCap",
  },
  {
    id: "business",
    name: "Small Business Grant",
    description: "Funding for entrepreneurs and small business development",
    amountRange: "$5,000 - $50,000",
    icon: "Briefcase",
  },
  {
    id: "community",
    name: "Community Development",
    description: "Projects that benefit local communities and social causes",
    amountRange: "$2,000 - $30,000",
    icon: "Users",
  },
  {
    id: "research",
    name: "Research & Innovation",
    description: "Support for research projects and innovative solutions",
    amountRange: "$10,000 - $100,000",
    icon: "Lightbulb",
  },
] as const;

export type GrantType = typeof grantTypes[number];
