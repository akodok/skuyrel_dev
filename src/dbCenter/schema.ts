import { date, datetime, index, int, longtext, mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";

export const accesModules = mysqlTable(
  "acces-modules",
  {
    idModule: varchar({ length: 3 })
      .notNull()
      .references(() => modules.idModule, { onDelete: "restrict", onUpdate: "restrict" }),
    idSession: varchar({ length: 500 })
      .notNull()
      .references(() => session.idSession, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => [index("idModule").on(table.idModule)],
);

export const accesSession = mysqlTable(
  "acces_session",
  {
    idSession: varchar({ length: 500 })
      .notNull()
      .references(() => session.idSession, { onDelete: "cascade", onUpdate: "cascade" }),
    idUsers: int()
      .notNull()
      .references(() => users.refUsers, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (table) => [index("idSession").on(table.idSession)],
);

export const bugs = mysqlTable("bugs", {
  annotationBug: longtext().notNull(),
  dateTimeBug: datetime({ mode: "string" }).default("current_timestamp()").notNull(),
  detailsBug: varchar({ length: 500 }).notNull(),
  idBug: int().autoincrement().notNull(),
  moduleBug: varchar({ length: 500 }).notNull(),
  nomBug: varchar({ length: 500 }).notNull(),
  prenomBug: varchar({ length: 500 }).notNull(),
  sessionBug: varchar({ length: 500 }).notNull(),
  statutBug: int().default(0).notNull(),
});

export const modules = mysqlTable("modules", {
  idModule: varchar({ length: 3 }).notNull(),
  libelleModule: varchar({ length: 500 }).notNull(),
  superAdminModule: tinyint().default(0).notNull(),
});

export const session = mysqlTable("session", {
  dbSession: varchar({ length: 500 }).notNull(),
  idSession: varchar({ length: 500 }).notNull(),
  libelleSession: varchar({ length: 500 }).notNull(),
  logoSession: varchar({ length: 500 }).notNull(),
  typeSession: varchar({ length: 500 }).notNull(),
});

export const users = mysqlTable("users", {
  accreditationUsers: tinyint().default(0).notNull(),
  archiveUsers: int().default(0).notNull(),
  dateFae: date({ mode: "string" }).default("NULL"),
  datePermisAmbulance: date({ mode: "string" }).default("NULL"),
  datePermisUsers: varchar({ length: 500 }),
  datePswUser: date({ mode: "string" }).default("current_timestamp()").notNull(),
  dateVisiteMedicalUsers: varchar({ length: 500 }),
  emailUsers: varchar({ length: 500 }).notNull(),
  nomUsers: varchar({ length: 500 }).notNull(),
  permisB: int().default(0),
  permisBe: int().default(0),
  permisC1E: date({ mode: "string" }).default("NULL"),
  photoProfilUser: longtext().default("NULL"),
  prenomUsers: varchar({ length: 500 }).notNull(),
  pswdUsers: varchar({ length: 500 }).notNull(),
  refUsers: int().autoincrement().notNull(),
});
