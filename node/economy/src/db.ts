import { Item, User } from "./types.ts";
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

db.executeMultiple(`
-- Users
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT NOT NULL UNIQUE, -- Unique Discord user ID
  discord_username TEXT NOT NULL,  -- User's Discord username
  balance INTEGER DEFAULT 100,     -- Initial balance
  last_daily_reward DATETIME       -- Tracks the last time the user claimed daily rewards
);

-- Items
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,       -- Item name
  emoji TEXT NOT NULL,             -- Item emoji
  price INTEGER NOT NULL           -- Item price
);

-- User Inventory
CREATE TABLE IF NOT EXISTS user_items (
  user_id INTEGER NOT NULL,        -- Reference to the user
  item_id INTEGER NOT NULL,        -- Reference to the item
  quantity INTEGER DEFAULT 1,      -- Quantity of the item
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, item_id)
);

-- Seed items
INSERT OR IGNORE INTO items (name, emoji, price) VALUES ('Bread', '🍞', 10);
INSERT OR IGNORE INTO items (name, emoji, price) VALUES ('Apple', '🍎', 15);
INSERT OR IGNORE INTO items (name, emoji, price) VALUES ('Burger', '🍔', 20);
INSERT OR IGNORE INTO items (name, emoji, price) VALUES ('Pizza', '🍕', 30);
INSERT OR IGNORE INTO items (name, emoji, price) VALUES ('Sushi', '🍣', 50);
INSERT OR IGNORE INTO items (name, emoji, price) VALUES ('Ice Cream', '🍨', 100);
`);

export default db;

export async function getUser(id: string) {
  const rs = await db.execute({
    sql: "SELECT * FROM users WHERE discord_id = :id",
    args: { id },
  });

  return rs.rows[0] as unknown as User | undefined;
}

export async function getItems() {
  const rs = await db.execute("SELECT * FROM items");
  return rs.rows as unknown as Item[];
}
