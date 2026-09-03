import cron from 'node-cron';
import prisma from '../config/db.js';

/**
 * Executes a lightweight database and API ping to prevent:
 * 1. Neon PostgreSQL serverless compute from suspending (sleeps after 5 mins)
 * 2. Cloud hosting instances (e.g. Render) from spinning down (sleeps after 15 mins)
 */
export const warmUp = async () => {
  const timestamp = new Date().toISOString();

  // 1. Warm up PostgreSQL Database via Prisma
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbDuration = Date.now() - dbStart;
    console.log(`[Keep-Warm Cron] 🟢 Database ping successful (${dbDuration}ms) at ${timestamp}`);
  } catch (dbError) {
    console.warn(`[Keep-Warm Cron] ⚠️ Database ping warning:`, dbError.message);
  }

  // 2. Self-ping HTTP Server endpoint if a public URL or localhost is specified
  const targetUrl =
    process.env.SERVER_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    (process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 5000}` : null);

  if (targetUrl) {
    try {
      const pingUrl = `${targetUrl.replace(/\/+$/, '')}/api/health`;
      const httpStart = Date.now();
      const response = await fetch(pingUrl, {
        headers: { 'User-Agent': 'KeepAlive-Cron/1.0' },
      });
      const httpDuration = Date.now() - httpStart;
      console.log(`[Keep-Warm Cron] 🚀 Self-ping ${pingUrl} status: ${response.status} (${httpDuration}ms)`);
    } catch (httpError) {
      console.warn(`[Keep-Warm Cron] ⚠️ HTTP self-ping warning:`, httpError.message);
    }
  }
};

/**
 * Initializes the background Keep-Alive Cron job
 */
export const initKeepAliveCron = () => {
  if (process.env.CRON_ENABLED === 'false') {
    console.log('⏸️ Keep-Alive Cron is disabled via CRON_ENABLED=false');
    return null;
  }

  // Default: Runs every 10 minutes ('*/10 * * * *')
  // Stays well within Render's 15-minute inactivity timeout and Neon's idle threshold
  const schedule = process.env.CRON_SCHEDULE || '*/10 * * * *';

  if (!cron.validate(schedule)) {
    console.error(`❌ Invalid cron schedule expression: "${schedule}". Using fallback "*/10 * * * *"`);
  }

  const validSchedule = cron.validate(schedule) ? schedule : '*/10 * * * *';

  const task = cron.schedule(validSchedule, async () => {
    await warmUp();
  });

  console.log(`⏰ Keep-Alive Cron job scheduled with pattern: "${validSchedule}"`);

  // Run initial warm-up shortly after startup (after 5 seconds)
  setTimeout(() => {
    warmUp().catch((err) => console.warn('[Keep-Warm Cron] Initial warm-up warning:', err.message));
  }, 5000);

  return task;
};
