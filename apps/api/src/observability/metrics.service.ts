import { Injectable } from '@nestjs/common';

export interface MetricsSnapshot {
  analysis: {
    successTotal: number;
    errorTotal: number;
  };
  vision: {
    requestsTotal: number;
    errorsTotal: number;
    avgLatencyMs: number;
  };
}

/**
 * In-memory observability counters. Reset on process restart, which is
 * acceptable for the MVP (no external metrics backend).
 */
@Injectable()
export class MetricsService {
  private analysisSuccessTotal = 0;
  private analysisErrorTotal = 0;
  private visionRequestsTotal = 0;
  private visionErrorsTotal = 0;
  private visionLatencyMsTotal = 0;

  recordAnalysis(success: boolean): void {
    if (success) {
      this.analysisSuccessTotal += 1;
    } else {
      this.analysisErrorTotal += 1;
    }
  }

  recordVision(latencyMs: number, success: boolean): void {
    this.visionRequestsTotal += 1;
    this.visionLatencyMsTotal += Math.max(0, latencyMs);
    if (!success) {
      this.visionErrorsTotal += 1;
    }
  }

  snapshot(): MetricsSnapshot {
    const avgLatencyMs =
      this.visionRequestsTotal > 0
        ? Math.round(this.visionLatencyMsTotal / this.visionRequestsTotal)
        : 0;

    return {
      analysis: {
        successTotal: this.analysisSuccessTotal,
        errorTotal: this.analysisErrorTotal,
      },
      vision: {
        requestsTotal: this.visionRequestsTotal,
        errorsTotal: this.visionErrorsTotal,
        avgLatencyMs,
      },
    };
  }
}
