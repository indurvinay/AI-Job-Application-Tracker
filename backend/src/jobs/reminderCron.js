const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendEmail } = require('../utils/email');
const { createNotification } = require('../controllers/notificationController'); // <--- NEW

const prisma = new PrismaClient();

// This cron expression "0 8 * * *" means: 
// Run at Minute 0, Hour 8 (8:00 AM), Every day, Every month, Every day of the week.
// (Tip: If you want to test it immediately, change it to "* * * * *" to run every minute!)
const startCronJobs = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log("Running Daily Check: Searching for applications that need follow-up...");

    try {
      // 1. Calculate the exact date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // 2. Ask the database for jobs applied to 7+ days ago, where we HAVEN'T sent a reminder yet
      const applicationsNeedingReminder = await prisma.application.findMany({
        where: {
          status: 'Applied', // Only remind them if they are still in the "Applied" stage
          appliedDate: {
             lte: sevenDaysAgo // "lte" means Less Than or Equal To
          },
          reminders: {
            none: {
              type: 'FOLLOW_UP' // Ensure we don't spam them if we already sent one!
            }
          }
        },
        include: {
          user: true // Include user data so we can get their email address!
        }
      });

      console.log(`Found ${applicationsNeedingReminder.length} jobs to follow up on.`);

      // 3. Send an email for each application found
      for (const app of applicationsNeedingReminder) {
        const subject = `Action Required: Follow up with ${app.company}`;
        const text = `Hi ${app.user.name},\n\nIt has been 7 days since you applied for the ${app.role} position at ${app.company}. It's time to send a polite follow-up email to the recruiter!\n\nGood luck!`;

        // Use our email.js tool from the last step
        const emailSent = await sendEmail(app.user.email, subject, text);

        if (emailSent) {
          // 4. Save a record in the database so we never send this specific reminder again
          await prisma.reminder.create({
            data: {
              applicationId: app.id,
              userId: app.userId,
              type: 'FOLLOW_UP',
              sentAt: new Date()
            }
          });
          
          // Create an in-app notification
          await createNotification(
            app.userId,
            'INFO',
            `Follow-up reminder sent to your email for ${app.company}. Time to reach out!`
          );
          
          console.log(`Reminder successfully sent to ${app.user.email} for ${app.company}`);
        }
      }
    } catch (error) {
      console.error("Error running reminder cron job:", error);
    }
  });
  
  console.log("⏰ Background Cron Jobs have been successfully initialized.");
};

module.exports = { startCronJobs };
