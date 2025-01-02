// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'Anything Immersive Configurator',
  description:
    'An AR and VR Configurator for Voyagers Anything Immersive Product Line.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
