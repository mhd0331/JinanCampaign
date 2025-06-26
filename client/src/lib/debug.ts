// Debugging and monitoring utilities

export interface DebugConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  persistLogs: boolean;
}

class DebugLogger {
  private config: DebugConfig;
  private logs: Array<{ timestamp: Date; level: string; message: string; data?: any }> = [];

  constructor() {
    this.config = {
      enabled: !import.meta.env.PROD,
      logLevel: import.meta.env.DEV ? 'debug' : 'error',
      persistLogs: true
    };
  }

  private shouldLog(level: string): boolean {
    if (!this.config.enabled) return false;
    
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  private log(level: string, message: string, data?: any) {
    if (!this.shouldLog(level)) return;
    
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      data
    };
    
    if (this.config.persistLogs) {
      this.logs.push(logEntry);
      // Keep only last 100 logs
      if (this.logs.length > 100) {
        this.logs = this.logs.slice(-100);
      }
    }
    
    const prefix = `[${level.toUpperCase()}] ${logEntry.timestamp.toISOString()}`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, data);
        break;
      case 'info':
        console.info(prefix, message, data);
        break;
      case 'warn':
        console.warn(prefix, message, data);
        break;
      case 'error':
        console.error(prefix, message, data);
        break;
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
    const logsText = this.logs
      .map(log => `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()}: ${log.message} ${log.data ? JSON.stringify(log.data) : ''}`)
      .join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const logger = new DebugLogger();

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTiming(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.addMetric(label, duration);
      logger.debug(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    };
  }

  addMetric(label: string, value: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const values = this.metrics.get(label)!;
    values.push(value);
    
    // Keep only last 50 measurements
    if (values.length > 50) {
      values.splice(0, values.length - 50);
    }
  }

  getMetrics(label: string) {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) return null;
    
    const sorted = [...values].sort((a, b) => a - b);
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)]
    };
  }

  getAllMetrics() {
    const result: Record<string, any> = {};
    Array.from(this.metrics.keys()).forEach(label => {
      result[label] = this.getMetrics(label);
    });
    return result;
  }
}

export const perfMonitor = new PerformanceMonitor();

// Error boundary utility
export function handleError(error: Error, context?: string) {
  logger.error(`Error in ${context || 'unknown context'}`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  // Send to analytics if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false
    });
  }
}

// Network monitoring
export function monitorNetworkRequests() {
  if (typeof window === 'undefined') return;
  
  const originalFetch = window.fetch;
  
  window.fetch = async function(input, init?) {
    const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : (input as URL).href);
    const method = init?.method || 'GET';
    
    const stopTiming = perfMonitor.startTiming(`network:${method}:${url}`);
    
    try {
      logger.debug(`Network request: ${method} ${url}`);
      const response = await originalFetch(input, init);
      
      stopTiming();
      
      if (!response.ok) {
        logger.warn(`Network error: ${response.status} ${response.statusText} for ${url}`);
      }
      
      return response;
    } catch (error) {
      stopTiming();
      logger.error(`Network failure for ${url}`, error);
      throw error;
    }
  };
}

// Initialize monitoring in development
if (import.meta.env.DEV) {
  monitorNetworkRequests();
  
  // Global error handler
  window.addEventListener('error', (event) => {
    handleError(event.error, 'Global error handler');
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    handleError(new Error(event.reason), 'Unhandled promise rejection');
  });
}