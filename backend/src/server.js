import app from './app.js';
import config from './config/env.js';
import prisma from './config/prisma.js';

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Task Dashboard API Server running`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`========================================`);
});

const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('Express server closed.');
    try {
      await prisma.$disconnect();
      console.log('Prisma disconnected successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Error during Prisma disconnect:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10s
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

// Handle process signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  gracefulShutdown('unhandledRejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

export default server;
