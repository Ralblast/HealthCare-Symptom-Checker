
class Logger {
  info(message, meta = {}) {
    console.log(JSON.stringify({
      level: 'INFO',
      message,
      ...meta,
      timestamp: new Date().toISOString()
    }));
  }
  
  error(message, error = {}) {
    console.error(JSON.stringify({
      level: 'ERROR',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
  }
  
  warn(message, meta = {}) {
    console.warn(JSON.stringify({
      level: 'WARN',
      message,
      ...meta,
      timestamp: new Date().toISOString()
    }));
  }
}

export default new Logger();
