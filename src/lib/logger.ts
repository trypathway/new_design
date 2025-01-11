type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    console[level](logMessage, data);
    
    this.logs.push(JSON.stringify({ timestamp, level, message, data }));
  }

  getLogs(): string[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();

