// Complete turbine data interface with all electrical, mechanical, and monitoring fields
export interface TurbineData {
  position?: any;
  id: number;
  turbineNo: string;
  status: 'running' | 'stopped' | 'maintenance' | 'fault' | 'standby';
  time: string;
  capacity: number; // kW - turbine capacity/rating

  // Core Performance
  activePower: number; // kW
  windSpeed: number; // m/s
  breakProgramme: string; // Released / Applied / Emergency
  operatingMode: string;
  todayGeneration: number; // kWh
  totalProduction: number; // MWh
  totalOperatingHours: number; // h
  totalProductionHours: number; // h
  operationHoursToday: number; // h

  // Electrical — MFR300
  currentL1: number; // A
  currentL2: number; // A
  currentL3: number; // A
  powerFrequency: number; // Hz
  voltageL1: number; // V
  voltageL2: number; // V
  voltageL3: number; // V
  apparentPower: number; // kVA
  reactivePower: number; // kVAR
  powerFactor: number; // –

  // Drive Train & Rotor
  rotorRpm: number; // rpm
  gearSpeed: number; // rpm
  generatorRpm: number; // rpm
  nacellePosition: number; // °
  cableWinding: number; // °
  windDirection: number; // °
  relativeWindDirection: number; // °
  pitchAngle: number; // ° (blade angle)
  pitchCylinder1: number; // mm
  pitchCylinder2: number; // mm
  pitchCylinder3: number; // mm

  // Structural Monitoring
  towerOscillationX: number; // mm/s
  towerOscillationY: number; // mm/s

  // Temperature Monitoring
  outdoorTemp: number; // °C
  trfWindingTempU: number; // °C
  trfWindingTempV: number; // °C
  trfWindingTempW: number; // °C
  nacelleTemp: number; // °C
  coolCnvHeatExIn: number; // °C
  coolCnvHeatExOut: number; // °C
  coolTrfHeatExIn: number; // °C
  gearOilSumpTemp: number; // °C
  generatorWindingTempU: number; // °C
  generatorWindingTempV: number; // °C
  generatorWindingTempW: number; // °C
  gearboxTemp: number; // °C
  generatorTemp: number; // °C
  transformerTemp: number; // °C
  hubExhaustTemp: number; // °C

  // Pressure & Hydraulics
  hydraulicPressure: number; // bar
  gearOilPressure: number; // bar
  coolantInletPressure: number; // bar
  coolantOutletPressure: number; // bar

  // Control Cabinet Temperatures
  tempSwCabTower: number; // °C
  tempSwCabNacelle: number; // °C
  tempSwCabHub: number; // °C

  // ─── Component Telemetry (22 Components) ───────────────────────────────────────

  // 1. Rotor & Hub
  hubTemperature: number; // °C
  rotorTorque: number; // kNm
  rotorDirection: string; // CW / CCW
  vibrationLevel: number; // g
  blade1Pitch: number; // °
  blade2Pitch: number; // °
  blade3Pitch: number; // °

  // 2. Main Shaft
  shaftSpeed: number; // rpm
  torqueTransfer: number; // kNm
  bearingLoad: number; // kN
  shaftVibration: number; // g
  shaftAlignment: number; // mm

  // 3. Main Bearing
  bearingTemperature: number; // °C
  lubricationPressure: number; // bar
  axialLoad: number; // kN
  radialLoad: number; // kN
  bearingVibration: number; // g

  // 4. Gearbox
  gearboxOilTemp: number; // °C
  gearboxOilPressure: number; // bar
  gearboxVibration: number; // g
  oilParticleCount: number; // count
  oilLevel: number; // %

  // 5. High-Speed Shaft
  highSpeedShaftTemp: number; // °C
  couplingCondition: string; // GOOD / FAIR / POOR
  torsionalVibration: number; // g

  // 6. Rotor Brake
  brakePadWear: number; // %
  brakeProgram: number; // -
  brakeTemperature: number; // °C
  brakeState: string; // ENGAGED / DISENGAGED

  // 7. Generator (additional fields)
  generatorEfficiency: number; // %
  statorTemperature: number; // °C
  rotorTemperature: number; // °C

  // 8. Converter
  dcLinkVoltage: number; // V
  igbtTemperature: number; // °C
  gridSyncStatus: string; // SYNCHRONIZED / ASYNC
  apparentPowerOutput: number; // kVA

  // 9. Transformer (additional fields)
  transformerOilTemp: number; // °C
  coolingState: string; // FAN1 / FAN2 / PUMP

  // 10. Control Cabinet
  plcStatus: string; // RUNNING / STOPPED / FAULT
  upsStatus: string; // OK / LOW / FAULT
  ethernetStatus: string; // OK / ERROR
  controllerHealth: number; // %

  // 11. Yaw Bearing
  bearingTorque: number; // kNm
  yawSpeed: number; // °/min

  // 12. Yaw Drive
  yawMotorSpeed: number; // rpm
  yawMotorCurrent: number; // A

  // 13. Rotor Locking Disk
  lockStatus: string; // ENGAGED / DISENGAGED
  serviceMode: boolean;

  // 14. Hydraulic Unit
  hydraulicPumpState: string; // RUNNING / READY / OFF
  valveState: string; // OPEN / CLOSED
  reservoirLevel: number; // %

  // 15. Cooling System
  heatExchangerFanSpeed: number; // %
  coolantTemperature: number; // °C
  pumpSpeed: number; // %

  // 16. Anemometer & Wind Vane
  gustSpeed: number; // m/s
  airDensity: number; // kg/m³

  // 17. Blade Pitch System
  pitchMotorCurrent1: number; // A
  pitchMotorCurrent2: number; // A
  pitchMotorCurrent3: number; // A
  pitchPressure: number; // bar
  emergencyFeatherState: string; // ARMED / FIRED

  // 18. Lightning Protection
  strikeCounter: number; // count
  groundResistance: number; // Ω
  surgeProtectionStatus: string; // OK / FAULT

  // 19. Fire Detection
  smokeSensor: string; // OK / ALARM
  heatAlarm: string; // OK / ALARM
  fireSuppressionState: string; // ARMED / DISCHARGED

  // 20. Condition Monitoring System (CMS)
  cmsAlarmSeverity: string; // NOMINAL / WARNING / CRITICAL
  cmsFFTAnalysis: number[]; // Vibration spectrum data
  gearMeshFrequency: number; // Hz
  bearingPeakFrequency: number; // Hz

  // 21. Grid Connection
  gridFrequency: number; // Hz
  gridVoltage: number; // V
  exportPower: number; // kW
  breakerStatus: string; // CLOSED / OPEN / TRIPPED

  // 22. Aviation Warning Lights
  lightStatus: string; // ON / OFF / FLASHING
  flashMode: string; // SYNCHRONIZED / INDEPENDENT
  upsBackupStatus: string; // OK / ON_BATTERY

  // Advanced Status Types for SCADA
  scadaStatus: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'MAINTENANCE';
  availability: number; // %
  capacityFactor: number; // %
}

// Status configuration
export type TurbineStatus = TurbineData['status'];

// ─── Ticket (sprint ticket table) ─────────────────────────────────────────────
export type TicketStatus = 'To Do' | 'In Progress' | 'In Review' | 'Blocked' | 'In Test' | 'Done';

export interface Ticket {
  id: number;
  team: string;
  assignee: string;
  issueType: 'Story' | 'Task' | 'Bug' | 'Epic' | 'Spike';
  issueNo: string;
  summary: string;
  timeLoggingId: string;
  status: TicketStatus;
  storyPoints: number;
  fixVersion: string;
  carryForward: string; // Source sprint name when carried forward, e.g. 'Sprint 23' (empty = not carried forward)
  carryForwardReason: string;
  workStartDate: string; // YYYY-MM-DD
  workEndDate: string; // YYYY-MM-DD
  ticketLink: string; // URL to the ticket in the issue tracker
}

export const TICKET_STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  'To Do': {
    label: 'To Do',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
  },
  'In Progress': {
    label: 'In Progress',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.4)',
  },
  'In Review': {
    label: 'In Review',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
  },
  Blocked: {
    label: 'Blocked',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  'In Test': {
    label: 'In Test',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
  },
  Done: {
    label: 'Done',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
};

export const STATUS_CONFIG: Record<
  TurbineStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  running: {
    label: 'Running',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
  },
  stopped: {
    label: 'Stopped',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
  },
  maintenance: {
    label: 'Maintenance',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
  },
  fault: {
    label: 'Fault',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  standby: {
    label: 'Standby',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
  },
};

// SCADA Status Configuration
export type ScadaStatus = TurbineData['scadaStatus'];

export const SCADA_STATUS_CONFIG: Record<
  ScadaStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
  }
> = {
  NOMINAL: {
    label: 'NOMINAL',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
    glowColor: 'rgba(16,185,129,0.5)',
  },
  WARNING: {
    label: 'WARNING',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
    glowColor: 'rgba(245,158,11,0.5)',
  },
  CRITICAL: {
    label: 'CRITICAL',
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.15)',
    borderColor: 'rgba(239,68,68,0.4)',
    glowColor: 'rgba(239,68,68,0.5)',
  },
  OFFLINE: {
    label: 'OFFLINE',
    color: '#64748b',
    bgColor: 'rgba(100,116,139,0.15)',
    borderColor: 'rgba(100,116,139,0.4)',
    glowColor: 'rgba(100,116,139,0.5)',
  },
  MAINTENANCE: {
    label: 'MAINTENANCE',
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
    glowColor: 'rgba(139,92,246,0.5)',
  },
};

// Component definitions for 3D visualization
export interface ComponentDefinition {
  id: string;
  name: string;
  category: 'rotor' | 'drivetrain' | 'electrical' | 'control' | 'safety' | 'environmental';
  description: string;
  position: [number, number, number]; // Relative to nacelle center
  color: string;
  emissiveColor: string;
  telemetry: string[]; // Field names for telemetry
}

export const TURBINE_COMPONENTS: ComponentDefinition[] = [
  {
    id: 'rotor-hub',
    name: 'Rotor & Hub',
    category: 'rotor',
    description:
      'Three-blade rotor assembly with pitch-controlled hub. Captures wind energy and converts it into rotational torque.',
    position: [0.9, 0, 0],
    color: '#0ea5e9',
    emissiveColor: '#06b6d4',
    telemetry: [
      'hubTemperature',
      'rotorTorque',
      'vibrationLevel',
      'blade1Pitch',
      'blade2Pitch',
      'blade3Pitch',
    ],
  },
  {
    id: 'main-shaft',
    name: 'Main Shaft',
    category: 'drivetrain',
    description:
      'Low-speed shaft connecting rotor hub to gearbox input. Transmits torque from the rotor.',
    position: [0.7, 0, 0],
    color: '#06b6d4',
    emissiveColor: '#22d3ee',
    telemetry: ['shaftSpeed', 'torqueTransfer', 'shaftVibration', 'shaftAlignment'],
  },
  {
    id: 'main-bearing',
    name: 'Main Bearing',
    category: 'drivetrain',
    description: 'Supports the main shaft against radial and axial loads from the rotor.',
    position: [0.5, 0.1, 0],
    color: '#22d3ee',
    emissiveColor: '#67e8f9',
    telemetry: [
      'bearingTemperature',
      'lubricationPressure',
      'axialLoad',
      'radialLoad',
      'bearingVibration',
    ],
  },
  {
    id: 'gearbox',
    name: 'Gearbox',
    category: 'drivetrain',
    description:
      'Planetary/helical gearbox converting low-speed rotor motion into high-speed generator rotation.',
    position: [-0.2, 0, 0.3],
    color: '#8b5cf6',
    emissiveColor: '#a78bfa',
    telemetry: [
      'gearboxOilTemp',
      'gearSpeed',
      'gearboxOilPressure',
      'gearboxVibration',
      'oilLevel',
    ],
  },
  {
    id: 'high-speed-shaft',
    name: 'High-Speed Shaft',
    category: 'drivetrain',
    description: 'Transfers high-speed rotational energy from gearbox to generator.',
    position: [-0.5, 0, 0.3],
    color: '#a78bfa',
    emissiveColor: '#c4b5fd',
    telemetry: ['generatorRpm', 'highSpeedShaftTemp', 'couplingCondition', 'torsionalVibration'],
  },
  {
    id: 'rotor-brake',
    name: 'Rotor Brake',
    category: 'drivetrain',
    description: 'High-speed-shaft mechanical disc brake for emergency rotor stop and parking.',
    position: [-0.4, 0, 0.35],
    color: '#f59e0b',
    emissiveColor: '#fbbf24',
    telemetry: [
      'brakePadWear',
      'brakeProgram',
      'brakeTemperature',
      'brakeState',
      'hydraulicPressure',
    ],
  },
  {
    id: 'generator',
    name: 'Generator',
    category: 'electrical',
    description:
      'Doubly-fed induction generator (DFIG). Converts rotational mechanical energy into electrical power.',
    position: [0.1, 0, -0.3],
    color: '#10b981',
    emissiveColor: '#34d399',
    telemetry: [
      'generatorTemp',
      'generatorWindingTempU',
      'generatorWindingTempV',
      'generatorWindingTempW',
      'generatorEfficiency',
    ],
  },
  {
    id: 'converter',
    name: 'Converter',
    category: 'electrical',
    description:
      'Full-scale frequency converter for variable-speed operation and grid synchronization.',
    position: [0.1, 0.1, -0.25],
    color: '#34d399',
    emissiveColor: '#6ee7b7',
    telemetry: [
      'activePower',
      'apparentPowerOutput',
      'powerFactor',
      'dcLinkVoltage',
      'igbtTemperature',
    ],
  },
  {
    id: 'transformer',
    name: 'Transformer',
    category: 'electrical',
    description: 'Steps up generator voltage (690V) to medium-voltage grid level (33kV).',
    position: [0, 0, -0.35],
    color: '#f59e0b',
    emissiveColor: '#fbbf24',
    telemetry: [
      'transformerTemp',
      'trfWindingTempU',
      'trfWindingTempV',
      'trfWindingTempW',
      'voltageL1',
      'voltageL2',
      'voltageL3',
    ],
  },
  {
    id: 'control-cabinet',
    name: 'Control Cabinet',
    category: 'control',
    description: 'Main PLC and turbine automation control system.',
    position: [0, 0.15, 0],
    color: '#64748b',
    emissiveColor: '#94a3b8',
    telemetry: ['nacelleTemp', 'tempSwCabNacelle', 'plcStatus', 'upsStatus', 'controllerHealth'],
  },
  {
    id: 'yaw-bearing',
    name: 'Yaw Bearing',
    category: 'control',
    description:
      'Large slewing ring at tower top providing rotational interface between tower and nacelle.',
    position: [-0.6, 0, 0],
    color: '#ec4899',
    emissiveColor: '#f472b6',
    telemetry: ['nacellePosition', 'cableWinding', 'bearingTorque', 'yawSpeed'],
  },
  {
    id: 'yaw-drive',
    name: 'Yaw Drive',
    category: 'control',
    description: 'Yaw drive motors align turbine with incoming wind.',
    position: [-0.55, 0.05, 0.1],
    color: '#f472b6',
    emissiveColor: '#fb7185',
    telemetry: ['yawMotorSpeed', 'yawMotorCurrent', 'yawDirection'],
  },
  {
    id: 'rotor-locking',
    name: 'Rotor Locking Disk',
    category: 'safety',
    description:
      'Bolted flange between hub and main shaft used during service to mechanically lock the rotor.',
    position: [0.85, 0.05, 0],
    color: '#ef4444',
    emissiveColor: '#f87171',
    telemetry: ['rotorRpm', 'lockStatus', 'serviceMode'],
  },
  {
    id: 'hydraulic-unit',
    name: 'Hydraulic Unit',
    category: 'control',
    description: 'Hydraulic system for blade pitch actuation and rotor brake operation.',
    position: [-0.3, 0.05, 0.25],
    color: '#3b82f6',
    emissiveColor: '#60a5fa',
    telemetry: ['hydraulicPressure', 'hydraulicPumpState', 'valveState', 'reservoirLevel'],
  },
  {
    id: 'cooling-system',
    name: 'Cooling System',
    category: 'control',
    description: 'Four heat-exchanger units sharing a closed water-glycol loop.',
    position: [-0.2, 0.1, -0.2],
    color: '#06b6d4',
    emissiveColor: '#22d3ee',
    telemetry: ['coolCnvHeatExIn', 'coolCnvHeatExOut', 'coolantTemperature', 'pumpSpeed'],
  },
  {
    id: 'anemometer',
    name: 'Anemometer & Wind Vane',
    category: 'environmental',
    description:
      'Roof-mounted ultrasonic anemometer & wind vane. Measures wind speed/direction for yaw control.',
    position: [0, 0.35, 0.2],
    color: '#a855f7',
    emissiveColor: '#c084fc',
    telemetry: ['windSpeed', 'windDirection', 'outdoorTemp', 'gustSpeed', 'airDensity'],
  },
  {
    id: 'blade-pitch',
    name: 'Blade Pitch System',
    category: 'control',
    description: 'Hydraulic pitch system controlling blade aerodynamic angle.',
    position: [0.9, 0, 0],
    color: '#f97316',
    emissiveColor: '#fb923c',
    telemetry: [
      'pitchAngle',
      'pitchCylinder1',
      'pitchCylinder2',
      'pitchCylinder3',
      'pitchMotorCurrent1',
    ],
  },
  {
    id: 'lightning-protection',
    name: 'Lightning Protection',
    category: 'safety',
    description: 'Monitors grounding and lightning strike counters.',
    position: [0, 5.5, 0],
    color: '#eab308',
    emissiveColor: '#facc15',
    telemetry: ['strikeCounter', 'groundResistance', 'surgeProtectionStatus'],
  },
  {
    id: 'fire-detection',
    name: 'Fire Detection',
    category: 'safety',
    description: 'Industrial nacelle fire safety monitoring.',
    position: [-0.1, 0.08, 0.1],
    color: '#dc2626',
    emissiveColor: '#ef4444',
    telemetry: ['smokeSensor', 'heatAlarm', 'fireSuppressionState'],
  },
  {
    id: 'cms',
    name: 'Condition Monitoring',
    category: 'control',
    description: 'Advanced predictive maintenance diagnostics system.',
    position: [-0.3, 0.08, -0.15],
    color: '#7c3aed',
    emissiveColor: '#a855f7',
    telemetry: ['cmsAlarmSeverity', 'gearboxVibration', 'bearingVibration', 'shaftVibration'],
  },
  {
    id: 'grid-connection',
    name: 'Grid Connection',
    category: 'electrical',
    description: 'Grid export and synchronization monitoring.',
    position: [-0.4, 0.1, -0.3],
    color: '#84cc16',
    emissiveColor: '#a3e635',
    telemetry: ['gridFrequency', 'gridVoltage', 'exportPower', 'breakerStatus', 'powerFrequency'],
  },
  {
    id: 'aviation-lights',
    name: 'Aviation Lights',
    category: 'safety',
    description: 'Aircraft obstruction safety system.',
    position: [0, 0.35, 0],
    color: '#ef4444',
    emissiveColor: '#f87171',
    telemetry: ['lightStatus', 'flashMode', 'upsBackupStatus'],
  },
];

// Component categories for UI grouping
export const COMPONENT_CATEGORIES = [
  {
    id: 'rotor',
    label: 'Rotor & Hub',
    icon: '🌪️',
    color: '#0ea5e9',
  },
  {
    id: 'drivetrain',
    label: 'Drive Train',
    icon: '⚙️',
    color: '#8b5cf6',
  },
  {
    id: 'electrical',
    label: 'Electrical',
    icon: '⚡',
    color: '#10b981',
  },
  {
    id: 'control',
    label: 'Control Systems',
    icon: '🎛️',
    color: '#f59e0b',
  },
  {
    id: 'safety',
    label: 'Safety Systems',
    icon: '🛡️',
    color: '#ef4444',
  },
  {
    id: 'environmental',
    label: 'Environmental',
    icon: '🌡️',
    color: '#a855f7',
  },
];
