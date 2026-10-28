import { TrackedVehicle, IncidentAlert, VideoTelemetry } from '../types/traffic';

class TelemetryStore {
  private currentTracks: TrackedVehicle[] = [];
  private incidents: IncidentAlert[] = [];
  private totalCount: number = 0;
  private flowRatePerMin: number = 0;
  private averageSpeedKmh: number = 0;
  private lastUpdated: number = Date.now();
  private edgeConnected: boolean = false;
  private fps: number = 30;

  public updateFromEdge(payload: {
    tracks?: TrackedVehicle[];
    totalCount?: number;
    flowRatePerMin?: number;
    averageSpeedKmh?: number;
    fps?: number;
    newIncident?: IncidentAlert;
  }) {
    this.edgeConnected = true;
    this.lastUpdated = Date.now();

    if (payload.tracks) {
      this.currentTracks = payload.tracks;
    }
    if (payload.totalCount !== undefined) {
      this.totalCount = payload.totalCount;
    }
    if (payload.flowRatePerMin !== undefined) {
      this.flowRatePerMin = payload.flowRatePerMin;
    }
    if (payload.averageSpeedKmh !== undefined) {
      this.averageSpeedKmh = payload.averageSpeedKmh;
    }
    if (payload.fps !== undefined) {
      this.fps = payload.fps;
    }
    if (payload.newIncident) {
      this.incidents.unshift(payload.newIncident);
      if (this.incidents.length > 50) {
        this.incidents.pop();
      }
    }
  }

  public addIncident(incident: IncidentAlert) {
    this.incidents.unshift(incident);
    if (this.incidents.length > 50) {
      this.incidents.pop();
    }
  }

  public getTelemetry(): Partial<VideoTelemetry> {
    return {
      activeTracksCount: this.currentTracks.length,
      totalUniqueTracked: this.totalCount,
      flowRatePerMin: this.flowRatePerMin,
      averageSpeedKmh: this.averageSpeedKmh,
      totalViolations: this.incidents.length,
      fps: this.fps,
    };
  }

  public getIncidents(): IncidentAlert[] {
    return this.incidents;
  }

  public clearIncidents() {
    this.incidents = [];
  }
}

export const telemetryStore = new TelemetryStore();
