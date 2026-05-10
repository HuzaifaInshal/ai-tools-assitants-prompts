import git from 'isomorphic-git';
import { Volume, createFsFromVolume } from 'memfs';
import { CommitPlan, GeneratorConfig } from './types';

export async function buildGitRepo(
  plan: CommitPlan[],
  config: GeneratorConfig,
  onProgress: (percent: number) => void
): Promise<{ vol: InstanceType<typeof Volume>; repoPath: string }> {
  const vol = new Volume();
  const fs = createFsFromVolume(vol);
  const dir = '/repo';

  // Create directory structure
  await (fs as any).promises.mkdir(dir, { recursive: true });

  await git.init({ fs: fs as any, dir, defaultBranch: 'main' });

  // Set git config
  await git.setConfig({ fs: fs as any, dir, path: 'user.name', value: config.style.authorName });
  await git.setConfig({ fs: fs as any, dir, path: 'user.email', value: config.style.authorEmail });

  // Track existing file contents for multi-file mode (accumulate, not overwrite)
  const fileContents: Map<string, string> = new Map();

  // Initial commit with README if needed
  if (config.advanced.includeReadme) {
    const readmeContent = config.advanced.readmeContent || `# ${config.style.repoName}\n`;
    await (fs as any).promises.writeFile(`${dir}/README.md`, readmeContent, 'utf8');
    await git.add({ fs: fs as any, dir, filepath: 'README.md' });
    fileContents.set('README.md', readmeContent);
  }

  for (let i = 0; i < plan.length; i++) {
    const commit = plan[i];
    const timestamp = Math.floor(commit.datetime.getTime() / 1000);

    for (const change of commit.filesChanged) {
      // Ensure parent directories exist
      const parts = change.path.split('/');
      if (parts.length > 1) {
        const dirPath = `${dir}/${parts.slice(0, -1).join('/')}`;
        await (fs as any).promises.mkdir(dirPath, { recursive: true });
      }

      // Accumulate file content
      const existing = fileContents.get(change.path) || '';
      const newContent = existing + change.content;
      fileContents.set(change.path, newContent);

      await (fs as any).promises.writeFile(`${dir}/${change.path}`, newContent, 'utf8');
      await git.add({ fs: fs as any, dir, filepath: change.path });
    }

    // If no file changes, we need at least one staged file for the commit to work
    const hasChanges = commit.filesChanged.length > 0;
    if (!hasChanges) {
      // Touch a tracking file
      const trackContent = `${timestamp}\n`;
      await (fs as any).promises.writeFile(`${dir}/.gitkeep`, trackContent, 'utf8');
      await git.add({ fs: fs as any, dir, filepath: '.gitkeep' });
    }

    await git.commit({
      fs: fs as any,
      dir,
      message: commit.message,
      author: {
        name: config.style.authorName,
        email: config.style.authorEmail,
        timestamp,
        timezoneOffset: 0,
      },
      committer: {
        name: config.style.authorName,
        email: config.style.authorEmail,
        timestamp,
        timezoneOffset: 0,
      },
    });

    onProgress(Math.round(((i + 1) / plan.length) * 100));
  }

  // Rename branch if needed
  if (config.style.branchName !== 'main') {
    try {
      await git.branch({ fs: fs as any, dir, ref: config.style.branchName });
      await git.deleteBranch({ fs: fs as any, dir, ref: 'main' });
    } catch {
      // ignore branch rename errors
    }
  }

  return { vol, repoPath: dir };
}
