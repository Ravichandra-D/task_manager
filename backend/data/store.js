// In-memory data store
// In production, replace with a real database (MongoDB, PostgreSQL, etc.)

const users = []; // { id, name, email, passwordHash, createdAt }
const tasks = []; // { id, userId, title, description, stage, createdAt, updatedAt }

module.exports = { users, tasks };
