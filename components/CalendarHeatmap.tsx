'use client';
import { useMemo } from 'react';
import { CommitPlan } from '@/lib/types';
import { format, addDays, eachWeekOfInterval, parseISO } from 'date-fns';

interface Props {
  plan: CommitPlan[];
  startDate: string;
  endDate: string;
  skipDates?: string[];
}

function getColor(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
  if (count <= 2) return 'bg-green-200 dark:bg-green-900';
  if (count <= 5) return 'bg-green-400 dark:bg-green-600';
  if (count <= 9) return 'bg-green-600 dark:bg-green-400';
  return 'bg-green-800 dark:bg-green-300';
}

export function CalendarHeatmap({ plan, startDate, endDate, skipDates = [] }: Props) {
  const { weeks, skipSet } = useMemo(() => {
    const commitMap = new Map<string, number>();
    for (const c of plan) {
      commitMap.set(c.date, (commitMap.get(c.date) || 0) + 1);
    }
    const skipSet = new Set(skipDates);

    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const weekStarts = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });

    const weeks = weekStarts.map((weekStart) =>
      Array.from({ length: 7 }, (_, i) => {
        const day = addDays(weekStart, i);
        const dateStr = format(day, 'yyyy-MM-dd');
        return {
          date: dateStr,
          count: commitMap.get(dateStr) || 0,
          inRange: day >= start && day <= end,
          skipped: skipSet.has(dateStr),
        };
      })
    );

    return { weeks, commitMap, skipSet };
  }, [plan, startDate, endDate, skipDates]);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.inRange ? `${day.date} — ${day.count} commit${day.count !== 1 ? 's' : ''}` : ''}
                className={`w-3 h-3 rounded-sm ${
                  !day.inRange
                    ? 'bg-transparent'
                    : day.skipped
                    ? 'bg-red-200 dark:bg-red-900'
                    : getColor(day.count)
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
        <span>Less</span>
        {['bg-gray-100 dark:bg-gray-800', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'].map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
