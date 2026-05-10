'use client';
import { useGeneratorStore } from '@/store/generatorStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CommitMessageStyle } from '@/lib/types';

const MESSAGE_STYLES: { value: CommitMessageStyle; label: string; example: string }[] = [
  { value: 'conventional', label: 'Conventional Commits', example: 'feat(auth): add OAuth support' },
  { value: 'random-lorem', label: 'Random Dev Messages', example: 'refactor authentication module' },
  { value: 'custom-list', label: 'Custom List', example: 'Your custom message 1' },
  { value: 'simple-counter', label: 'Simple Counter', example: 'commit 42 of 100' },
];

const CONV_TYPES = ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'style', 'perf', 'ci', 'build'];

export function StepCommitStyle() {
  const { config, updateStyle } = useGeneratorStore();
  const { style } = config;

  const toggleConvType = (type: string) => {
    const current = style.conventionalTypes || [];
    updateStyle({
      conventionalTypes: current.includes(type) ? current.filter((t) => t !== type) : [...current, type],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Commit Style</h2>
        <p className="text-sm text-muted-foreground">Author info and message format</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Author Name</Label>
          <Input
            value={style.authorName}
            onChange={(e) => updateStyle({ authorName: e.target.value })}
            placeholder="Your Name"
          />
        </div>
        <div className="space-y-1">
          <Label>Author Email</Label>
          <Input
            type="email"
            value={style.authorEmail}
            onChange={(e) => updateStyle({ authorEmail: e.target.value })}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <p className="text-xs text-amber-600">Email must match your GitHub account for contributions to count</p>

      <div className="space-y-2">
        <Label>Commit Message Style</Label>
        <div className="grid grid-cols-2 gap-2">
          {MESSAGE_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateStyle({ messageStyle: s.value })}
              className={`p-3 rounded border text-sm text-left space-y-1 transition-colors ${
                style.messageStyle === s.value
                  ? 'border-primary bg-primary/5 font-medium'
                  : 'border-border hover:bg-accent'
              }`}
            >
              <div className="font-medium">{s.label}</div>
              <div className="text-xs text-muted-foreground font-mono">{s.example}</div>
            </button>
          ))}
        </div>
      </div>

      {style.messageStyle === 'conventional' && (
        <div className="space-y-2">
          <Label>Commit Types</Label>
          <div className="flex flex-wrap gap-2">
            {CONV_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleConvType(t)}
                className={`px-3 py-1 rounded text-sm border transition-colors ${
                  (style.conventionalTypes || []).includes(t)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {style.messageStyle === 'custom-list' && (
        <div className="space-y-1">
          <Label>Custom Messages (one per line)</Label>
          <textarea
            className="w-full h-32 p-2 border rounded text-sm font-mono resize-none bg-background"
            value={(style.customMessages || []).join('\n')}
            onChange={(e) => updateStyle({ customMessages: e.target.value.split('\n').filter(Boolean) })}
            placeholder="fix login bug&#10;add dark mode&#10;update docs"
          />
        </div>
      )}

      <div className="space-y-1">
        <Label>Message Prefix (optional)</Label>
        <Input
          value={style.prefix || ''}
          onChange={(e) => updateStyle({ prefix: e.target.value })}
          placeholder="e.g. [WIP]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Branch Name</Label>
          <Input
            value={style.branchName}
            onChange={(e) => updateStyle({ branchName: e.target.value })}
            placeholder="main"
          />
        </div>
        <div className="space-y-1">
          <Label>Repo/Folder Name</Label>
          <Input
            value={style.repoName}
            onChange={(e) => updateStyle({ repoName: e.target.value })}
            placeholder="my-project"
          />
        </div>
      </div>
    </div>
  );
}
