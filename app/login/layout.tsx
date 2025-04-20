// app/login/layout.tsx
import type { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* This layout is only for login */}
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}
