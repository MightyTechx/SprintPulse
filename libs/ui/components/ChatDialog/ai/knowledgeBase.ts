// ─── Wind Energy AI Assistant Knowledge Base ─────────────────────────────────

// ─── Intent Categories ─────────────────────────────────────────────────────
type IntentCategory =
  | 'greeting'
  | 'turbine_info'
  | 'power_generation'
  | 'maintenance'
  | 'status'
  | 'analytics'
  | 'troubleshooting'
  | 'system_help'
  | 'reports'
  | 'unknown';

// ─── Intent Patterns ───────────────────────────────────────────────────────
interface IntentPattern {
  patterns: string[];
  category: IntentCategory;
  keywords: string[];
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
    category: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'greetings', 'start'],
  },
  {
    patterns: ['turbine', 'wtg', 'wind turbine', 'generator', 'rotor', 'blade', 'nacelle'],
    category: 'turbine_info',
    keywords: [
      'turbine',
      'wtg',
      'wind turbine',
      'generator',
      'rotor',
      'blade',
      'nacelle',
      'pitch',
      'yaw',
      'gearbox',
    ],
  },
  {
    patterns: ['power', 'generation', 'mw', 'kwh', 'output', 'energy', 'active power', 'capacity'],
    category: 'power_generation',
    keywords: [
      'power',
      'generation',
      'mw',
      'kwh',
      'output',
      'energy',
      'active',
      'capacity',
      'efficiency',
    ],
  },
  {
    patterns: [
      'maintenance',
      'maintain',
      'service',
      'repair',
      'breakdown',
      'fault',
      'issue',
      'problem',
    ],
    category: 'maintenance',
    keywords: [
      'maintenance',
      'maintain',
      'service',
      'repair',
      'breakdown',
      'fault',
      'issue',
      'problem',
      'preventive',
    ],
  },
  {
    patterns: ['status', 'running', 'stopped', 'standby', 'fault', 'online', 'offline', 'working'],
    category: 'status',
    keywords: [
      'status',
      'running',
      'stopped',
      'standby',
      'fault',
      'online',
      'offline',
      'working',
      'state',
    ],
  },
  {
    patterns: ['analytics', 'chart', 'graph', 'report', 'data', 'trend', 'performance', 'kpi'],
    category: 'analytics',
    keywords: [
      'analytics',
      'chart',
      'graph',
      'report',
      'data',
      'trend',
      'performance',
      'kpi',
      'metric',
    ],
  },
  {
    patterns: ['troubleshoot', 'error', 'warning', 'alert', 'fix', 'resolve', 'help', 'how do i'],
    category: 'troubleshooting',
    keywords: [
      'troubleshoot',
      'error',
      'warning',
      'alert',
      'fix',
      'resolve',
      'help',
      'how',
      'why',
      'diagnose',
    ],
  },
  {
    patterns: ['how to', 'navigate', 'find', 'where', 'access', 'use', 'dashboard', 'feature'],
    category: 'system_help',
    keywords: [
      'how to',
      'navigate',
      'find',
      'where',
      'access',
      'use',
      'dashboard',
      'feature',
      'menu',
      'page',
    ],
  },
  {
    patterns: ['report', 'export', 'download', 'summary', 'daily', 'monthly', 'weekly'],
    category: 'reports',
    keywords: [
      'report',
      'export',
      'download',
      'summary',
      'daily',
      'monthly',
      'weekly',
      'incentive',
      'fer',
    ],
  },
];

// ─── Knowledge Base Responses ───────────────────────────────────────────────
interface ResponseTemplate {
  category: IntentCategory;
  responses: string[];
  followUp?: string[];
}

const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  {
    category: 'greeting',
    responses: [
      "Hello! Welcome to Sprint Pulse Operations Hub. I'm your AI assistant specialized in wind turbine operations. How can I help you today?",
      'Hi there! I can help you with turbine monitoring, maintenance schedules, power analytics, and more. What would you like to know?',
      "Good day! I'm here to assist with wind farm operations. Ask me about turbines, power generation, maintenance, or any system features.",
    ],
    followUp: ['turbine status', 'power generation', 'maintenance'],
  },
  {
    category: 'turbine_info',
    responses: [
      'Wind turbines in our system consist of key components: rotor blades (capture wind energy), nacelle (houses generator), tower (supports the assembly), and control systems. Each WTG unit is monitored via SCADA for real-time parameters.',
      'Our wind turbines are equipped with advanced monitoring systems. Key parameters include: Active Power (kW), Wind Speed (m/s), Rotor RPM, Gearbox Temperature, and Power Factor. You can view detailed parameters in the Turbine Detail page.',
      'Turbine specifications vary by model, but typical parameters include: Hub Height, Rotor Diameter, Cut-in/Cut-out Wind Speed, Rated Capacity, and Availability Factor. Check the Fleet Overview for aggregate statistics.',
    ],
    followUp: ['turbine status', 'power generation', 'SCADA parameters'],
  },
  {
    category: 'power_generation',
    responses: [
      "Power generation in wind turbines converts kinetic energy from wind to electrical energy. Key metrics: Active Power (kW), Today's Generation (kWh), Total Production (MWh). The Power Analytics feature shows historical generation trends.",
      'Energy production depends on wind speed - turbines generate power between cut-in (~3 m/s) and cut-out (~25 m/s) wind speeds. Peak output occurs around 12-15 m/s. Use the Fleet Overview to monitor real-time power across all turbines.',
      'For incentive calculations, we track Actual vs Forecast generation. The FER (Forecast Error Rate) and incentive amounts are calculated based on the renewable energy certificate requirements.',
    ],
    followUp: ['turbine status', 'power analytics', 'incentive report'],
  },
  {
    category: 'maintenance',
    responses: [
      'Wind turbine maintenance includes: ✅ Scheduled preventive maintenance (oil changes, inspections) ✅ Corrective maintenance (fault repair) ✅ Condition monitoring (vibration, temperature analysis). Check the Maintenance status in Fleet Overview.',
      'Maintenance schedules are critical for turbine reliability. Common tasks: Gearbox oil replacement (~8000 hours), brake pad inspection, pitch system calibration, and control system updates. Report issues immediately through the fault reporting system.',
      'For maintenance coordination: 1) Check turbine status in Fleet Overview 2) Review SCADA parameters for anomalies 3) Log maintenance activities 4) Update spare parts used. Contact your maintenance coordinator for urgent issues.',
    ],
    followUp: ['turbine status', 'troubleshooting'],
  },
  {
    category: 'status',
    responses: [
      'Turbine status types: 🟢 Running (generating power), 🔴 Stopped (no wind or manual stop), 🟡 Standby (ready to start), 🔴 Fault (requires attention), 🟠 Maintenance (scheduled service). Check Fleet Overview for real-time status.',
      'Current system status shows: Total Turbines, Running count, Fault count, and Maintenance count. Click on any turbine in Fleet Overview for detailed SCADA parameters and historical data.',
      'Status colors indicate turbine health. Green = operational, Yellow = transitional states, Red = stopped/fault. Use the filter options in Fleet Overview to view specific status types.',
    ],
    followUp: ['turbine details', 'maintenance', 'troubleshooting'],
  },
  {
    category: 'analytics',
    responses: [
      'Power Analytics provides: 📊 Stacked bar charts for daily energy generation by turbine 📈 Line charts for generation trends 🔍 Date range filtering 📋 Turbine selection. Switch to Power Analytics view from the toolbar.',
      'Analytics help identify: ⚡ Peak generation periods 📉 Underperforming turbines 🌀 Wind pattern correlations. Export data for external reporting using the Export button.',
      'For custom reports: 1) Select date range 2) Choose turbine(s) 3) Select chart type 4) View aggregated data. KPI cards show Total Energy, Peak Output, and Average per Day.',
    ],
    followUp: ['power analytics', 'reports', 'turbine details'],
  },
  {
    category: 'troubleshooting',
    responses: [
      'For turbine issues: 1) Check Fault status in Fleet Overview 2) Review SCADA parameters for anomalies (temperature, vibration, pressure) 3) Note error codes 4) Contact maintenance team. Critical faults should be escalated immediately.',
      'Common troubleshooting: 🔧 High gearbox temp → Check cooling system, oil levels 🔧 Low power output → Verify wind speed, check blade pitch 🔧 Communication loss → Check network connections. For persistent issues, create a maintenance ticket.',
      'SCADA monitoring helps diagnose issues: Temperature alerts indicate cooling problems, Pressure deviations suggest hydraulic issues, Oscillation warnings point to structural concerns. Review Trend data in Turbine Detail for historical patterns.',
    ],
    followUp: ['turbine status', 'maintenance', 'SCADA parameters'],
  },
  {
    category: 'system_help',
    responses: [
      'System navigation: 📍 Dashboard (Fleet Overview) - Main monitoring view 📍 Turbine Detail - Individual turbine SCADA data 📍 Power Analytics - Generation charts 📍 Reports - Business intelligence',
      'Key features: • Real-time turbine monitoring • Power generation analytics • Technical documents repository • User management. Use the sidebar navigation to access all features.',
      'For best practices: ✅ Monitor Fleet Overview daily ✅ Review Power Analytics weekly ✅ Check Technical Documents for specs ✅ Document all maintenance activities',
    ],
    followUp: ['dashboard', 'power analytics', 'reports'],
  },
  {
    category: 'reports',
    responses: [
      'Report types available: 📊 Power Analytics - Energy generation data 📋 Incentive Report - FER and incentive calculations 📁 Technical Documents - Manuals, specs',
      'Incentive Report calculates: Actual vs Forecast generation, FER (Forecast Error Rate %), and incentive amounts in M.KRW. Data filtered by date range shows daily, monthly, and summary rows.',
      'For business reporting: Use Power Analytics for generation trends, Incentive Report for certificate calculations. Export to PDF/Excel for stakeholder presentations.',
    ],
    followUp: ['power analytics', 'incentive report', 'reports'],
  },
  {
    category: 'unknown',
    responses: [
      "I'd be happy to help with wind turbine operations! I can assist with: turbine monitoring, power generation, maintenance schedules, SCADA parameters, and system navigation. Could you rephrase your question?",
      "I'm specialized in wind energy operations. For your query, I need a bit more context. Are you asking about: turbine status, power analytics, maintenance, or system navigation?",
      "I understand you're looking for information. Let me help you find it: What specific aspect would you like to explore - turbines, power, maintenance, or reports?",
    ],
    followUp: ['turbine status', 'power analytics', 'maintenance'],
  },
];

// ─── Utility Functions ───────────────────────────────────────────────────────

function detectIntent(userMessage: string): IntentCategory {
  const normalizedMessage = userMessage.toLowerCase();

  // Score each intent pattern
  let bestMatch: IntentPattern | null = null;
  let bestScore = 0;

  for (const pattern of INTENT_PATTERNS) {
    let score = 0;

    // Check patterns
    for (const p of pattern.patterns) {
      if (normalizedMessage.includes(p)) {
        score += 2;
      }
    }

    // Check keywords
    for (const keyword of pattern.keywords) {
      if (normalizedMessage.includes(keyword)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = pattern;
    }
  }

  return bestMatch?.category || 'unknown';
}

function getResponseForIntent(category: IntentCategory): string {
  const templates = RESPONSE_TEMPLATES.find((t) => t.category === category);
  if (!templates) {
    return RESPONSE_TEMPLATES.find((t) => t.category === 'unknown')?.responses[0] || '';
  }

  const randomIndex = Math.floor(Math.random() * templates.responses.length);
  return templates.responses[randomIndex];
}

function getFollowUpSuggestions(category: IntentCategory): string[] {
  const templates = RESPONSE_TEMPLATES.find((t) => t.category === category);
  return templates?.followUp || RESPONSE_TEMPLATES[0].followUp || [];
}

// ─── Contextual Data Integration ─────────────────────────────────────────────

interface TurbineContext {
  totalCount: number;
  runningCount: number;
  stoppedCount: number;
  faultCount: number;
  maintenanceCount: number;
  totalPower: number;
  avgWindSpeed: number;
  lowStockItems: string[];
}

function getTurbineContext(): TurbineContext {
  // Return general turbine context - actual data can be passed via context parameter
  return {
    totalCount: 0,
    runningCount: 0,
    stoppedCount: 0,
    faultCount: 0,
    maintenanceCount: 0,
    totalPower: 0,
    avgWindSpeed: 0,
    lowStockItems: [],
  };
}

function enhanceResponseWithContext(
  baseResponse: string,
  intent: IntentCategory,
  context: TurbineContext,
): string {
  let enhanced = baseResponse;

  // Add contextual data based on intent
  if (intent === 'status' && context.totalCount > 0) {
    enhanced += `\n\n📊 Current Status: ${context.runningCount}/${context.totalCount} turbines running, ${context.faultCount} faults, ${context.maintenanceCount} in maintenance.`;
  }

  if (intent === 'power_generation') {
    enhanced += `\n\n⚡ Current Total Power: ${context.totalPower.toFixed(0)} kW across ${context.runningCount} turbines.`;
  }

  if (intent === 'troubleshooting' && context.faultCount > 0) {
    enhanced += `\n\n⚠️ Active faults detected in: ${context.lowStockItems.join(', ') || 'None'}. Immediate attention recommended.`;
  }

  return enhanced;
}

// ─── Main AI Response Generator ─────────────────────────────────────────────

interface AIResponse {
  text: string;
  suggestions: string[];
  context?: string;
}

export function generateAIResponse(userMessage: string): AIResponse {
  const intent = detectIntent(userMessage);
  const baseResponse = getResponseForIntent(intent);
  const turbineContext = getTurbineContext();

  const suggestions = getFollowUpSuggestions(intent);

  return {
    text: enhanceResponseWithContext(baseResponse, intent, turbineContext),
    suggestions,
  };
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

interface QuickAction {
  label: string;
  icon: string;
  action: string;
  description: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Turbine Status',
    icon: 'wind_power',
    action: 'turbine_status',
    description: 'View all turbine operational status',
  },
  {
    label: 'Power Analytics',
    icon: 'analytics',
    action: 'power_analytics',
    description: 'Open power generation charts',
  },
  {
    label: 'Maintenance',
    icon: 'build',
    action: 'maintenance',
    description: 'Check maintenance schedule',
  },
  {
    label: 'Reports',
    icon: 'description',
    action: 'reports',
    description: 'Access business reports',
  },
  {
    label: 'Help',
    icon: 'help',
    action: 'help',
    description: 'System navigation guide',
  },
];

// ─── Export for use ─────────────────────────────────────────────────────────

export type { IntentCategory, AIResponse };
