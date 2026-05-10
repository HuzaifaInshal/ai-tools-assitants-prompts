import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeneratorConfig, CommitPlan } from '@/lib/types';
import { format, subMonths } from 'date-fns';

const today = new Date();
const threeMonthsAgo = subMonths(today, 3);

export const DEFAULT_CONFIG: GeneratorConfig = {
  dateRange: {
    startDate: format(threeMonthsAgo, 'yyyy-MM-dd'),
    endDate: format(today, 'yyyy-MM-dd'),
    skipDates: [],
    skipWeekdays: [],
    weekendBehavior: 'reduced',
  },
  intensity: {
    level: 'moderate',
    minPerDay: 1,
    maxPerDay: 4,
    distributionCurve: 'flat',
    activeDayPercentage: 80,
  },
  time: {
    profile: 'office-hours',
  },
  style: {
    messageStyle: 'conventional',
    conventionalTypes: ['feat', 'fix', 'chore', 'docs', 'refactor'],
    authorName: 'Dev User',
    authorEmail: 'dev@example.com',
    branchName: 'main',
    repoName: 'my-project',
  },
  advanced: {
    seed: '',
    fileChangeMode: 'single-file',
    commitSizeVariance: true,
    includeReadme: true,
    readmeContent: '# my-project\n\nA project with a rich commit history.',
    gpgSign: false,
  },
};

interface GeneratorStore {
  currentStep: number;
  config: GeneratorConfig;
  previewPlan: CommitPlan[];
  isGenerating: boolean;
  generationProgress: number;
  setStep: (step: number) => void;
  updateDateRange: (partial: Partial<GeneratorConfig['dateRange']>) => void;
  updateIntensity: (partial: Partial<GeneratorConfig['intensity']>) => void;
  updateTime: (partial: Partial<GeneratorConfig['time']>) => void;
  updateStyle: (partial: Partial<GeneratorConfig['style']>) => void;
  updateAdvanced: (partial: Partial<GeneratorConfig['advanced']>) => void;
  setPreviewPlan: (plan: CommitPlan[]) => void;
  setIsGenerating: (v: boolean) => void;
  setProgress: (v: number) => void;
  resetConfig: () => void;
}

export const useGeneratorStore = create<GeneratorStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      config: DEFAULT_CONFIG,
      previewPlan: [],
      isGenerating: false,
      generationProgress: 0,
      setStep: (step) => set({ currentStep: step }),
      updateDateRange: (partial) =>
        set((s) => ({ config: { ...s.config, dateRange: { ...s.config.dateRange, ...partial } } })),
      updateIntensity: (partial) =>
        set((s) => ({ config: { ...s.config, intensity: { ...s.config.intensity, ...partial } } })),
      updateTime: (partial) =>
        set((s) => ({ config: { ...s.config, time: { ...s.config.time, ...partial } } })),
      updateStyle: (partial) =>
        set((s) => ({ config: { ...s.config, style: { ...s.config.style, ...partial } } })),
      updateAdvanced: (partial) =>
        set((s) => ({ config: { ...s.config, advanced: { ...s.config.advanced, ...partial } } })),
      setPreviewPlan: (plan) => set({ previewPlan: plan }),
      setIsGenerating: (v) => set({ isGenerating: v }),
      setProgress: (v) => set({ generationProgress: v }),
      resetConfig: () => set({ config: DEFAULT_CONFIG, currentStep: 1, previewPlan: [] }),
    }),
    { name: 'gitpainter-config' }
  )
);
