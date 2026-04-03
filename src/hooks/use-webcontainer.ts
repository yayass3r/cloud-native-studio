'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useIDEStore } from '@/store/ide-store';

// Sample project files to boot the WebContainer with
const SAMPLE_FILES: Record<string, string> = {
  'package.json': JSON.stringify({
    name: "cloud-native-project",
    version: "1.0.0",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview"
    },
    dependencies: {},
    devDependencies: {
      vite: "^5.0.0"
    }
  }, null, 2),

  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Cloud Native App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #22d3ee, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p { font-size: 1.2rem; color: #94a3b8; margin-bottom: 2rem; }
    .btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, #22d3ee, #a78bfa);
      color: #0f172a;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(34, 211, 238, 0.3);
    }
    .counter {
      margin-top: 2rem;
      font-size: 2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Cloud Native Studio</h1>
    <p>Built entirely in the browser with WebContainers</p>
    <button class="btn" onclick="increment()">Count: <span id="count">0</span></button>
    <script>
      let count = 0;
      function increment() {
        count++;
        document.getElementById('count').textContent = count;
      }
    </script>
  </div>
</body>
</html>`,

  'vite.config.js': `import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: true
  }
});`,

  'README.md': `# Cloud Native Studio Project

This is a sample project running inside WebContainers.

## Getting Started

The project uses Vite as the development server.
- Run \`npm run dev\` to start the dev server
- The preview will appear in the Live Preview panel

## Features
- Runs entirely in the browser
- No backend server needed
- Hot module replacement
`,
};

export function useWebContainer() {
  const webcontainerInstanceRef = useRef<any>(null);
  const {
    setWebContainerReady,
    setBooting,
    addTerminalOutput,
    setPreviewUrl,
    setFiles,
    setFileContent,
    isWebContainerReady,
  } = useIDEStore();

  const bootWebContainer = useCallback(async () => {
    setBooting(true);
    addTerminalOutput('⏳ جاري تحميل بيئة التطوير...');

    try {
      // Dynamic import for WebContainer API
      const { WebContainer } = await import('@webcontainer/api');

      addTerminalOutput('📦 تم تحميل WebContainer API');

      // Boot the WebContainer
      webcontainerInstanceRef.current = await WebContainer.boot();
      addTerminalOutput('✅ تم تشغيل بيئة WebContainer بنجاح!');

      // Write all sample files
      for (const [path, content] of Object.entries(SAMPLE_FILES)) {
        await webcontainerInstanceRef.current.writeFile(path, content);
        setFileContent(path, content);
      }

      // Build file tree
      const fileTree: any[] = Object.keys(SAMPLE_FILES).map(name => ({
        name,
        path: name,
        type: name.includes('.') ? 'file' : 'directory',
      }));
      setFiles(fileTree);

      addTerminalOutput('📄 تم تحميل ملفات المشروع الأساسية');
      addTerminalOutput('');
      addTerminalOutput('💡 استخدم الأوامر التالية:');
      addTerminalOutput('   npm install    → تثبيت الحزم');
      addTerminalOutput('   npm run dev    → تشغيل خادم التطوير');
      addTerminalOutput('');

      setWebContainerReady(true);
      setBooting(false);

      // Auto-run npm install
      await runCommand('npm install');

    } catch (error: any) {
      addTerminalOutput(`❌ خطأ في تشغيل WebContainer: ${error.message}`);
      setBooting(false);
    }
  }, []);

  const runCommand = useCallback(async (command: string) => {
    const instance = webcontainerInstanceRef.current;
    if (!instance) {
      addTerminalOutput('❌ بيئة التطوير غير جاهزة بعد');
      return;
    }

    addTerminalOutput(`$ ${command}`);

    const process = await instance.spawn(command.split(' ')[0], command.split(' ').slice(1));

    process.output.pipeTo(new WritableStream({
      write(data) {
        addTerminalOutput(data);
      }
    }));

    const exitCode = await process.exit;

    if (exitCode === 0) {
      addTerminalOutput(`✅ تم تنفيذ الأمر بنجاح (exit code: 0)`);

      // If running dev server, capture the URL
      if (command.includes('dev')) {
        instance.on('server-ready', (port: number, url: string) => {
          setPreviewUrl(url);
          addTerminalOutput(`🌐 خادم التطوير جاهز على المنفذ ${port}`);
          addTerminalOutput(`🔗 رابط المعاينة: ${url}`);
        });
      }
    } else {
      addTerminalOutput(`❌ فشل تنفيذ الأمر (exit code: ${exitCode})`);
    }

    return process;
  }, [isWebContainerReady]);

  const writeFile = useCallback(async (path: string, content: string) => {
    const instance = webcontainerInstanceRef.current;
    if (!instance) return;
    await instance.writeFile(path, content);
    setFileContent(path, content);
  }, [setFileContent]);

  useEffect(() => {
    // Auto-boot on mount
    bootWebContainer();
  }, [bootWebContainer]);

  return {
    isWebContainerReady,
    bootWebContainer,
    runCommand,
    writeFile,
    webcontainerInstance: webcontainerInstanceRef,
  };
}
