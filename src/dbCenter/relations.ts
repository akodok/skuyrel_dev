import { relations } from "drizzle-orm/relations";
import { accesModules, accesSession, modules, session, users } from "./schema";

export const accesModulesRelations = relations(accesModules, ({ one }) => ({
  module: one(modules, {
    fields: [accesModules.idModule],
    references: [modules.idModule],
  }),
  session: one(session, {
    fields: [accesModules.idSession],
    references: [session.idSession],
  }),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  accesModules: many(accesModules),
}));

export const sessionRelations = relations(session, ({ many }) => ({
  accesModules: many(accesModules),
  accesSessions: many(accesSession),
}));

export const accesSessionRelations = relations(accesSession, ({ one }) => ({
  session: one(session, {
    fields: [accesSession.idSession],
    references: [session.idSession],
  }),
  user: one(users, {
    fields: [accesSession.idUsers],
    references: [users.refUsers],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accesSessions: many(accesSession),
}));
