'use client';
import { useGeneratorStore } from '@/store/generatorStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format, subDays, subMonths, subYears } from 'date-fns';

const QUICK_RANGES = [
  { label: 'Last 30 days', start: () => subDays(new Date(), 30) },
  { label: 'Last 3 months', start: () => subMonths(new Date(), 3) },
  { label: 'Last 6 months', start: () => subMonths(new Date(), 6) },
  { label: 'Last year', start: () => subYears(new Date(), 1) },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKEND_OPTIONS = [
  { value: 'skip', label: 'Skip weekends' },
  { value: 'reduced', label: 'Reduced activity' },
  { value: 'same', label: 'Same as weekdays' },
  { value: 'only-weekends', label: 'Weekends only' },
] as const;

export function StepDateRange() {
  const { config, updateDateRange } = useGeneratorStore();
  const { dateRange } = config;

  const today = format(new Date(), 'yyyy-MM-dd');

  const totalDays = (() => {
    const s = new Date(dateRange.startDate);
    const e = new Date(dateRange.endDate);
    return Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
  })();

  const toggleWeekday = (dow: number) => {
    const current = dateRange.skipWeekdays;
    updateDateRange({
      skipWeekdays: current.includes(dow) ? current.filter((d) => d !== dow) : [...current, dow],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Date Range</h2>
        <p className="text-sm text-muted-foreground">Choose when your commits should appear</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_RANGES.map((r) => (
          <Button
            key={r.label}
            variant="outline"
            size="sm"
            onClick={() =>
              updateDateRange({
                startDate: format(r.start(), 'yyyy-MM-dd'),
                endDate: today,
              })
            }
          >
            {r.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={dateRange.startDate}
            max={dateRange.endDate}
            onChange={(e) => updateDateRange({ startDate: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>End Date</Label>
          <Input
            type="date"
            value={dateRange.endDate}
            min={dateRange.startDate}
            max={today}
            onChange={(e) => updateDateRange({ endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Skip Weekdays</Label>
        <div className="flex gap-2 flex-wrap">
          {WEEKDAYS.map((day, i) => (
            <button
              key={day}
              onClick={() => toggleWeekday(i)}
              className={`px-3 py-1 rounded text-sm border transition-colors ${
                dateRange.skipWeekdays.includes(i)
                  ? 'bg-red-100 border-red-300 text-red-700'
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Weekend Behavior</Label>
        <div className="grid grid-cols-2 gap-2">
          {WEEKEND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateDateRange({ weekendBehavior: opt.value })}
              className={`p-3 rounded border text-sm text-left transition-colors ${
                dateRange.weekendBehavior === opt.value
                  ? 'border-primary bg-primary/5 font-medium'
                  : 'border-border hover:bg-accent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-muted rounded text-sm">
        <span className="font-medium">{totalDays} total days</span>
        {dateRange.skipDates.length > 0 && (
          <span className="text-muted-foreground ml-2">· {dateRange.skipDates.length} skipped</span>
        )}
      </div>
    </div>
  );
}
