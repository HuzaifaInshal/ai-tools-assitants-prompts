'use client';
import { useEffect, useCallback } from 'react';
import { useGeneratorStore } from '@/store/generatorStore';
import { generateCommitPlan } from '@/lib/commitGenerator';
import { StepDateRange } from '@/components/steps/StepDateRange';
import { StepIntensity } from '@/components/steps/StepIntensity';
import { StepCommitStyle } from '@/components/steps/StepCommitStyle';
import { StepAdvanced } from '@/components/steps/StepAdvanced';
import { StepReview } from '@/components/steps/StepReview';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { Button } from '@/components/ui/button';

const STEPS = [
  { number: 1, label: 'Date Range' },
  { number: 2, label: 'Intensity' },
  { number: 3, label: 'Style' },
  { number: 4, label: 'Advanced' },
  { number: 5, label: 'Review' },
];

function StepComponent({ step }: { step: number }) {
  switch (step) {
    case 1: return <StepDateRange />;
    case 2: return <StepIntensity />;
    case 3: return <StepCommitStyle />;
    case 4: return <StepAdvanced />;
    case 5: return <StepReview />;
    default: return <StepDateRange />;
  }
}

export default function Home() {
  const { currentStep, setStep, config, previewPlan, setPreviewPlan } = useGeneratorStore();

  const updatePreview = useCallback(() => {
    try {
      const plan = generateCommitPlan(config);
      setPreviewPlan(plan);
    } catch {
      // ignore preview errors
    }
  }, [config, setPreviewPlan]);

  useEffect(() => {
    const timer = setTimeout(updatePreview, 300);
    return () => clearTimeout(timer);
  }, [updatePreview]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">GitPainter</h1>
            <p className="text-xs text-muted-foreground">Paint your GitHub contribution graph</p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-48 shrink-0 gap-1">
          {STEPS.map((s) => (
            <button
              key={s.number}
              onClick={() => setStep(s.number)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-left transition-colors ${
                currentStep === s.number
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  currentStep === s.number ? 'bg-primary-foreground text-primary' : 'bg-muted'
                }`}
              >
                {s.number}
              </span>
              {s.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile step tabs */}
          <div className="flex md:hidden gap-1 mb-4 overflow-x-auto pb-1">
            {STEPS.map((s) => (
              <button
                key={s.number}
                onClick={() => setStep(s.number)}
                className={`px-3 py-1 rounded text-xs shrink-0 ${
                  currentStep === s.number ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="border rounded-lg p-6">
            <StepComponent step={currentStep} />
          </div>

          {/* Navigation */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button onClick={() => setStep(Math.min(5, currentStep + 1))}>
                Next
              </Button>
            </div>
          )}
        </main>

        {/* Live preview panel */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="border rounded-lg p-4 sticky top-20">
            <h3 className="text-sm font-medium mb-3">Live Preview</h3>
            <CalendarHeatmap
              plan={previewPlan}
              startDate={config.dateRange.startDate}
              endDate={config.dateRange.endDate}
              skipDates={config.dateRange.skipDates}
            />
            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <div>{previewPlan.length} commits planned</div>
              <div>{new Set(previewPlan.map((c) => c.date)).size} active days</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
