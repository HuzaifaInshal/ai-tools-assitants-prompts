import JSZip from 'jszip';
import { Volume } from 'memfs';

async function walkDir(
  vol: InstanceType<typeof Volume>,
  currentPath: string,
  zip: JSZip,
  repoName: string,
  repoPath: string
): Promise<void> {
  const entries = await (vol as any).promises.readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = `${currentPath}/${entry.name}`;
    const relativePath = fullPath.slice(repoPath.length + 1);
    const zipPath = `${repoName}/${relativePath}`;

    if (entry.isDirectory()) {
      zip.folder(zipPath);
      await walkDir(vol, fullPath, zip, repoName, repoPath);
    } else {
      const content = await (vol as any).promises.readFile(fullPath);
      zip.file(zipPath, content as Buffer);
    }
  }
}

export async function buildZip(
  vol: InstanceType<typeof Volume>,
  repoPath: string,
  repoName: string
): Promise<Blob> {
  const zip = new JSZip();
  await walkDir(vol, repoPath, zip, repoName, repoPath);
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}
