import sequelize from '../config/db';
import User from './User';
import Chat from './Chat';

// Define associations if needed
// For now, we keep it simple without foreign key constraints
// since users might be managed externally

export { sequelize, User, Chat };
