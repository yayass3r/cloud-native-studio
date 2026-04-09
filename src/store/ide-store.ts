import { create } from 'zustand';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
}

export type MobileTab = 'editor' | 'files' | 'preview' | 'terminal' | 'ai';

interface IDEState {
  // File system
  files: FileNode[];
  activeFilePath: string | null;
  fileContents: Record<string, string>;

  // Terminal
  terminalOutput: string[];

  // Preview
  previewUrl: string | null;

  // AI Chat
  chatMessages: { role: 'user' | 'assistant'; content: string }[];
  isAIChatOpen: boolean;

  // WebContainer
  isWebContainerReady: boolean;
  isBooting: boolean;
  // Store WebContainer instance and running process references
  webcontainerInstance: any;
  runningProcess: any;

  // Mobile Navigation
  mobileActiveTab: MobileTab;

  // Actions
  setActiveFile: (path: string) => void;
  setFileContent: (path: string, content: string) => void;
  addTerminalOutput: (output: string) => void;
  clearTerminal: () => void;
  setPreviewUrl: (url: string | null) => void;
  addChatMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
  toggleAIChat: () => void;
  setWebContainerReady: (ready: boolean) => void;
  setBooting: (booting: boolean) => void;
  setFiles: (files: FileNode[]) => void;
  setMobileActiveTab: (tab: MobileTab) => void;
  setWebcontainerInstance: (instance: any) => void;
  setRunningProcess: (process: any) => void;
}

export const useIDEStore = create<IDEState>((set) => ({
  files: [],
  activeFilePath: null,
  fileContents: {},
  terminalOutput: [],
  previewUrl: null,
  chatMessages: [
    { role: 'assistant', content: 'مرحبًا! أنا مساعدك الذكي في Cloud-Native Studio. يمكنني مساعدتك في كتابة الكود، تصحيح الأخطاء، والإجابة على أسئلتك البرمجية. كيف يمكنني مساعدتك اليوم؟ 🚀' }
  ],
  isAIChatOpen: true,
  isWebContainerReady: false,
  isBooting: false,
  mobileActiveTab: 'editor',
  webcontainerInstance: null,
  runningProcess: null,

  setActiveFile: (path) => set({ activeFilePath: path }),
  setFileContent: (path, content) => set((state) => ({
    fileContents: { ...state.fileContents, [path]: content }
  })),
  addTerminalOutput: (output) => set((state) => {
    // Cap terminal output at 2000 lines to prevent memory leak
    const newOutput = [...state.terminalOutput, output];
    if (newOutput.length > 2000) {
      return { terminalOutput: newOutput.slice(-1500) };
    }
    return { terminalOutput: newOutput };
  }),
  clearTerminal: () => set({ terminalOutput: [] }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  toggleAIChat: () => set((state) => ({ isAIChatOpen: !state.isAIChatOpen })),
  setWebContainerReady: (ready) => set({ isWebContainerReady: ready }),
  setBooting: (booting) => set({ isBooting: booting }),
  setFiles: (files) => set({ files }),
  setMobileActiveTab: (tab) => set({ mobileActiveTab: tab }),
  setWebcontainerInstance: (instance) => set({ webcontainerInstance: instance }),
  setRunningProcess: (process) => set({ runningProcess: process }),
}));
