"use client";

import dynamic from 'next/dynamic';

// Dynamically import the Sidebar component with SSR disabled
export const ClientSidebar = dynamic(
  () => import('../components/Sidebar'),
  { ssr: false }
);
