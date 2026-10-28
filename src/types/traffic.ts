export type VehicleClass = 'car' | 'truck' | 'bus' | 'motorcycle' | 'pedestrian';

export type InfractionType = 
  | 'RED_LIGHT_VIOLATION' 
  | 'ILLEGAL_LANE_CHANGE' 
  | 'SPEEDING' 
  | 'STOPPED_IN_CONFLICT_ZONE' 
  | 'SUDDEN_DECELERATION_RISK' 
  | 'POTENTIAL_COLLISION';

export interface BoundingBox {
  x: number; // pixel in video coordinate space
  y: number;
  width: number;
  height: number;
}

export interface TrackedVehicle {
  id: number;
  class: VehicleClass;
  confidence: number;
  bbox: BoundingBox;
  centroid: [number, number];
  velocityKmh: number;
  trajectory: Array<[number, number]>; // history of centroids
  infraction?: InfractionType;
  lastSeenFrame: number;
  color: string;
}

export interface SafetyZone {
  id: string;
  name: string;
  type: 'STOP_LINE' | 'SOLID_LINE' | 'CONFLICT_BOX';
  color: string;
  // Normalized coordinates (0.0 to 1.0)
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface IncidentAlert {
  id: string;
  timestamp: string;
  videoTimeSec: number;
  type: InfractionType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  vehicleId: number;
  vehicleClass: VehicleClass;
  speedKmh: number;
  zone: string;
  details: string;
  snapshotUrl?: string;
}

export interface VideoTelemetry {
  videoFileName: string;
  videoDurationSec: number;
  currentTimeSec: number;
  activeTracksCount: number;
  totalUniqueTracked: number;
  flowRatePerMin: number;
  averageSpeedKmh: number;
  totalViolations: number;
  fps: number;
}
