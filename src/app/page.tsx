'use client';

import { IDELayout } from '@/components/ide/ide-layout';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with WebContainers
const DynamicIDE = dynamic(
  () => Promise.resolve(IDELayout),
  { ssr: false }
);

export default function Home() {
  return <DynamicIDE />;
}
