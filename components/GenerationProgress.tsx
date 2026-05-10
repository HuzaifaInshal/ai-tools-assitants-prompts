'use client';
import { Progress } from '@/components/ui/progress';

interface Props {
  progress: number;
  commitCount?: number;
  total?: number;
}

function getStatusMessage(progress: number, commitCount?: number, total?: number): string {
  if (progress === 0) return 'Initializing repository...';
  if (progress < 10) return 'Setting up git configuration...';
  if (progress < 95) return `Writing commits... (${commitCount ?? '?'}/${total ?? '?'})`;
  if (progress < 100) return 'Packaging zip file...';
  return 'Done!';
}

export function GenerationProgress({ progress, commitCount, total }: Props) {
  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-3" />
      <p className="text-sm text-muted-foreground text-center">
        {getStatusMessage(progress, commitCount, total)}
      </p>
    </div>
  );
}
