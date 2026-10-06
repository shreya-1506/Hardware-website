PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT    NOT NULL DEFAULT '',
  image       TEXT    NOT NULL DEFAULT '',
  icon        TEXT    NOT NULL DEFAULT '',
  active      INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS brands (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  description TEXT    NOT NULL DEFAULT '',
  logo        TEXT    NOT NULL DEFAULT '',
  active      INTEGER NOT NULL DEFAULT 1,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT    NOT NULL,
  slug              TEXT    NOT NULL UNIQUE,
  sku               TEXT    NOT NULL DEFAULT '',
  category_id       INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  brand_id          INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  short_description TEXT    NOT NULL DEFAULT '',
  description       TEXT    NOT NULL DEFAULT '',
  image             TEXT    NOT NULL DEFAULT '',
  gallery           TEXT    NOT NULL DEFAULT '[]',
  specifications    TEXT    NOT NULL DEFAULT '[]',
  applications      TEXT    NOT NULL DEFAULT '[]',
  variants          TEXT    NOT NULL DEFAULT '[]',
  featured          INTEGER NOT NULL DEFAULT 0,
  published         INTEGER NOT NULL DEFAULT 1,
  meta_title        TEXT    NOT NULL DEFAULT '',
  meta_description  TEXT    NOT NULL DEFAULT '',
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

CREATE TABLE IF NOT EXISTS enquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  company    TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL,
  email      TEXT NOT NULL DEFAULT '',
  product    TEXT NOT NULL DEFAULT '',
  quantity   TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  source     TEXT NOT NULL DEFAULT 'Website',
  status     TEXT NOT NULL DEFAULT 'New',
  notes      TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);

CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL DEFAULT 'Administrator',
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
