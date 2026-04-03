import { create } from 'zustand';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  content?: string;
}

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

  setActiveFile: (path) => set({ activeFilePath: path }),
  setFileContent: (path, content) => set((state) => ({
    fileContents: { ...state.fileContents, [path]: content }
  })),
  addTerminalOutput: (output) => set((state) => ({
    terminalOutput: [...state.terminalOutput, output]
  })),
  clearTerminal: () => set({ terminalOutput: [] }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  toggleAIChat: () => set((state) => ({ isAIChatOpen: !state.isAIChatOpen })),
  setWebContainerReady: (ready) => set({ isWebContainerReady: ready }),
  setBooting: (booting) => set({ isBooting: booting }),
  setFiles: (files) => set({ files }),
}));
