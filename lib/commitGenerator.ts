import seedrandom from 'seedrandom';
import { format, eachDayOfInterval, parseISO, getDay } from 'date-fns';
import {
  GeneratorConfig, CommitPlan, FileChange,
  IntensityConfig, TimeConfig, CommitStyleConfig, AdvancedConfig,
} from './types';

const LOREM_MESSAGES = [
  'refactor authentication module',
  'update dependencies',
  'fix null pointer in user service',
  'add unit tests for payment handler',
  'improve error handling in API layer',
  'optimize database query performance',
  'update README documentation',
  'fix broken CI pipeline',
  'add input validation to forms',
  'resolve merge conflicts',
  'cleanup unused imports',
  'implement retry logic for network requests',
  'fix CSS layout issues on mobile',
  'add logging to critical paths',
  'update environment configuration',
  'refactor data models for clarity',
  'fix race condition in async handler',
  'add pagination to list endpoints',
  'update API response format',
  'fix memory leak in event listeners',
  'implement caching layer',
  'update test fixtures',
  'add type annotations',
  'fix timezone handling',
  'improve loading state UX',
  'add error boundary components',
  'fix edge case in sorting algorithm',
  'update third-party integrations',
  'refactor routing logic',
  'add health check endpoint',
  'fix incorrect status codes',
  'improve code splitting',
  'update security headers',
  'add rate limiting',
  'fix session management bug',
  'refactor service layer',
  'add feature flag support',
  'fix date parsing edge case',
  'improve performance monitoring',
  'update localization strings',
  'fix image optimization pipeline',
  'add webhook support',
  'refactor notification system',
  'fix config loading on startup',
  'add audit logging',
  'update email templates',
  'fix broken link in navigation',
  'improve search functionality',
  'add dark mode support',
  'fix modal accessibility issues',
];

const CONVENTIONAL_SCOPES = [
  'auth', 'api', 'ui', 'db', 'utils', 'config', 'tests', 'docs',
  'core', 'parser', 'router', 'store', 'cache', 'logger', 'worker',
];

const CONVENTIONAL_DESCRIPTIONS = [
  'improve error handling', 'add missing validation', 'fix edge case',
  'refactor for clarity', 'update dependencies', 'add unit tests',
  'optimize performance', 'fix type errors', 'improve documentation',
  'handle null values', 'add retry logic', 'clean up unused code',
  'fix broken tests', 'improve accessibility', 'update configuration',
];

const MULTI_FILES = [
  'src/index.js', 'src/utils.js', 'src/config.js', 'src/helpers.js',
  'src/api.js', 'src/models.js', 'docs/changelog.md',
];

export function generateCommitPlan(config: GeneratorConfig): CommitPlan[] {
  const seed = config.advanced.seed || String(Date.now());
  const rng = seedrandom(seed);

  const allDates = eachDayOfInterval({
    start: parseISO(config.dateRange.startDate),
    end: parseISO(config.dateRange.endDate),
  });

  const skipSet = new Set(config.dateRange.skipDates);
  const skipWeekdaySet = new Set(config.dateRange.skipWeekdays);

  const filterDates = (dates: Date[]) => dates.filter((d) => {
    const dateStr = format(d, 'yyyy-MM-dd');
    if (skipSet.has(dateStr)) return false;
    const dow = getDay(d); // 0=Sun, 6=Sat
    if (skipWeekdaySet.has(dow)) return false;

    const isWeekend = dow === 0 || dow === 6;
    if (isWeekend) {
      if (config.dateRange.weekendBehavior === 'skip') return false;
      if (config.dateRange.weekendBehavior === 'only-weekends') return true;
    } else {
      if (config.dateRange.weekendBehavior === 'only-weekends') return false;
    }
    return true;
  });

  const filteredDates = filterDates(allDates);

  // Apply activeDayPercentage
  const targetActive = Math.round(filteredDates.length * (config.intensity.activeDayPercentage / 100));
  const shuffled = [...filteredDates].sort(() => rng() - 0.5);
  const activeDates = shuffled.slice(0, targetActive).sort((a, b) => a.getTime() - b.getTime());

  const plan: CommitPlan[] = [];
  let commitIndex = 0;

  // First pass: count total commits for simple-counter style
  const rng1 = seedrandom(seed + '-count');
  let totalCommits = 0;
  for (let i = 0; i < activeDates.length; i++) {
    totalCommits += getCommitCountForDay(i, activeDates.length, config.intensity, rng1);
  }

  const rng3 = seedrandom(seed + '-commits');

  for (let i = 0; i < activeDates.length; i++) {
    const d = activeDates[i];
    const count = getCommitCountForDay(i, activeDates.length, config.intensity, rng3);
    for (let c = 0; c < count; c++) {
      const datetime = getRandomTime(format(d, 'yyyy-MM-dd'), config.time, rng3);
      const message = generateCommitMessage(commitIndex, totalCommits, config.style, rng3);
      const filesChanged = generateFileChanges(commitIndex, config.advanced, rng3);
      plan.push({ date: format(d, 'yyyy-MM-dd'), datetime, message, filesChanged });
      commitIndex++;
    }
  }

  return plan.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
}

export function getCommitCountForDay(
  dayIndex: number,
  totalDays: number,
  config: IntensityConfig,
  rng: seedrandom.PRNG
): number {
  const { minPerDay, maxPerDay, distributionCurve } = config;
  const range = maxPerDay - minPerDay;
  let weight = 0.5;

  const progress = totalDays > 1 ? dayIndex / (totalDays - 1) : 0.5;

  switch (distributionCurve) {
    case 'flat':
      weight = rng();
      break;
    case 'ramp-up':
      weight = progress * rng();
      break;
    case 'ramp-down':
      weight = (1 - progress) * rng();
      break;
    case 'bell':
      // Approximate bell: peak at middle
      weight = Math.exp(-Math.pow((progress - 0.5) * 4, 2)) * rng();
      break;
    case 'random-spikes':
      weight = rng() < 0.15 ? rng() * 0.7 + 0.3 : rng() * 0.3;
      break;
    case 'custom':
      if (config.customCurvePoints && config.customCurvePoints.length > 0) {
        const idx = Math.min(Math.floor(progress * config.customCurvePoints.length), config.customCurvePoints.length - 1);
        weight = (config.customCurvePoints[idx] / 100) * rng();
      } else {
        weight = rng();
      }
      break;
  }

  return Math.max(minPerDay, Math.min(maxPerDay, Math.round(minPerDay + weight * range)));
}

export function getRandomTime(date: string, profile: TimeConfig, rng: seedrandom.PRNG): Date {
  const base = parseISO(date);
  let hour: number;
  const minute = Math.floor(rng() * 60);
  const second = Math.floor(rng() * 60);

  switch (profile.profile) {
    case 'office-hours': {
      const slots = [9, 10, 10, 11, 11, 12, 14, 14, 15, 15, 16, 17];
      hour = slots[Math.floor(rng() * slots.length)];
      break;
    }
    case 'night-owl': {
      const nightHours = [20, 21, 22, 23, 0, 1];
      hour = nightHours[Math.floor(rng() * nightHours.length)];
      break;
    }
    case 'random':
      hour = Math.floor(rng() * 24);
      break;
    case 'custom': {
      const start = profile.customStartHour ?? 9;
      const end = profile.customEndHour ?? 18;
      const span = end > start ? end - start : 24 - start + end;
      hour = (start + Math.floor(rng() * span)) % 24;
      break;
    }
    default:
      hour = Math.floor(rng() * 24);
  }

  const result = new Date(base);
  result.setHours(hour, minute, second, 0);
  return result;
}

export function generateCommitMessage(
  index: number,
  total: number,
  config: CommitStyleConfig,
  rng: seedrandom.PRNG
): string {
  let msg = '';

  switch (config.messageStyle) {
    case 'random-lorem':
      msg = LOREM_MESSAGES[Math.floor(rng() * LOREM_MESSAGES.length)];
      break;
    case 'conventional': {
      const types = config.conventionalTypes?.length ? config.conventionalTypes : ['feat', 'fix', 'chore'];
      const type = types[Math.floor(rng() * types.length)];
      const scope = rng() > 0.4 ? CONVENTIONAL_SCOPES[Math.floor(rng() * CONVENTIONAL_SCOPES.length)] : '';
      const desc = CONVENTIONAL_DESCRIPTIONS[Math.floor(rng() * CONVENTIONAL_DESCRIPTIONS.length)];
      msg = scope ? `${type}(${scope}): ${desc}` : `${type}: ${desc}`;
      break;
    }
    case 'custom-list':
      if (config.customMessages?.length) {
        msg = config.customMessages[index % config.customMessages.length];
      } else {
        msg = `commit ${index + 1}`;
      }
      break;
    case 'simple-counter':
      msg = `commit ${index + 1} of ${total}`;
      break;
    default:
      msg = `update ${index + 1}`;
  }

  return config.prefix ? `${config.prefix} ${msg}` : msg;
}

export function generateFileChanges(
  commitIndex: number,
  config: AdvancedConfig,
  rng: seedrandom.PRNG
): FileChange[] {
  if (config.fileChangeMode === 'empty-commits') return [];

  const now = new Date().toISOString();
  const randomId = Math.floor(rng() * 100000);
  const actions = ['completed', 'started', 'updated', 'reviewed', 'merged', 'deployed'];
  const action = actions[Math.floor(rng() * actions.length)];

  if (config.fileChangeMode === 'single-file') {
    const lines = config.commitSizeVariance ? Math.floor(rng() * 5) + 1 : 1;
    const content = Array.from({ length: lines }, (_, i) =>
      `[${now}] task-${randomId + i}: ${action} (commit #${commitIndex})`
    ).join('\n') + '\n';
    return [{ path: 'activity-log.txt', content }];
  }

  // multi-file
  const fileCount = Math.min(config.simulatedFileCount ?? 3, MULTI_FILES.length);
  const fileIdx = commitIndex % fileCount;
  const filePath = MULTI_FILES[fileIdx];
  const content = `// updated at ${now} — build ${randomId}\n`;
  return [{ path: filePath, content }];
}
