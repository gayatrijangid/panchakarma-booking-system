const cron = require('node-cron');

class SchedulerService {
  constructor() {
    this.tasks = [];
  }

  start() {
    console.log('📅 Scheduler service started');
    
    // Example: Run daily at 9 AM to send appointment reminders
    const dailyTask = cron.schedule('0 9 * * *', () => {
      console.log('Running daily appointment reminder task...');
      // Add reminder logic here if needed
    }, {
      scheduled: false
    });

    this.tasks.push(dailyTask);
    
    // Start all tasks
    this.tasks.forEach(task => task.start());
  }

  stop() {
    console.log('Stopping scheduler service...');
    this.tasks.forEach(task => task.stop());
  }
}

module.exports = new SchedulerService();
