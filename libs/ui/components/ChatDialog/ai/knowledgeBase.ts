// ─── Sprint Management AI Assistant Knowledge Base ──────────────────────────

// ─── Intent Categories ─────────────────────────────────────────────────────
type IntentCategory =
  | 'greeting'
  | 'sprint_info'
  | 'velocity_generation'
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
    patterns: ['sprint', 'ticket', 'issue', 'story', 'task', 'backlog', 'board'],
    category: 'sprint_info',
    keywords: [
      'sprint',
      'ticket',
      'issue',
      'story',
      'task',
      'backlog',
      'board',
      'epic',
      'spike',
      'subtask',
    ],
  },
  {
    patterns: ['velocity', 'points', 'capacity', 'burndown', 'commitment', 'completion', 'throughput'],
    category: 'velocity_generation',
    keywords: [
      'velocity',
      'points',
      'capacity',
      'burndown',
      'commitment',
      'completion',
      'throughput',
      'efficiency',
    ],
  },
  {
    patterns: [
      'maintenance',
      'maintain',
      'service',
      'support',
      'refactor',
      'tech debt',
      'bug',
      'defect',
    ],
    category: 'maintenance',
    keywords: [
      'maintenance',
      'maintain',
      'service',
      'support',
      'refactor',
      'tech debt',
      'bug',
      'defect',
      'preventive',
    ],
  },
  {
    patterns: ['status', 'active', 'completed', 'upcoming', 'blocked', 'in progress', 'done', 'todo'],
    category: 'status',
    keywords: [
      'status',
      'active',
      'completed',
      'upcoming',
      'blocked',
      'in progress',
      'done',
      'todo',
      'state',
    ],
  },
  {
    patterns: ['analytics', 'chart', 'graph', 'report', 'data', 'trend', 'performance', 'kpi', 'metric'],
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
    patterns: ['troubleshoot', 'error', 'warning', 'blocker', 'fix', 'resolve', 'help', 'how do i'],
    category: 'troubleshooting',
    keywords: [
      'troubleshoot',
      'error',
      'warning',
      'blocker',
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
      'velocity',
      'burndown',
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
      "Hello! Welcome to SprintPulse Operations Hub. I'm your AI assistant specialized in sprint management. How can I help you today?",
      'Hi there! I can help you with sprint planning, velocity tracking, ticket management, and more. What would you like to know?',
      "Good day! I'm here to assist with agile project management. Ask me about sprints, velocity, ticket workflows, or any system features.",
    ],
    followUp: ['sprint status', 'velocity', 'maintenance'],
  },
  {
    category: 'sprint_info',
    responses: [
      'Sprints in our system follow standard agile practices: time-boxed iterations (typically 2 weeks), a defined backlog, daily standups, and a sprint review. Each sprint is monitored via the Sprint Dashboard for real-time progress.',
      'Our sprints are equipped with comprehensive tracking systems. Key metrics include: Story Points Completed, Sprint Progress (%), Team Velocity, Cycle Time, and Burndown Rate. You can view detailed metrics in the Sprint Detail page.',
      'Sprint specifications include: Sprint Goal, Start/End Dates, Capacity (story points), Team Members, and Definition of Done. Check the Sprint Overview for aggregate statistics.',
    ],
    followUp: ['sprint status', 'velocity', 'sprint metrics'],
  },
  {
    category: 'velocity_generation',
    responses: [
      "Velocity in agile teams measures the amount of work completed in a sprint, typically in story points. Key metrics: Story Points Completed, Sprint Progress (%), Planned vs Actual Velocity. The Velocity Analytics feature shows historical trends.",
      'Team velocity depends on capacity, story point estimates, and historical performance. Healthy teams complete 80-95% of planned points. Use the Sprint Overview to monitor real-time velocity across all sprints.',
      'For velocity calculations, we track Actual vs Planned points. The velocity chart shows trends over multiple sprints to identify patterns and improve forecasting.',
    ],
    followUp: ['sprint status', 'velocity analytics', 'burndown report'],
  },
  {
    category: 'maintenance',
    responses: [
      'Sprint maintenance includes: ✅ Scheduled story grooming (backlog refinement) ✅ Sprint planning sessions ✅ Daily standups ✅ Sprint reviews and retrospectives. Check the Sprint status in the Overview.',
      'Maintenance schedules are critical for sprint success. Common tasks: Backlog grooming, story point re-estimation, blocker resolution, and dependency tracking. Report blockers immediately through the issue tracking system.',
      'For sprint coordination: 1) Check sprint status in Overview 2) Review velocity metrics for anomalies 3) Log sprint activities 4) Update story points completed. Contact your Scrum Master for urgent issues.',
    ],
    followUp: ['sprint status', 'troubleshooting'],
  },
  {
    category: 'status',
    responses: [
      'Sprint status types: 🟢 Active (currently in progress), 🔵 Completed (finished), 🟣 Upcoming (planned), 🔴 Cancelled (stopped). Check Sprint Overview for real-time status.',
      'Current system status shows: Total Sprints, Active count, Blocked count, and Completed count. Click on any sprint in the Overview for detailed metrics and historical data.',
      'Status colors indicate sprint health. Green = active, Blue = completed, Purple = upcoming, Red = cancelled. Use the filter options in the Overview to view specific status types.',
    ],
    followUp: ['sprint details', 'maintenance', 'troubleshooting'],
  },
  {
    category: 'analytics',
    responses: [
      'Velocity Analytics provides: 📊 Stacked bar charts for daily story points by sprint 📈 Line charts for velocity trends 🔍 Date range filtering 📋 Sprint selection. Switch to Velocity Analytics view from the toolbar.',
      'Analytics help identify: ⚡ Peak velocity periods 📉 Underperforming sprints 🌀 Story point estimation accuracy. Export data for external reporting using the Export button.',
      'For custom reports: 1) Select date range 2) Choose sprint(s) 3) Select chart type 4) View aggregated data. KPI cards show Total Points, Peak Velocity, and Average per Day.',
    ],
    followUp: ['velocity analytics', 'reports', 'sprint details'],
  },
  {
    category: 'troubleshooting',
    responses: [
      'For sprint issues: 1) Check Blocked status in Sprint Overview 2) Review velocity metrics for anomalies (low throughput, high cycle time) 3) Note blocker reasons 4) Contact the team. Critical blockers should be escalated immediately.',
      'Common troubleshooting: 🔧 Low velocity → Review story point estimates, check team capacity 🔧 High cycle time → Identify bottlenecks, review WIP limits 🔧 Communication gaps → Check standup frequency. For persistent issues, create a blocker ticket.',
      'Sprint monitoring helps diagnose issues: Velocity drops indicate estimation problems, Cycle time spikes suggest bottlenecks, Burndown deviations point to scope creep. Review Trend data in Sprint Detail for historical patterns.',
    ],
    followUp: ['sprint status', 'maintenance', 'sprint metrics'],
  },
  {
    category: 'system_help',
    responses: [
      'System navigation: 📍 Dashboard (Sprint Overview) - Main monitoring view 📍 Sprint Detail - Individual sprint metrics 📍 Velocity Analytics - Velocity charts 📍 Reports - Business intelligence',
      'Key features: • Real-time sprint monitoring • Velocity analytics • Technical documents repository • User management. Use the sidebar navigation to access all features.',
      'For best practices: ✅ Monitor Sprint Overview daily ✅ Review Velocity Analytics weekly ✅ Check Technical Documents for processes ✅ Document all sprint activities',
    ],
    followUp: ['dashboard', 'velocity analytics', 'reports'],
  },
  {
    category: 'reports',
    responses: [
      'Report types available: 📊 Velocity Analytics - Sprint velocity data 📋 Burndown Report - Sprint progress tracking 📁 Technical Documents - Process guides, specs',
      'Burndown Report calculates: Actual vs Planned story points, daily burndown rate, and sprint completion percentage. Data filtered by date range shows daily, sprint-wise, and summary rows.',
      'For business reporting: Use Velocity Analytics for sprint trends, Burndown Report for progress tracking. Export to PDF/Excel for stakeholder presentations.',
    ],
    followUp: ['velocity analytics', 'burndown report', 'reports'],
  },
  {
    category: 'unknown',
    responses: [
      "I'd be happy to help with sprint management! I can assist with: sprint monitoring, velocity tracking, maintenance schedules, sprint metrics, and system navigation. Could you rephrase your question?",
      "I'm specialized in agile project management. For your query, I need a bit more context. Are you asking about: sprint status, velocity analytics, maintenance, or system navigation?",
      "I understand you're looking for information. Let me help you find it: What specific aspect would you like to explore - sprints, velocity, maintenance, or reports?",
    ],
    followUp: ['sprint status', 'velocity analytics', 'maintenance'],
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

interface SprintContext {
  totalCount: number;
  activeCount: number;
  completedCount: number;
  blockedCount: number;
  upcomingCount: number;
  totalPoints: number;
  avgVelocity: number;
  lowPerformers: string[];
}

function getSprintContext(): SprintContext {
  // Return general sprint context - actual data can be passed via context parameter
  return {
    totalCount: 0,
    activeCount: 0,
    completedCount: 0,
    blockedCount: 0,
    upcomingCount: 0,
    totalPoints: 0,
    avgVelocity: 0,
    lowPerformers: [],
  };
}

function enhanceResponseWithContext(
  baseResponse: string,
  intent: IntentCategory,
  context: SprintContext,
): string {
  let enhanced = baseResponse;

  // Add contextual data based on intent
  if (intent === 'status' && context.totalCount > 0) {
    enhanced += `\n\n📊 Current Status: ${context.activeCount}/${context.totalCount} sprints active, ${context.blockedCount} blocked, ${context.completedCount} completed.`;
  }

  if (intent === 'velocity_generation') {
    enhanced += `\n\n⚡ Current Total Points: ${context.totalPoints.toFixed(0)} story points across ${context.activeCount} sprints.`;
  }

  if (intent === 'troubleshooting' && context.blockedCount > 0) {
    enhanced += `\n\n⚠️ Active blockers detected in: ${context.lowPerformers.join(', ') || 'None'}. Immediate attention recommended.`;
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
  const sprintContext = getSprintContext();

  const suggestions = getFollowUpSuggestions(intent);

  return {
    text: enhanceResponseWithContext(baseResponse, intent, sprintContext),
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
    label: 'Sprint Status',
    icon: 'rocket_launch',
    action: 'sprint_status',
    description: 'View all sprint operational status',
  },
  {
    label: 'Velocity Analytics',
    icon: 'analytics',
    action: 'velocity_analytics',
    description: 'Open velocity charts',
  },
  {
    label: 'Maintenance',
    icon: 'build',
    action: 'maintenance',
    description: 'Check sprint maintenance schedule',
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
