export type IntensityLevel = 'minimal' | 'light' | 'moderate' | 'heavy' | 'extreme';
export type DistributionCurve = 'flat' | 'ramp-up' | 'ramp-down' | 'bell' | 'random-spikes' | 'custom';
export type TimeOfDayProfile = 'office-hours' | 'night-owl' | 'random' | 'custom';
export type WeekendBehavior = 'skip' | 'reduced' | 'same' | 'only-weekends';
export type CommitMessageStyle = 'random-lorem' | 'conventional' | 'custom-list' | 'simple-counter';

export interface DateRangeConfig {
  startDate: string;
  endDate: string;
  skipDates: string[];
  skipWeekdays: number[];
  weekendBehavior: WeekendBehavior;
}

export interface IntensityConfig {
  level: IntensityLevel;
  minPerDay: number;
  maxPerDay: number;
  distributionCurve: DistributionCurve;
  customCurvePoints?: number[];
  activeDayPercentage: number;
}

export interface TimeConfig {
  profile: TimeOfDayProfile;
  customStartHour?: number;
  customEndHour?: number;
  clusterInMorning?: boolean;
  clusterInEvening?: boolean;
}

export interface CommitStyleConfig {
  messageStyle: CommitMessageStyle;
  customMessages?: string[];
  conventionalTypes?: string[];
  prefix?: string;
  authorName: string;
  authorEmail: string;
  branchName: string;
  repoName: string;
}

export interface AdvancedConfig {
  seed?: string;
  fileChangeMode: 'single-file' | 'multi-file' | 'empty-commits';
  simulatedFileCount?: number;
  commitSizeVariance: boolean;
  includeReadme: boolean;
  readmeContent?: string;
  gpgSign: false;
}

export interface GeneratorConfig {
  dateRange: DateRangeConfig;
  intensity: IntensityConfig;
  time: TimeConfig;
  style: CommitStyleConfig;
  advanced: AdvancedConfig;
}

export interface CommitPlan {
  date: string;
  datetime: Date;
  message: string;
  filesChanged: FileChange[];
}

export interface FileChange {
  path: string;
  content: string;
}

export interface GenerationResult {
  success: boolean;
  commitCount: number;
  daysWithCommits: number;
  zipBlob?: Blob;
  error?: string;
}

export interface ParsedCommit {
  hash: string;
  message: string;
  authorDate: string;
  authorName: string;
  authorEmail: string;
}
