import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { Volume, createFsFromVolume } from 'memfs';
import git from 'isomorphic-git';
import { ParsedCommit } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const vol = new Volume();
    const fs = createFsFromVolume(vol);

    // Find the .git folder in the zip
    let gitPrefix = '';
    zip.forEach((path) => {
      if (path.endsWith('.git/') || path.includes('/.git/')) {
        const match = path.match(/^(.*?)\.git\//);
        if (match) gitPrefix = match[1];
      }
    });

    const dir = '/repo';
    await (fs as any).promises.mkdir(`${dir}/.git`, { recursive: true });

    // Extract zip contents into memfs
    const promises: Promise<void>[] = [];
    zip.forEach((relativePath, zipEntry) => {
      if (zipEntry.dir) return;
      const targetPath = `${dir}/${relativePath.slice(gitPrefix.length)}`;
      promises.push(
        zipEntry.async('nodebuffer').then(async (content) => {
          const parts = targetPath.split('/');
          const dirPath = parts.slice(0, -1).join('/');
          await (fs as any).promises.mkdir(dirPath, { recursive: true });
          await (fs as any).promises.writeFile(targetPath, content);
        })
      );
    });
    await Promise.all(promises);

    const commits = await git.log({ fs: fs as any, dir });
    const result: ParsedCommit[] = commits.map((c) => ({
      hash: c.oid,
      message: c.commit.message.trim(),
      authorDate: new Date(c.commit.author.timestamp * 1000).toISOString(),
      authorName: c.commit.author.name,
      authorEmail: c.commit.author.email,
    }));

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
