/**
 * Mock Data Utility - Centralized mock data for entire application
 *
 * To remove mock data when API is ready:
 * 1. Replace imports from this file with actual API hooks
 * 2. Delete this file
 * 3. Update components to use real data sources
 *
 * Structure:
 * - Turbine mock data
 * - Feature flags mock data
 * - Inventory mock data
 * - Reports mock data
 * - Help & Support mock data
 */

import React, { useEffect, useState } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TurbineData {
  position?: any;
  id: number;
  turbineNo: string;
  status: 'running' | 'stopped' | 'maintenance' | 'fault' | 'standby';
  time: string;
  capacity: number;
  activePower: number;
  windSpeed: number;
  breakProgramme: string;
  operatingMode: string;
  todayGeneration: number;
  totalProduction: number;
  totalOperatingHours: number;
  totalProductionHours: number;
  operationHoursToday: number;
  currentL1: number;
  currentL2: number;
  currentL3: number;
  powerFrequency: number;
  voltageL1: number;
  voltageL2: number;
  voltageL3: number;
  apparentPower: number;
  reactivePower: number;
  powerFactor: number;
  rotorRpm: number;
  gearSpeed: number;
  generatorRpm: number;
  nacellePosition: number;
  cableWinding: number;
  windDirection: number;
  relativeWindDirection: number;
  pitchAngle: number;
  pitchCylinder1: number;
  pitchCylinder2: number;
  pitchCylinder3: number;
  towerOscillationX: number;
  towerOscillationY: number;
  outdoorTemp: number;
  trfWindingTempU: number;
  trfWindingTempV: number;
  trfWindingTempW: number;
  nacelleTemp: number;
  coolCnvHeatExIn: number;
  coolCnvHeatExOut: number;
  coolTrfHeatExIn: number;
  gearOilSumpTemp: number;
  generatorWindingTempU: number;
  generatorWindingTempV: number;
  generatorWindingTempW: number;
  gearboxTemp: number;
  generatorTemp: number;
  transformerTemp: number;
  hubExhaustTemp: number;
  hydraulicPressure: number;
  gearOilPressure: number;
  coolantInletPressure: number;
  coolantOutletPressure: number;
  tempSwCabTower: number;
  tempSwCabNacelle: number;
  tempSwCabHub: number;
  // Component Telemetry Fields
  hubTemperature: number;
  rotorTorque: number;
  rotorDirection: string;
  vibrationLevel: number;
  blade1Pitch: number;
  blade2Pitch: number;
  blade3Pitch: number;
  shaftSpeed: number;
  torqueTransfer: number;
  bearingLoad: number;
  shaftVibration: number;
  shaftAlignment: number;
  bearingTemperature: number;
  lubricationPressure: number;
  axialLoad: number;
  radialLoad: number;
  bearingVibration: number;
  gearboxOilTemp: number;
  gearboxOilPressure: number;
  gearboxVibration: number;
  oilParticleCount: number;
  oilLevel: number;
  highSpeedShaftTemp: number;
  couplingCondition: string;
  torsionalVibration: number;
  brakePadWear: number;
  brakeProgram: number;
  brakeTemperature: number;
  brakeState: string;
  generatorEfficiency: number;
  statorTemperature: number;
  rotorTemperature: number;
  dcLinkVoltage: number;
  igbtTemperature: number;
  gridSyncStatus: string;
  apparentPowerOutput: number;
  transformerOilTemp: number;
  coolingState: string;
  plcStatus: string;
  upsStatus: string;
  ethernetStatus: string;
  controllerHealth: number;
  bearingTorque: number;
  yawSpeed: number;
  yawMotorSpeed: number;
  yawMotorCurrent: number;
  lockStatus: string;
  serviceMode: boolean;
  hydraulicPumpState: string;
  valveState: string;
  reservoirLevel: number;
  heatExchangerFanSpeed: number;
  coolantTemperature: number;
  pumpSpeed: number;
  gustSpeed: number;
  airDensity: number;
  pitchMotorCurrent1: number;
  pitchMotorCurrent2: number;
  pitchMotorCurrent3: number;
  pitchPressure: number;
  emergencyFeatherState: string;
  strikeCounter: number;
  groundResistance: number;
  surgeProtectionStatus: string;
  smokeSensor: string;
  heatAlarm: string;
  fireSuppressionState: string;
  cmsAlarmSeverity: string;
  cmsFFTAnalysis: number[];
  gearMeshFrequency: number;
  bearingPeakFrequency: number;
  gridFrequency: number;
  gridVoltage: number;
  exportPower: number;
  breakerStatus: string;
  lightStatus: string;
  flashMode: string;
  upsBackupStatus: string;
  scadaStatus: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'MAINTENANCE';
  availability: number;
  capacityFactor: number;
}

export interface FeatureFlagData {
  id: number;
  name: string;
  key: string;
  description: string;
  environment: string;
  status: 'Enabled' | 'Disabled';
  roles: string[];
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}


export interface KpiRowData {
  id: number;
  kpi: string;
  t01: string;
  t02: string;
  t03: string;
  t04: string;
  t05: string;
  t06: string;
  t07: string;
  t08: string;
  t09: string;
  t10: string;
  total: string;
}

export interface DowntimeRowData {
  id: number;
  turbineNo: string;
  from: string;
  to: string;
  duration: string;
  downtimeType: 'Scheduled' | 'Unscheduled' | 'Force Majeure' | 'Grid Fault' | 'Communication Loss';
  faultStatus: string;
  remarks: string;
}

export interface FaqCategoryData {
  category: string;
  icon: string;
  questions: { q: string; a: string }[];
}

export interface QuickLinkData {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

// ─── Turbine Status Config ─────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  running: {
    label: 'Running',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  stopped: {
    label: 'Stopped',
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.12)',
    borderColor: 'rgba(107, 114, 128, 0.4)',
  },
  maintenance: {
    label: 'Maintenance',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  fault: {
    label: 'Fault',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  standby: {
    label: 'Standby',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
};

// ─── Mock Turbine Data ─────────────────────────────────────────────────────────

export const MOCK_TURBINE_DATA: TurbineData[] = [
  {
    id: 1,
    turbineNo: 'T-01',
    status: 'running',
    time: '14:32:15',
    capacity: 2000,
    activePower: 1850,
    windSpeed: 8.5,
    breakProgramme: 'Released',
    operatingMode: 'Grid Connected',
    todayGeneration: 4285,
    totalProduction: 12450,
    totalOperatingHours: 14820,
    totalProductionHours: 13540,
    operationHoursToday: 11.2,
    currentL1: 1542,
    currentL2: 1538,
    currentL3: 1545,
    powerFrequency: 50.01,
    voltageL1: 691,
    voltageL2: 689,
    voltageL3: 690,
    apparentPower: 1948,
    reactivePower: 485,
    powerFactor: 0.95,
    rotorRpm: 14.2,
    gearSpeed: 248,
    generatorRpm: 1520,
    nacellePosition: 242,
    cableWinding: 125,
    windDirection: 245,
    relativeWindDirection: -3,
    pitchAngle: 3.2,
    pitchCylinder1: 142,
    pitchCylinder2: 144,
    pitchCylinder3: 141,
    towerOscillationX: 0.18,
    towerOscillationY: 0.12,
    outdoorTemp: 28,
    trfWindingTempU: 68,
    trfWindingTempV: 70,
    trfWindingTempW: 67,
    nacelleTemp: 38,
    coolCnvHeatExIn: 52,
    coolCnvHeatExOut: 32,
    coolTrfHeatExIn: 48,
    gearOilSumpTemp: 62,
    generatorWindingTempU: 82,
    generatorWindingTempV: 84,
    generatorWindingTempW: 81,
    gearboxTemp: 52,
    generatorTemp: 65,
    transformerTemp: 42,
    hubExhaustTemp: 38,
    hydraulicPressure: 185,
    gearOilPressure: 3.1,
    coolantInletPressure: 1.8,
    coolantOutletPressure: 1.3,
    tempSwCabTower: 32,
    tempSwCabNacelle: 36,
    tempSwCabHub: 34,
    // Component Telemetry
    hubTemperature: 38.2,
    rotorTorque: 156.8,
    rotorDirection: 'CW',
    vibrationLevel: 0.04,
    blade1Pitch: 3.1,
    blade2Pitch: 3.2,
    blade3Pitch: 3.0,
    shaftSpeed: 14.2,
    torqueTransfer: 156.8,
    bearingLoad: 845.2,
    shaftVibration: 0.02,
    shaftAlignment: 0.12,
    bearingTemperature: 42.5,
    lubricationPressure: 3.2,
    axialLoad: 234.5,
    radialLoad: 156.8,
    bearingVibration: 0.03,
    gearboxOilTemp: 55.8,
    gearboxOilPressure: 3.1,
    gearboxVibration: 0.05,
    oilParticleCount: 245,
    oilLevel: 92,
    highSpeedShaftTemp: 48.2,
    couplingCondition: 'GOOD',
    torsionalVibration: 0.01,
    brakePadWear: 12,
    brakeProgram: 200,
    brakeTemperature: 38.5,
    brakeState: 'DISENGAGED',
    generatorEfficiency: 94.5,
    statorTemperature: 78.2,
    rotorTemperature: 65.4,
    dcLinkVoltage: 1050,
    igbtTemperature: 42.8,
    gridSyncStatus: 'SYNCHRONIZED',
    apparentPowerOutput: 1948,
    transformerOilTemp: 48.5,
    coolingState: 'FAN1',
    plcStatus: 'RUNNING',
    upsStatus: 'OK',
    ethernetStatus: 'OK',
    controllerHealth: 98.5,
    bearingTorque: 2.4,
    yawSpeed: 0.15,
    yawMotorSpeed: 12,
    yawMotorCurrent: 4.5,
    lockStatus: 'DISENGAGED',
    serviceMode: false,
    hydraulicPumpState: 'RUNNING',
    valveState: 'OPEN',
    reservoirLevel: 88,
    heatExchangerFanSpeed: 65,
    coolantTemperature: 32.5,
    pumpSpeed: 72,
    gustSpeed: 12.5,
    airDensity: 1.225,
    pitchMotorCurrent1: 2.8,
    pitchMotorCurrent2: 3.0,
    pitchMotorCurrent3: 2.9,
    pitchPressure: 185,
    emergencyFeatherState: 'ARMED',
    strikeCounter: 3,
    groundResistance: 4.2,
    surgeProtectionStatus: 'OK',
    smokeSensor: 'OK',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'NOMINAL',
    gridFrequency: 50.01,
    gridVoltage: 690,
    exportPower: 1850,
    breakerStatus: 'CLOSED',
    lightStatus: 'FLASHING',
    flashMode: 'SYNCHRONIZED',
    upsBackupStatus: 'OK',
    scadaStatus: 'NOMINAL',
    availability: 98.7,
    capacityFactor: 42.5,
    cmsFFTAnalysis: [0.02, 0.05, 0.08, 0.12, 0.18, 0.25, 0.15, 0.08, 0.04, 0.02],
    gearMeshFrequency: 1048,
    bearingPeakFrequency: 156,
  },
  {
    id: 2,
    turbineNo: 'T-02',
    status: 'running',
    time: '14:32:18',
    capacity: 2000,
    activePower: 1920,
    windSpeed: 9.2,
    breakProgramme: 'Released',
    operatingMode: 'Grid Connected',
    todayGeneration: 4510,
    totalProduction: 11820,
    totalOperatingHours: 14210,
    totalProductionHours: 13020,
    operationHoursToday: 11.8,
    currentL1: 1600,
    currentL2: 1596,
    currentL3: 1602,
    powerFrequency: 49.98,
    voltageL1: 692,
    voltageL2: 690,
    voltageL3: 691,
    apparentPower: 2021,
    reactivePower: 510,
    powerFactor: 0.95,
    rotorRpm: 14.8,
    gearSpeed: 258,
    generatorRpm: 1580,
    nacellePosition: 240,
    cableWinding: 148,
    windDirection: 238,
    relativeWindDirection: -2,
    pitchAngle: 2.8,
    pitchCylinder1: 148,
    pitchCylinder2: 146,
    pitchCylinder3: 147,
    towerOscillationX: 0.22,
    towerOscillationY: 0.15,
    outdoorTemp: 27,
    trfWindingTempU: 71,
    trfWindingTempV: 73,
    trfWindingTempW: 70,
    nacelleTemp: 40,
    coolCnvHeatExIn: 55,
    coolCnvHeatExOut: 34,
    coolTrfHeatExIn: 50,
    gearOilSumpTemp: 65,
    generatorWindingTempU: 86,
    generatorWindingTempV: 88,
    generatorWindingTempW: 85,
    gearboxTemp: 54,
    generatorTemp: 68,
    transformerTemp: 44,
    hubExhaustTemp: 40,
    hydraulicPressure: 188,
    gearOilPressure: 3.2,
    coolantInletPressure: 1.9,
    coolantOutletPressure: 1.4,
    tempSwCabTower: 33,
    tempSwCabNacelle: 38,
    tempSwCabHub: 35,
    // Component Telemetry
    hubTemperature: 40.1,
    rotorTorque: 162.5,
    rotorDirection: 'CW',
    vibrationLevel: 0.05,
    blade1Pitch: 2.9,
    blade2Pitch: 2.8,
    blade3Pitch: 2.7,
    shaftSpeed: 14.8,
    torqueTransfer: 162.5,
    bearingLoad: 892.3,
    shaftVibration: 0.025,
    shaftAlignment: 0.15,
    bearingTemperature: 44.8,
    lubricationPressure: 3.3,
    axialLoad: 245.8,
    radialLoad: 162.5,
    bearingVibration: 0.035,
    gearboxOilTemp: 58.2,
    gearboxOilPressure: 3.2,
    gearboxVibration: 0.055,
    oilParticleCount: 268,
    oilLevel: 90,
    highSpeedShaftTemp: 52.4,
    couplingCondition: 'GOOD',
    torsionalVibration: 0.015,
    brakePadWear: 15,
    brakeProgram: 200,
    brakeTemperature: 40.2,
    brakeState: 'DISENGAGED',
    generatorEfficiency: 95.2,
    statorTemperature: 82.5,
    rotorTemperature: 68.8,
    dcLinkVoltage: 1080,
    igbtTemperature: 45.6,
    gridSyncStatus: 'SYNCHRONIZED',
    apparentPowerOutput: 2021,
    transformerOilTemp: 52.1,
    coolingState: 'FAN2',
    plcStatus: 'RUNNING',
    upsStatus: 'OK',
    ethernetStatus: 'OK',
    controllerHealth: 99.2,
    bearingTorque: 2.8,
    yawSpeed: 0.18,
    yawMotorSpeed: 15,
    yawMotorCurrent: 5.2,
    lockStatus: 'DISENGAGED',
    serviceMode: false,
    hydraulicPumpState: 'RUNNING',
    valveState: 'OPEN',
    reservoirLevel: 85,
    heatExchangerFanSpeed: 72,
    coolantTemperature: 34.8,
    pumpSpeed: 78,
    gustSpeed: 14.2,
    airDensity: 1.218,
    pitchMotorCurrent1: 3.0,
    pitchMotorCurrent2: 2.9,
    pitchMotorCurrent3: 3.1,
    pitchPressure: 188,
    emergencyFeatherState: 'ARMED',
    strikeCounter: 5,
    groundResistance: 4.5,
    surgeProtectionStatus: 'OK',
    smokeSensor: 'OK',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'NOMINAL',
    gridFrequency: 49.98,
    gridVoltage: 692,
    exportPower: 1920,
    breakerStatus: 'CLOSED',
    lightStatus: 'ON',
    flashMode: 'SYNCHRONIZED',
    upsBackupStatus: 'OK',
    scadaStatus: 'NOMINAL',
    availability: 99.1,
    capacityFactor: 45.2,
    cmsFFTAnalysis: [0.03, 0.06, 0.1, 0.15, 0.22, 0.28, 0.18, 0.09, 0.05, 0.02],
    gearMeshFrequency: 1052,
    bearingPeakFrequency: 162,
  },
  {
    id: 3,
    turbineNo: 'T-03',
    status: 'maintenance',
    time: '14:30:00',
    capacity: 2000,
    activePower: 0,
    windSpeed: 7.1,
    breakProgramme: 'Applied',
    operatingMode: 'Service Mode',
    todayGeneration: 3892,
    totalProduction: 9870,
    totalOperatingHours: 12400,
    totalProductionHours: 11200,
    operationHoursToday: 6.5,
    currentL1: 0,
    currentL2: 0,
    currentL3: 0,
    powerFrequency: 0,
    voltageL1: 0,
    voltageL2: 0,
    voltageL3: 0,
    apparentPower: 0,
    reactivePower: 0,
    powerFactor: 0,
    rotorRpm: 0,
    gearSpeed: 0,
    generatorRpm: 0,
    nacellePosition: 180,
    cableWinding: 82,
    windDirection: 260,
    relativeWindDirection: 80,
    pitchAngle: 90,
    pitchCylinder1: 285,
    pitchCylinder2: 285,
    pitchCylinder3: 285,
    towerOscillationX: 0.02,
    towerOscillationY: 0.01,
    outdoorTemp: 29,
    trfWindingTempU: 38,
    trfWindingTempV: 38,
    trfWindingTempW: 37,
    nacelleTemp: 32,
    coolCnvHeatExIn: 30,
    coolCnvHeatExOut: 25,
    coolTrfHeatExIn: 29,
    gearOilSumpTemp: 38,
    generatorWindingTempU: 35,
    generatorWindingTempV: 36,
    generatorWindingTempW: 35,
    gearboxTemp: 35,
    generatorTemp: 32,
    transformerTemp: 38,
    hubExhaustTemp: 28,
    hydraulicPressure: 175,
    gearOilPressure: 2.8,
    coolantInletPressure: 1.2,
    coolantOutletPressure: 0.9,
    tempSwCabTower: 29,
    tempSwCabNacelle: 31,
    tempSwCabHub: 28,
    // Component Telemetry
    hubTemperature: 28.5,
    rotorTorque: 0,
    rotorDirection: 'CW',
    vibrationLevel: 0.01,
    blade1Pitch: 90,
    blade2Pitch: 90,
    blade3Pitch: 90,
    shaftSpeed: 0,
    torqueTransfer: 0,
    bearingLoad: 45.2,
    shaftVibration: 0.005,
    shaftAlignment: 0.08,
    bearingTemperature: 32.5,
    lubricationPressure: 2.8,
    axialLoad: 28.5,
    radialLoad: 15.2,
    bearingVibration: 0.008,
    gearboxOilTemp: 35.2,
    gearboxOilPressure: 2.8,
    gearboxVibration: 0.012,
    oilParticleCount: 152,
    oilLevel: 88,
    highSpeedShaftTemp: 28.5,
    couplingCondition: 'GOOD',
    torsionalVibration: 0.002,
    brakePadWear: 45,
    brakeProgram: 100,
    brakeTemperature: 28.5,
    brakeState: 'ENGAGED',
    generatorEfficiency: 0,
    statorTemperature: 32.5,
    rotorTemperature: 28.5,
    dcLinkVoltage: 0,
    igbtTemperature: 25.8,
    gridSyncStatus: 'ASYNC',
    apparentPowerOutput: 0,
    transformerOilTemp: 35.2,
    coolingState: 'PUMP',
    plcStatus: 'STOPPED',
    upsStatus: 'OK',
    ethernetStatus: 'OK',
    controllerHealth: 95.8,
    bearingTorque: 0,
    yawSpeed: 0,
    yawMotorSpeed: 0,
    yawMotorCurrent: 0,
    lockStatus: 'ENGAGED',
    serviceMode: true,
    hydraulicPumpState: 'OFF',
    valveState: 'CLOSED',
    reservoirLevel: 92,
    heatExchangerFanSpeed: 25,
    coolantTemperature: 25.5,
    pumpSpeed: 35,
    gustSpeed: 9.8,
    airDensity: 1.208,
    pitchMotorCurrent1: 0,
    pitchMotorCurrent2: 0,
    pitchMotorCurrent3: 0,
    pitchPressure: 175,
    emergencyFeatherState: 'FIRED',
    strikeCounter: 2,
    groundResistance: 4.8,
    surgeProtectionStatus: 'OK',
    smokeSensor: 'OK',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'WARNING',
    gridFrequency: 0,
    gridVoltage: 0,
    exportPower: 0,
    breakerStatus: 'OPEN',
    lightStatus: 'OFF',
    flashMode: 'INDEPENDENT',
    upsBackupStatus: 'OK',
    scadaStatus: 'MAINTENANCE',
    availability: 85.2,
    capacityFactor: 0,
    cmsFFTAnalysis: [0.05, 0.08, 0.12, 0.18, 0.25, 0.35, 0.22, 0.12, 0.08, 0.04],
    gearMeshFrequency: 1055,
    bearingPeakFrequency: 178,
  },
  {
    id: 4,
    turbineNo: 'T-04',
    status: 'running',
    time: '14:32:22',
    capacity: 2000,
    activePower: 1650,
    windSpeed: 7.8,
    breakProgramme: 'Released',
    operatingMode: 'Grid Connected',
    todayGeneration: 3950,
    totalProduction: 10920,
    totalOperatingHours: 13650,
    totalProductionHours: 12480,
    operationHoursToday: 10.8,
    currentL1: 1375,
    currentL2: 1371,
    currentL3: 1378,
    powerFrequency: 50.02,
    voltageL1: 690,
    voltageL2: 691,
    voltageL3: 689,
    apparentPower: 1737,
    reactivePower: 432,
    powerFactor: 0.95,
    rotorRpm: 13.1,
    gearSpeed: 228,
    generatorRpm: 1420,
    nacellePosition: 255,
    cableWinding: 162,
    windDirection: 252,
    relativeWindDirection: 3,
    pitchAngle: 4.1,
    pitchCylinder1: 135,
    pitchCylinder2: 138,
    pitchCylinder3: 136,
    towerOscillationX: 0.14,
    towerOscillationY: 0.1,
    outdoorTemp: 28,
    trfWindingTempU: 64,
    trfWindingTempV: 66,
    trfWindingTempW: 63,
    nacelleTemp: 36,
    coolCnvHeatExIn: 49,
    coolCnvHeatExOut: 30,
    coolTrfHeatExIn: 45,
    gearOilSumpTemp: 59,
    generatorWindingTempU: 78,
    generatorWindingTempV: 80,
    generatorWindingTempW: 77,
    gearboxTemp: 50,
    generatorTemp: 62,
    transformerTemp: 40,
    hubExhaustTemp: 36,
    hydraulicPressure: 182,
    gearOilPressure: 3.0,
    coolantInletPressure: 1.7,
    coolantOutletPressure: 1.2,
    tempSwCabTower: 31,
    tempSwCabNacelle: 35,
    tempSwCabHub: 33,
    // Component Telemetry
    hubTemperature: 36.8,
    rotorTorque: 142.3,
    rotorDirection: 'CW',
    vibrationLevel: 0.038,
    blade1Pitch: 4.0,
    blade2Pitch: 4.2,
    blade3Pitch: 3.9,
    shaftSpeed: 13.1,
    torqueTransfer: 142.3,
    bearingLoad: 782.5,
    shaftVibration: 0.022,
    shaftAlignment: 0.11,
    bearingTemperature: 40.2,
    lubricationPressure: 3.0,
    axialLoad: 218.5,
    radialLoad: 142.3,
    bearingVibration: 0.028,
    gearboxOilTemp: 52.8,
    gearboxOilPressure: 3.0,
    gearboxVibration: 0.048,
    oilParticleCount: 228,
    oilLevel: 91,
    highSpeedShaftTemp: 45.5,
    couplingCondition: 'GOOD',
    torsionalVibration: 0.012,
    brakePadWear: 18,
    brakeProgram: 200,
    brakeTemperature: 36.8,
    brakeState: 'DISENGAGED',
    generatorEfficiency: 93.8,
    statorTemperature: 75.2,
    rotorTemperature: 62.5,
    dcLinkVoltage: 1020,
    igbtTemperature: 40.2,
    gridSyncStatus: 'SYNCHRONIZED',
    apparentPowerOutput: 1737,
    transformerOilTemp: 45.8,
    coolingState: 'FAN1',
    plcStatus: 'RUNNING',
    upsStatus: 'OK',
    ethernetStatus: 'OK',
    controllerHealth: 97.8,
    bearingTorque: 2.1,
    yawSpeed: 0.12,
    yawMotorSpeed: 10,
    yawMotorCurrent: 3.8,
    lockStatus: 'DISENGAGED',
    serviceMode: false,
    hydraulicPumpState: 'RUNNING',
    valveState: 'OPEN',
    reservoirLevel: 86,
    heatExchangerFanSpeed: 58,
    coolantTemperature: 30.5,
    pumpSpeed: 65,
    gustSpeed: 11.2,
    airDensity: 1.222,
    pitchMotorCurrent1: 2.6,
    pitchMotorCurrent2: 2.8,
    pitchMotorCurrent3: 2.5,
    pitchPressure: 182,
    emergencyFeatherState: 'ARMED',
    strikeCounter: 1,
    groundResistance: 4.1,
    surgeProtectionStatus: 'OK',
    smokeSensor: 'OK',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'NOMINAL',
    gridFrequency: 50.02,
    gridVoltage: 690,
    exportPower: 1650,
    breakerStatus: 'CLOSED',
    lightStatus: 'FLASHING',
    flashMode: 'SYNCHRONIZED',
    upsBackupStatus: 'OK',
    scadaStatus: 'NOMINAL',
    availability: 97.5,
    capacityFactor: 38.2,
    cmsFFTAnalysis: [0.02, 0.05, 0.08, 0.14, 0.2, 0.26, 0.16, 0.08, 0.04, 0.02],
    gearMeshFrequency: 1045,
    bearingPeakFrequency: 158,
  },
  {
    id: 5,
    turbineNo: 'T-05',
    status: 'fault',
    time: '14:25:45',
    capacity: 2000,
    activePower: 0,
    windSpeed: 6.5,
    breakProgramme: 'Emergency',
    operatingMode: 'Fault Stop',
    todayGeneration: 3125,
    totalProduction: 8540,
    totalOperatingHours: 11200,
    totalProductionHours: 10100,
    operationHoursToday: 4.2,
    currentL1: 0,
    currentL2: 0,
    currentL3: 0,
    powerFrequency: 0,
    voltageL1: 0,
    voltageL2: 0,
    voltageL3: 0,
    apparentPower: 0,
    reactivePower: 0,
    powerFactor: 0,
    rotorRpm: 0,
    gearSpeed: 0,
    generatorRpm: 0,
    nacellePosition: 290,
    cableWinding: 210,
    windDirection: 275,
    relativeWindDirection: -15,
    pitchAngle: 0,
    pitchCylinder1: 0,
    pitchCylinder2: 0,
    pitchCylinder3: 0,
    towerOscillationX: 0.04,
    towerOscillationY: 0.03,
    outdoorTemp: 30,
    trfWindingTempU: 44,
    trfWindingTempV: 45,
    trfWindingTempW: 43,
    nacelleTemp: 35,
    coolCnvHeatExIn: 35,
    coolCnvHeatExOut: 27,
    coolTrfHeatExIn: 33,
    gearOilSumpTemp: 45,
    generatorWindingTempU: 55,
    generatorWindingTempV: 56,
    generatorWindingTempW: 54,
    gearboxTemp: 45,
    generatorTemp: 55,
    transformerTemp: 42,
    hubExhaustTemp: 32,
    hydraulicPressure: 160,
    gearOilPressure: 2.5,
    coolantInletPressure: 1.0,
    coolantOutletPressure: 0.7,
    tempSwCabTower: 30,
    tempSwCabNacelle: 33,
    tempSwCabHub: 31,
    // Component Telemetry
    hubTemperature: 32.5,
    rotorTorque: 0,
    rotorDirection: 'CW',
    vibrationLevel: 0.08,
    blade1Pitch: 0,
    blade2Pitch: 0,
    blade3Pitch: 0,
    shaftSpeed: 0,
    torqueTransfer: 0,
    bearingLoad: 52.5,
    shaftVibration: 0.005,
    shaftAlignment: 0.25,
    bearingTemperature: 58.2,
    lubricationPressure: 1.8,
    axialLoad: 35.2,
    radialLoad: 22.5,
    bearingVibration: 0.085,
    gearboxOilTemp: 52.5,
    gearboxOilPressure: 1.8,
    gearboxVibration: 0.095,
    oilParticleCount: 485,
    oilLevel: 72,
    highSpeedShaftTemp: 35.5,
    couplingCondition: 'POOR',
    torsionalVibration: 0.008,
    brakePadWear: 25,
    brakeProgram: 200,
    brakeTemperature: 42.5,
    brakeState: 'ENGAGED',
    generatorEfficiency: 0,
    statorTemperature: 48.5,
    rotorTemperature: 45.2,
    dcLinkVoltage: 0,
    igbtTemperature: 35.8,
    gridSyncStatus: 'ASYNC',
    apparentPowerOutput: 0,
    transformerOilTemp: 42.5,
    coolingState: 'FAN2',
    plcStatus: 'FAULT',
    upsStatus: 'LOW',
    ethernetStatus: 'ERROR',
    controllerHealth: 68.5,
    bearingTorque: 0,
    yawSpeed: 0,
    yawMotorSpeed: 0,
    yawMotorCurrent: 0,
    lockStatus: 'ENGAGED',
    serviceMode: true,
    hydraulicPumpState: 'OFF',
    valveState: 'CLOSED',
    reservoirLevel: 65,
    heatExchangerFanSpeed: 85,
    coolantTemperature: 35.8,
    pumpSpeed: 45,
    gustSpeed: 9.5,
    airDensity: 1.215,
    pitchMotorCurrent1: 0,
    pitchMotorCurrent2: 0,
    pitchMotorCurrent3: 0,
    pitchPressure: 160,
    emergencyFeatherState: 'FIRED',
    strikeCounter: 0,
    groundResistance: 8.5,
    surgeProtectionStatus: 'FAULT',
    smokeSensor: 'ALARM',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'CRITICAL',
    gridFrequency: 0,
    gridVoltage: 0,
    exportPower: 0,
    breakerStatus: 'TRIPPED',
    lightStatus: 'ON',
    flashMode: 'SYNCHRONIZED',
    upsBackupStatus: 'ON_BATTERY',
    scadaStatus: 'CRITICAL',
    availability: 72.5,
    capacityFactor: 0,
    cmsFFTAnalysis: [0.08, 0.12, 0.18, 0.28, 0.45, 0.62, 0.42, 0.22, 0.12, 0.06],
    gearMeshFrequency: 1152,
    bearingPeakFrequency: 245,
  },
  {
    id: 6,
    turbineNo: 'T-06',
    status: 'running',
    time: '14:28:15',
    capacity: 2000,
    activePower: 1850,
    windSpeed: 10.2,
    breakProgramme: 'Released',
    operatingMode: 'Grid Connected',
    todayGeneration: 4280,
    totalProduction: 11800,
    totalOperatingHours: 13500,
    totalProductionHours: 12350,
    operationHoursToday: 9.5,
    currentL1: 1542,
    currentL2: 1538,
    currentL3: 1545,
    powerFrequency: 50.01,
    voltageL1: 691,
    voltageL2: 690,
    voltageL3: 690,
    apparentPower: 1948,
    reactivePower: 487,
    powerFactor: 0.95,
    rotorRpm: 14.5,
    gearSpeed: 255,
    generatorRpm: 1520,
    nacellePosition: 195,
    cableWinding: 85,
    windDirection: 245,
    relativeWindDirection: -10,
    pitchAngle: 2.8,
    pitchCylinder1: 142,
    pitchCylinder2: 145,
    pitchCylinder3: 143,
    towerOscillationX: 0.18,
    towerOscillationY: 0.12,
    outdoorTemp: 27,
    trfWindingTempU: 68,
    trfWindingTempV: 70,
    trfWindingTempW: 67,
    nacelleTemp: 40,
    coolCnvHeatExIn: 54,
    coolCnvHeatExOut: 33,
    coolTrfHeatExIn: 48,
    gearOilSumpTemp: 62,
    generatorWindingTempU: 82,
    generatorWindingTempV: 84,
    generatorWindingTempW: 81,
    gearboxTemp: 55,
    generatorTemp: 66,
    transformerTemp: 44,
    hubExhaustTemp: 40,
    hydraulicPressure: 185,
    gearOilPressure: 3.2,
    coolantInletPressure: 1.8,
    coolantOutletPressure: 1.3,
    tempSwCabTower: 32,
    tempSwCabNacelle: 37,
    tempSwCabHub: 35,
    // Component Telemetry
    hubTemperature: 40.2,
    rotorTorque: 165.5,
    rotorDirection: 'CW',
    vibrationLevel: 0.038,
    blade1Pitch: 2.9,
    blade2Pitch: 2.7,
    blade3Pitch: 2.8,
    shaftSpeed: 14.5,
    torqueTransfer: 165.5,
    bearingLoad: 856.2,
    shaftVibration: 0.018,
    shaftAlignment: 0.08,
    bearingTemperature: 48.5,
    lubricationPressure: 3.2,
    axialLoad: 245.8,
    radialLoad: 155.2,
    bearingVibration: 0.022,
    gearboxOilTemp: 62.5,
    gearboxOilPressure: 3.2,
    gearboxVibration: 0.038,
    oilParticleCount: 125,
    oilLevel: 90,
    highSpeedShaftTemp: 32.5,
    couplingCondition: 'GOOD',
    torsionalVibration: 0.004,
    brakePadWear: 8,
    brakeProgram: 200,
    brakeTemperature: 30.5,
    brakeState: 'DISENGAGED',
    generatorEfficiency: 45.2,
    statorTemperature: 35.8,
    rotorTemperature: 32.5,
    dcLinkVoltage: 520,
    igbtTemperature: 28.5,
    gridSyncStatus: 'SYNCHRONIZED',
    apparentPowerOutput: 126,
    transformerOilTemp: 36.8,
    coolingState: 'FAN1',
    plcStatus: 'RUNNING',
    upsStatus: 'OK',
    ethernetStatus: 'OK',
    controllerHealth: 96.5,
    bearingTorque: 0.8,
    yawSpeed: 0.05,
    yawMotorSpeed: 5,
    yawMotorCurrent: 1.5,
    lockStatus: 'DISENGAGED',
    serviceMode: false,
    hydraulicPumpState: 'READY',
    valveState: 'OPEN',
    reservoirLevel: 88,
    heatExchangerFanSpeed: 35,
    coolantTemperature: 27.5,
    pumpSpeed: 45,
    gustSpeed: 6.8,
    airDensity: 1.205,
    pitchMotorCurrent1: 0.5,
    pitchMotorCurrent2: 0.6,
    pitchMotorCurrent3: 0.5,
    pitchPressure: 178,
    emergencyFeatherState: 'ARMED',
    strikeCounter: 0,
    groundResistance: 4.0,
    surgeProtectionStatus: 'OK',
    smokeSensor: 'OK',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'NOMINAL',
    gridFrequency: 50.0,
    gridVoltage: 690,
    exportPower: 120,
    breakerStatus: 'CLOSED',
    lightStatus: 'ON',
    flashMode: 'SYNCHRONIZED',
    upsBackupStatus: 'OK',
    scadaStatus: 'WARNING',
    availability: 95.8,
    capacityFactor: 12.5,
    cmsFFTAnalysis: [0.04, 0.07, 0.11, 0.18, 0.28, 0.38, 0.25, 0.14, 0.08, 0.04],
    gearMeshFrequency: 1078,
    bearingPeakFrequency: 168,
  },
  {
    id: 8,
    turbineNo: 'T-08',
    status: 'running',
    time: '14:32:35',
    capacity: 2000,
    activePower: 1950,
    windSpeed: 9.8,
    breakProgramme: 'Released',
    operatingMode: 'Grid Connected',
    todayGeneration: 4680,
    totalProduction: 13200,
    totalOperatingHours: 15400,
    totalProductionHours: 14100,
    operationHoursToday: 12.1,
    currentL1: 1625,
    currentL2: 1621,
    currentL3: 1628,
    powerFrequency: 49.99,
    voltageL1: 692,
    voltageL2: 691,
    voltageL3: 690,
    apparentPower: 2053,
    reactivePower: 519,
    powerFactor: 0.95,
    rotorRpm: 15.2,
    gearSpeed: 265,
    generatorRpm: 1620,
    nacellePosition: 238,
    cableWinding: 112,
    windDirection: 235,
    relativeWindDirection: -3,
    pitchAngle: 2.5,
    pitchCylinder1: 152,
    pitchCylinder2: 149,
    pitchCylinder3: 151,
    towerOscillationX: 0.26,
    towerOscillationY: 0.18,
    outdoorTemp: 26,
    trfWindingTempU: 73,
    trfWindingTempV: 75,
    trfWindingTempW: 72,
    nacelleTemp: 42,
    coolCnvHeatExIn: 57,
    coolCnvHeatExOut: 36,
    coolTrfHeatExIn: 52,
    gearOilSumpTemp: 68,
    generatorWindingTempU: 88,
    generatorWindingTempV: 90,
    generatorWindingTempW: 87,
    gearboxTemp: 56,
    generatorTemp: 70,
    transformerTemp: 45,
    hubExhaustTemp: 42,
    hydraulicPressure: 190,
    gearOilPressure: 3.3,
    coolantInletPressure: 1.9,
    coolantOutletPressure: 1.4,
    tempSwCabTower: 34,
    tempSwCabNacelle: 39,
    tempSwCabHub: 36,
    // Component Telemetry
    hubTemperature: 42.5,
    rotorTorque: 175.8,
    rotorDirection: 'CW',
    vibrationLevel: 0.042,
    blade1Pitch: 2.4,
    blade2Pitch: 2.6,
    blade3Pitch: 2.5,
    shaftSpeed: 15.2,
    torqueTransfer: 175.8,
    bearingLoad: 912.5,
    shaftVibration: 0.022,
    shaftAlignment: 0.1,
    bearingTemperature: 52.8,
    lubricationPressure: 3.3,
    axialLoad: 268.4,
    radialLoad: 165.8,
    bearingVibration: 0.028,
    gearboxOilTemp: 68.5,
    gearboxOilPressure: 3.3,
    gearboxVibration: 0.045,
    oilParticleCount: 85,
    oilLevel: 94,
    highSpeedShaftTemp: 38.2,
    couplingCondition: 'GOOD',
    torsionalVibration: 0.005,
    brakePadWear: 12,
    brakeProgram: 200,
    brakeTemperature: 32.8,
    brakeState: 'DISENGAGED',
    generatorEfficiency: 96.5,
    statorTemperature: 78.5,
    rotorTemperature: 65.2,
    dcLinkVoltage: 1050,
    igbtTemperature: 42.8,
    gridSyncStatus: 'SYNCHRONIZED',
    apparentPowerOutput: 1852,
    transformerOilTemp: 48.2,
    coolingState: 'FAN1',
    plcStatus: 'RUNNING',
    upsStatus: 'OK',
    ethernetStatus: 'OK',
    controllerHealth: 98.2,
    bearingTorque: 2.5,
    yawSpeed: 0.15,
    yawMotorSpeed: 12,
    yawMotorCurrent: 4.2,
    lockStatus: 'DISENGAGED',
    serviceMode: false,
    hydraulicPumpState: 'RUNNING',
    valveState: 'OPEN',
    reservoirLevel: 92,
    heatExchangerFanSpeed: 62,
    coolantTemperature: 32.5,
    pumpSpeed: 72,
    gustSpeed: 8.5,
    airDensity: 1.218,
    pitchMotorCurrent1: 2.8,
    pitchMotorCurrent2: 2.9,
    pitchMotorCurrent3: 2.7,
    pitchPressure: 185,
    emergencyFeatherState: 'ARMED',
    strikeCounter: 0,
    groundResistance: 4.0,
    surgeProtectionStatus: 'OK',
    smokeSensor: 'OK',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'NOMINAL',
    gridFrequency: 49.99,
    gridVoltage: 690,
    exportPower: 1850,
    breakerStatus: 'CLOSED',
    lightStatus: 'ON',
    flashMode: 'SYNCHRONIZED',
    upsBackupStatus: 'OK',
    scadaStatus: 'NOMINAL',
    availability: 98.2,
    capacityFactor: 42.5,
    cmsFFTAnalysis: [0.02, 0.04, 0.06, 0.1, 0.15, 0.2, 0.14, 0.08, 0.04, 0.02],
    gearMeshFrequency: 1035,
    bearingPeakFrequency: 145,
  },
  {
    id: 9,
    turbineNo: 'T-09',
    status: 'stopped',
    time: '14:20:00',
    capacity: 2000,
    activePower: 0,
    windSpeed: 10.5,
    breakProgramme: 'Applied',
    operatingMode: 'Manual Stop',
    todayGeneration: 3850,
    totalProduction: 10100,
    totalOperatingHours: 12800,
    totalProductionHours: 11600,
    operationHoursToday: 5.0,
    currentL1: 0,
    currentL2: 0,
    currentL3: 0,
    powerFrequency: 0,
    voltageL1: 0,
    voltageL2: 0,
    voltageL3: 0,
    apparentPower: 0,
    reactivePower: 0,
    powerFactor: 0,
    rotorRpm: 0,
    gearSpeed: 0,
    generatorRpm: 0,
    nacellePosition: 220,
    cableWinding: 95,
    windDirection: 225,
    relativeWindDirection: -5,
    pitchAngle: 90,
    pitchCylinder1: 285,
    pitchCylinder2: 285,
    pitchCylinder3: 285,
    towerOscillationX: 0.03,
    towerOscillationY: 0.02,
    outdoorTemp: 25,
    trfWindingTempU: 36,
    trfWindingTempV: 37,
    trfWindingTempW: 36,
    nacelleTemp: 28,
    coolCnvHeatExIn: 27,
    coolCnvHeatExOut: 24,
    coolTrfHeatExIn: 26,
    gearOilSumpTemp: 35,
    generatorWindingTempU: 30,
    generatorWindingTempV: 31,
    generatorWindingTempW: 30,
    gearboxTemp: 32,
    generatorTemp: 28,
    transformerTemp: 35,
    hubExhaustTemp: 25,
    hydraulicPressure: 170,
    gearOilPressure: 2.7,
    coolantInletPressure: 1.1,
    coolantOutletPressure: 0.8,
    tempSwCabTower: 25,
    tempSwCabNacelle: 28,
    tempSwCabHub: 26,
    // Component Telemetry
    hubTemperature: 28.2,
    rotorTorque: 0,
    rotorDirection: 'CW',
    vibrationLevel: 0.008,
    blade1Pitch: 90,
    blade2Pitch: 90,
    blade3Pitch: 90,
    shaftSpeed: 0,
    torqueTransfer: 0,
    bearingLoad: 38.5,
    shaftVibration: 0.004,
    shaftAlignment: 0.06,
    bearingTemperature: 30.5,
    lubricationPressure: 2.7,
    axialLoad: 25.2,
    radialLoad: 12.5,
    bearingVibration: 0.006,
    gearboxOilTemp: 32.5,
    gearboxOilPressure: 2.7,
    gearboxVibration: 0.008,
    oilParticleCount: 98,
    oilLevel: 92,
    highSpeedShaftTemp: 28.5,
    couplingCondition: 'GOOD',
    torsionalVibration: 0.002,
    brakePadWear: 20,
    brakeProgram: 200,
    brakeTemperature: 28.5,
    brakeState: 'ENGAGED',
    generatorEfficiency: 0,
    statorTemperature: 30.2,
    rotorTemperature: 28.5,
    dcLinkVoltage: 0,
    igbtTemperature: 25.2,
    gridSyncStatus: 'ASYNC',
    apparentPowerOutput: 0,
    transformerOilTemp: 32.5,
    coolingState: 'PUMP',
    plcStatus: 'RUNNING',
    upsStatus: 'OK',
    ethernetStatus: 'OK',
    controllerHealth: 95.2,
    bearingTorque: 0,
    yawSpeed: 0,
    yawMotorSpeed: 0,
    yawMotorCurrent: 0,
    lockStatus: 'DISENGAGED',
    serviceMode: false,
    hydraulicPumpState: 'READY',
    valveState: 'CLOSED',
    reservoirLevel: 90,
    heatExchangerFanSpeed: 28,
    coolantTemperature: 24.5,
    pumpSpeed: 38,
    gustSpeed: 14.2,
    airDensity: 1.218,
    pitchMotorCurrent1: 0,
    pitchMotorCurrent2: 0,
    pitchMotorCurrent3: 0,
    pitchPressure: 170,
    emergencyFeatherState: 'ARMED',
    strikeCounter: 1,
    groundResistance: 4.2,
    surgeProtectionStatus: 'OK',
    smokeSensor: 'OK',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'NOMINAL',
    gridFrequency: 0,
    gridVoltage: 0,
    exportPower: 0,
    breakerStatus: 'OPEN',
    lightStatus: 'OFF',
    flashMode: 'SYNCHRONIZED',
    upsBackupStatus: 'OK',
    scadaStatus: 'OFFLINE',
    availability: 88.5,
    capacityFactor: 0,
    cmsFFTAnalysis: [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.04, 0.03, 0.02, 0.01],
    gearMeshFrequency: 0,
    bearingPeakFrequency: 0,
  },
  {
    id: 10,
    turbineNo: 'T-10',
    status: 'running',
    time: '14:32:42',
    capacity: 2000,
    activePower: 1720,
    windSpeed: 8.0,
    breakProgramme: 'Released',
    operatingMode: 'Grid Connected',
    todayGeneration: 4055,
    totalProduction: 11650,
    totalOperatingHours: 14050,
    totalProductionHours: 12880,
    operationHoursToday: 11.0,
    currentL1: 1434,
    currentL2: 1430,
    currentL3: 1437,
    powerFrequency: 50.01,
    voltageL1: 690,
    voltageL2: 691,
    voltageL3: 690,
    apparentPower: 1811,
    reactivePower: 451,
    powerFactor: 0.95,
    rotorRpm: 13.5,
    gearSpeed: 235,
    generatorRpm: 1460,
    nacellePosition: 258,
    cableWinding: 152,
    windDirection: 255,
    relativeWindDirection: 3,
    pitchAngle: 3.8,
    pitchCylinder1: 137,
    pitchCylinder2: 140,
    pitchCylinder3: 138,
    towerOscillationX: 0.15,
    towerOscillationY: 0.1,
    outdoorTemp: 28,
    trfWindingTempU: 65,
    trfWindingTempV: 67,
    trfWindingTempW: 64,
    nacelleTemp: 37,
    coolCnvHeatExIn: 50,
    coolCnvHeatExOut: 31,
    coolTrfHeatExIn: 46,
    gearOilSumpTemp: 60,
    generatorWindingTempU: 79,
    generatorWindingTempV: 81,
    generatorWindingTempW: 78,
    gearboxTemp: 52,
    generatorTemp: 63,
    transformerTemp: 42,
    hubExhaustTemp: 38,
    hydraulicPressure: 183,
    gearOilPressure: 3.0,
    coolantInletPressure: 1.7,
    coolantOutletPressure: 1.2,
    tempSwCabTower: 31,
    tempSwCabNacelle: 36,
    tempSwCabHub: 33,
    // Component Telemetry
    hubTemperature: 38.0,
    rotorTorque: 148.5,
    rotorDirection: 'CW',
    vibrationLevel: 0.04,
    blade1Pitch: 3.7,
    blade2Pitch: 3.8,
    blade3Pitch: 3.6,
    shaftSpeed: 13.5,
    torqueTransfer: 148.5,
    bearingLoad: 805.2,
    shaftVibration: 0.02,
    shaftAlignment: 0.12,
    bearingTemperature: 42.0,
    lubricationPressure: 3.1,
    axialLoad: 225.5,
    radialLoad: 148.5,
    bearingVibration: 0.03,
    gearboxOilTemp: 53.5,
    gearboxOilPressure: 3.0,
    gearboxVibration: 0.05,
    oilParticleCount: 245,
    oilLevel: 90,
    highSpeedShaftTemp: 46.8,
    couplingCondition: 'GOOD',
    torsionalVibration: 0.01,
    brakePadWear: 15,
    brakeProgram: 200,
    brakeTemperature: 38.0,
    brakeState: 'DISENGAGED',
    generatorEfficiency: 94.2,
    statorTemperature: 77.5,
    rotorTemperature: 64.8,
    dcLinkVoltage: 1035,
    igbtTemperature: 41.5,
    gridSyncStatus: 'SYNCHRONIZED',
    apparentPowerOutput: 1811,
    transformerOilTemp: 46.5,
    coolingState: 'FAN1',
    plcStatus: 'RUNNING',
    upsStatus: 'OK',
    ethernetStatus: 'OK',
    controllerHealth: 98.0,
    bearingTorque: 2.2,
    yawSpeed: 0.13,
    yawMotorSpeed: 10,
    yawMotorCurrent: 4.0,
    lockStatus: 'DISENGAGED',
    serviceMode: false,
    hydraulicPumpState: 'RUNNING',
    valveState: 'OPEN',
    reservoirLevel: 85,
    heatExchangerFanSpeed: 60,
    coolantTemperature: 31.2,
    pumpSpeed: 68,
    gustSpeed: 11.8,
    airDensity: 1.225,
    pitchMotorCurrent1: 2.7,
    pitchMotorCurrent2: 2.9,
    pitchMotorCurrent3: 2.6,
    pitchPressure: 183,
    emergencyFeatherState: 'ARMED',
    strikeCounter: 3,
    groundResistance: 4.4,
    surgeProtectionStatus: 'OK',
    smokeSensor: 'OK',
    heatAlarm: 'OK',
    fireSuppressionState: 'ARMED',
    cmsAlarmSeverity: 'NOMINAL',
    gridFrequency: 50.01,
    gridVoltage: 690,
    exportPower: 1720,
    breakerStatus: 'CLOSED',
    lightStatus: 'FLASHING',
    flashMode: 'SYNCHRONIZED',
    upsBackupStatus: 'OK',
    scadaStatus: 'NOMINAL',
    availability: 98.2,
    capacityFactor: 40.5,
    cmsFFTAnalysis: [],
    gearMeshFrequency: 0,
    bearingPeakFrequency: 0,
  },
];

// ─── Mock Feature Flags Data ───────────────────────────────────────────────────

export const MOCK_FEATURE_FLAGS: FeatureFlagData[] = [
  {
    id: 1,
    name: 'Enable Dark Mode',
    key: 'enable_dark_mode',
    description: 'Dark mode theme for the admin dashboard',
    environment: 'Development',
    status: 'Disabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'AI Chatbot',
    key: 'ai_chatbot',
    description: 'Enable AI chatbot assistance for support',
    environment: 'Production',
    status: 'Enabled',
    roles: ['Admin', 'Consultant'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-03-15T14:30:00Z',
  },
  {
    id: 3,
    name: 'Export Reports',
    key: 'export_reports',
    description: 'Allow users to export reports in PDF, Excel, SVG formats',
    environment: 'Production',
    status: 'Enabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-02-10T16:00:00Z',
  },
  {
    id: 4,
    name: 'Advanced Analytics',
    key: 'advanced_analytics',
    description: 'Show advanced charts and analytics on dashboard',
    environment: 'Development',
    status: 'Enabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 5,
    name: 'Consultant Reports Access',
    key: 'consultant_reports',
    description: 'Allow consultants to view generation reports',
    environment: 'Production',
    status: 'Enabled',
    roles: ['Admin', 'Consultant'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-02-20T09:30:00Z',
    updatedAt: '2026-03-05T11:00:00Z',
  },
  {
    id: 6,
    name: 'Maintenance Notifications',
    key: 'maint_notifications',
    description: 'Send push notifications for scheduled maintenance',
    environment: 'Production',
    status: 'Enabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-10T15:00:00Z',
  },
  {
    id: 7,
    name: 'Turbine Config Wizard',
    key: 'turbine_config_wizard',
    description: 'Step-by-step wizard for turbine configuration',
    environment: 'Development',
    status: 'Disabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 8,
    name: 'PDF Report Templates',
    key: 'pdf_templates',
    description: 'Custom PDF templates for reports',
    environment: 'Development',
    status: 'Disabled',
    roles: ['Admin'],
    createdBy: 1,
    updatedBy: 1,
    createdAt: '2026-03-15T09:00:00Z',
    updatedAt: '2026-03-15T09:00:00Z',
  },
];

import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import dayjs from 'dayjs';

export const FAQ_DATA: FaqCategoryData[] = [
  {
    category: 'Getting Started',
    icon: '🚀',
    questions: [
      {
        q: 'How do I access the admin dashboard?',
        a: 'Navigate to the Dashboard from the sidebar menu. The dashboard provides an overview of all turbines, their status, power generation metrics, and real-time monitoring data.',
      },
      {
        q: 'What are the different user roles available?',
        a: 'The system supports Admin and Consultant roles. Admins have full access to all features including configuration, reports, and user management. Consultants have limited access based on enabled feature flags.',
      },
      {
        q: 'How do I configure turbine parameters?',
        a: 'Go to Turbine Config from the sidebar to view and modify turbine parameters. You can update operational thresholds, maintenance schedules, and monitoring configurations.',
      },
    ],
  },
  {
    category: 'Reports & Analytics',
    icon: '📊',
    questions: [
      {
        q: 'How do I generate a generation report?',
        a: 'Navigate to Generation Reports from the sidebar. Select your date range, filter by turbines, and click Generate Report. You can export reports in various formats.',
      },
      {
        q: 'What data is included in the incentive report?',
        a: 'Incentive reports include actual vs forecast energy generation, FER (Forecast Error Rate) percentages, and calculated incentives based on performance metrics.',
      },
      {
        q: 'Can I schedule automated reports?',
        a: 'Yes, you can set up scheduled report generation from the Reports page. Configure the frequency, recipients, and report format for automated delivery.',
      },
    ],
  },
  {
    category: 'Inventory Management',
    icon: '📦',
    questions: [
      {
        q: 'How do I track inventory items?',
        a: 'Use the Inventory Management section to add, update, and track parts and equipment. Each item can be tagged with categories, locations, and stock levels.',
      },
      {
        q: 'How do I set low-stock alerts?',
        a: 'Set threshold values for each inventory item. When stock falls below the threshold, you will receive notifications in the dashboard and via email.',
      },
    ],
  },
  {
    category: 'Technical Support',
    icon: '🔧',
    questions: [
      {
        q: 'How do I contact technical support?',
        a: 'You can reach our technical support team via email at support@infygen.in or call us during business hours. The Chat Bot is also available 24/7 for immediate assistance.',
      },
      {
        q: 'What information should I include in a support ticket?',
        a: 'Include the turbine ID, error code if any, steps to reproduce the issue, and screenshots if available. This helps our team resolve issues faster.',
      },
      {
        q: 'How long does it take to get a response?',
        a: 'Critical issues are addressed within 2 hours. Standard support requests are typically resolved within 24 business hours.',
      },
    ],
  },
];

export const QUICK_LINKS: QuickLinkData[] = [
  {
    icon: <DescriptionIcon />,
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
    color: '#4f46e5',
    bgColor: 'rgba(79,70,229,0.08)',
  },
  {
    icon: <VideoLibraryIcon />,
    title: 'Video Tutorials',
    description: 'Step-by-step setup and feature walkthroughs',
    color: '#0891b2',
    bgColor: 'rgba(8,145,178,0.08)',
  },
  {
    icon: <ConfirmationNumberIcon />,
    title: 'Submit Ticket',
    description: 'Create a support ticket for specific issues',
    color: '#059669',
    bgColor: 'rgba(5,150,105,0.08)',
  },
  {
    icon: <LiveHelpIcon />,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    color: '#d97706',
    bgColor: 'rgba(217,119,6,0.08)',
  },
];

export const CHAT_SUGGESTIONS = [
  { icon: '💡', text: 'Show turbine status' },
  { icon: '⚡', text: 'How to improve power output?' },
  { icon: '📅', text: 'Maintenance schedule for this week' },
  { icon: '🔧', text: 'Common turbine issues and solutions' },
];

// ─── Report Types ─────────────────────────────────────────────────────────────

export const REPORT_TYPES = [
  'Daily Generation Report',
  'Weekly Generation Report',
  'Monthly Generation Report',
  'Temperature Alerts',
  'Time Series',
  'Multi-Time Analysis (Time Series)',
  'Multi-Scatter 2×2 Pairwise',
  'Heat Map',
  'Day-Wise Maximum',
  'Day-Wise Average',
  'Power Curve',
  'Wind Rose',
  'Generation',
  'Status Timeline',
  'Event Log',
  'Downtime Analysis (MTBF & MTTR)',
  'Machine Availability',
  'Trace Files',
];

// ─── Date Constants ─────────────────────────────────────────────────────────────

export const MIN_DATE = dayjs('2026-01-01');
export const MAX_DATE = dayjs().startOf('day');

// ─── Turbine List ───────────────────────────────────────────────────────────────

export const TURBINE_LIST = [
  'T-01',
  'T-02',
  'T-03',
  'T-04',
  'T-05',
  'T-06',
  'T-07',
  'T-08',
  'T-09',
  'T-10',
];

export const TURBINE_IDS = [
  't01',
  't02',
  't03',
  't04',
  't05',
  't06',
  't07',
  't08',
  't09',
  't10',
] as const;

export const SELECT_ALL_KEY = '__select_all__';

export const DOC_TYPES = [
  { value: 'pdf' as const, label: 'PDF' },
  { value: 'xlsx' as const, label: 'Excel (XLSX)' },
  { value: 'svg' as const, label: 'SVG' },
  { value: 'whatsapp' as const, label: 'WhatsApp' },
];

// ─── Color Constants ───────────────────────────────────────────────────────────

export const TURBINE_COLORS = [
  '#6366f1',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#f97316',
  '#0d9488',
  '#3b82f6',
  '#ec4899',
];

export const DOWNTIME_COLORS = {
  Scheduled: { bg: 'rgba(16,185,129,0.1)', color: '#059669', border: 'rgba(16,185,129,0.35)' },
  Unscheduled: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'rgba(239,68,68,0.35)' },
  'Force Majeure': {
    bg: 'rgba(245,158,11,0.1)',
    color: '#d97706',
    border: 'rgba(245,158,11,0.35)',
  },
  'Grid Fault': { bg: 'rgba(14,165,233,0.1)', color: '#0284c7', border: 'rgba(14,165,233,0.35)' },
  'Communication Loss': {
    bg: 'rgba(124,58,237,0.1)',
    color: '#7c3aed',
    border: 'rgba(124,58,237,0.35)',
  },
};

// ─── Helper Functions ──────────────────────────────────────────────────────────

export const getTurbineById = (id: number): TurbineData | undefined => {
  return MOCK_TURBINE_DATA.find((t) => t.id === id);
};

export const getTurbineByNo = (turbineNo: string): TurbineData | undefined => {
  return MOCK_TURBINE_DATA.find((t) => t.turbineNo === turbineNo);
};

// ─── Use Mock Data Hook (for easy API replacement) ────────────────────────────

/**
 * Hook to use mock turbine data with simulated updates
 * Replace with actual API hook when ready:
 *
 * import { useGetTurbinesQuery } from '@infygen/services';
 * const { data: turbineData = [], isLoading } = useGetTurbinesQuery();
 */
export const useMockTurbineData = () => {
  const [turbineData, setTurbineData] = useState<TurbineData[]>(MOCK_TURBINE_DATA);

  useEffect(() => {
    const id = setInterval(() => {
      setTurbineData((prev) =>
        prev.map((t) => {
          if (t.status === 'running') {
            return {
              ...t,
              time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
              activePower: Math.max(0, t.activePower + (Math.random() - 0.5) * 100),
              windSpeed: Math.max(3, Math.min(25, t.windSpeed + (Math.random() - 0.5) * 0.5)),
              todayGeneration: t.todayGeneration + t.activePower / 3600,
            };
          }
          return { ...t, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) };
        }),
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return { data: turbineData, isLoading: false, isError: false };
};

/**
 * Hook to use mock feature flags
 * Replace with actual API hook when ready:
 *
 * import { useGetFeatureFlagsQuery } from '@infygen/services';
 * const { data: flags = [] } = useGetFeatureFlagsQuery();
 */
export const useMockFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlagData[]>(MOCK_FEATURE_FLAGS);

  return { data: flags, isLoading: false, isError: false };
};

/**
 * Hook to use mock inventory data
 * Replace with actual API hook when ready:
 *
 * import { useGetInventoryQuery } from '@infygen/services';
 * const { data: inventory = [] } = useGetInventoryQuery();
 */
