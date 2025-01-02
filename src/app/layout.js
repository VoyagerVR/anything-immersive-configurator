// src/app/layout.js

import './globals.css';

export const metadata = {
  title: 'Anything Immersive Configurator',
  description: 'Dark-themed Next.js 13 product configurator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#121212] text-white">{children}</body>
    </html>
  );
}
