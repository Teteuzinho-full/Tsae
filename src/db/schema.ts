import { jsonb, pgTable, pgEnum, uuid, text, integer, boolean, timestamp, numeric, index, uniqueIndex } from "drizzle-orm/pg-core";

const id = () => uuid("id").primaryKey().defaultRandom();
const stamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
};

export const courseStatus = pgEnum("course_status", ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"]);
export const businessUnit = pgEnum("business_unit", ["CONSULTORIA", "EDUCA"]);
export const enrollmentStatus = pgEnum("enrollment_status", ["REQUESTED", "CONFIRMED", "CANCELLED"]);
export const keywordIntent = pgEnum("keyword_intent", ["COMERCIAL", "INFORMACIONAL", "NAVEGACIONAL"]);

// Tabelas de usuário/sessão/conta/MFA serão geradas pelo Better Auth (CLI) e ligadas por user_id.
export const mediaAssets = pgTable("media_assets", {
  id: id(), url: text("url").notNull(), blobPath: text("blob_path").notNull(), mime: text("mime").notNull(),
  sizeBytes: integer("size_bytes").notNull(), alt: text("alt").notNull(), isPrivate: boolean("is_private").notNull().default(false),
  ...stamps,
}, (t) => [uniqueIndex("media_blob_path_uq").on(t.blobPath)]);

export const courseCategories = pgTable("course_categories", {
  id: id(), slug: text("slug").notNull().unique(), name: text("name").notNull(), ...stamps,
});

export const courses = pgTable("courses", {
  id: id(), slug: text("slug").notNull().unique(), title: text("title").notNull(), subtitle: text("subtitle"),
  description: text("description").notNull(), categoryId: uuid("category_id").references(() => courseCategories.id, { onDelete: "restrict" }),
  coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
  objectives: text("objectives"), audience: text("audience"), prerequisites: text("prerequisites"), referencesText: text("references_text"),
  startsAt: timestamp("starts_at", { withTimezone: true }), format: text("format"), instructors: text("instructors"), soldOut: boolean("sold_out").notNull().default(false),
  workloadHours: integer("workload_hours"), seats: integer("seats"),
  priceBrl: numeric("price_brl", { precision: 10, scale: 2 }), // sugestão comercial, editável pelo admin
  status: courseStatus("status").notNull().default("DRAFT"), ...stamps,
}, (t) => [index("courses_status_idx").on(t.status)]);

export const courseModules = pgTable("course_modules", {
  id: id(), courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(), position: integer("position").notNull(), ...stamps,
}, (t) => [index("modules_course_idx").on(t.courseId)]);

export const courseLessons = pgTable("course_lessons", {
  id: id(), moduleId: uuid("module_id").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
  title: text("title").notNull(), content: text("content").notNull(), position: integer("position").notNull(), ...stamps,
}, (t) => [index("lessons_module_idx").on(t.moduleId)]);

export const courseEnrollments = pgTable("course_enrollments", {
  id: id(), userId: text("user_id").notNull(), courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "restrict" }),
  status: enrollmentStatus("status").notNull().default("REQUESTED"), ...stamps,
}, (t) => [uniqueIndex("enroll_user_course_uq").on(t.userId, t.courseId)]);

export const lessonProgress = pgTable("lesson_progress", {
  id: id(), userId: text("user_id").notNull(), lessonId: uuid("lesson_id").notNull().references(() => courseLessons.id, { onDelete: "cascade" }),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("progress_user_lesson_uq").on(t.userId, t.lessonId)]);

export const quizzes = pgTable("quizzes", {
  id: id(), courseId: uuid("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }), title: text("title").notNull(), ...stamps,
}, (t) => [uniqueIndex("quiz_course_uq").on(t.courseId)]);

export const quizQuestions = pgTable("quiz_questions", {
  id: id(), quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }), prompt: text("prompt").notNull(),
  options: jsonb("options").$type<string[]>().notNull(), correctIndex: integer("correct_index").notNull(), position: integer("position").notNull(),
}, (t) => [index("questions_quiz_idx").on(t.quizId)]);

export const quizAttempts = pgTable("quiz_attempts", {
  id: id(), quizId: uuid("quiz_id").notNull().references(() => quizzes.id, { onDelete: "cascade" }), userId: text("user_id").notNull(),
  score: integer("score").notNull(), total: integer("total").notNull(), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("attempts_user_quiz_idx").on(t.userId, t.quizId)]);

export const accountFlags = pgTable("account_flags", {
  userId: text("user_id").primaryKey(), mustChangePassword: boolean("must_change_password").notNull().default(false), ...stamps,
});

export const blogCategories = pgTable("blog_categories", { id: id(), slug: text("slug").notNull().unique(), name: text("name").notNull(), ...stamps });
export const blogStatus = pgEnum("blog_status", ["DRAFT", "PUBLISHED"]);
export const blogPosts = pgTable("blog_posts", {
  id: id(), slug: text("slug").notNull().unique(), title: text("title").notNull(), excerpt: text("excerpt").notNull(), content: text("content").notNull(),
  categoryId: uuid("category_id").references(() => blogCategories.id, { onDelete: "set null" }),
  status: blogStatus("status").notNull().default("DRAFT"), coverAssetId: uuid("cover_asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
  publishedAt: timestamp("published_at", { withTimezone: true }), ...stamps,
}, (t) => [index("blog_status_idx").on(t.status)]);

export const carouselSlides = pgTable("carousel_slides", {
  id: id(), unit: businessUnit("unit").notNull(), title: text("title").notNull(), description: text("description"),
  href: text("href"), assetId: uuid("asset_id").references(() => mediaAssets.id, { onDelete: "set null" }),
  position: integer("position").notNull().default(0), active: boolean("active").notNull().default(true), ...stamps,
});

export const seoKeywords = pgTable("seo_keywords", {
  id: id(), keyword: text("keyword").notNull(), unit: businessUnit("unit").notNull(), category: text("category").notNull(),
  intent: keywordIntent("intent").notNull(), landingPath: text("landing_path"), priority: integer("priority").notNull().default(3),
  implemented: boolean("implemented").notNull().default(false), demandValidated: boolean("demand_validated").notNull().default(false), ...stamps,
}, (t) => [uniqueIndex("seo_kw_unit_uq").on(t.unit, t.keyword)]);

export const contactMessages = pgTable("contact_messages", {
  id: id(), name: text("name").notNull(), email: text("email").notNull(), message: text("message").notNull(), ...stamps,
});

export const auditLogs = pgTable("audit_logs", {
  id: id(), actorId: text("actor_id").notNull(), action: text("action").notNull(), entity: text("entity").notNull(),
  entityId: text("entity_id"), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", { key: text("key").primaryKey(), value: text("value").notNull(), ...stamps });
export * from "./auth-schema";
