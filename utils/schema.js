import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const Budget = pgTable('budget', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    amount: integer('amount').notNull(),
    icon: varchar('icon'),
    createdBy: varchar('createdBy', { length: 255 }).notNull(),
});

export const Expense = pgTable('expense', { 
    id: serial('id').primaryKey(),
    amount: integer('amount').notNull(),
    description: varchar('description', { length: 255 }).notNull(), 
    budgetId: integer('budgetId').references(() => Budget.id),
    createdAt: timestamp('createdAt').defaultNow(),
    createdBy: varchar('createdBy', { length: 255 }),
}); 