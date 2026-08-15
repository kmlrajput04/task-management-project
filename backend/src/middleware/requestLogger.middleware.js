export const requestLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Latency: ${timeInMs}ms`);
  });

  next();
};
