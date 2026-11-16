import { sequelize, User, Chat } from '../models';

async function syncDatabase(): Promise<void> {
  try {
    console.log('Syncing database...');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Tables created/updated');

    // Create some test users
    const testUsers = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
      { name: 'Charlie', email: 'charlie@example.com' }
    ];

    for (const userData of testUsers) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData as any
      });
      
      if (created) {
        console.log(`Created user: ${user.name} (${user.id})`);
      } else {
        console.log(`User already exists: ${user.name} (${user.id})`);
      }
    }

    console.log('Database sync complete!');
  } catch (err) {
    console.error('Error syncing database:', err);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
