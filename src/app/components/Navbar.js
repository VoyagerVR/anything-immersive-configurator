// src/app/components/Navbar.js
'use client';

import Image from 'next/image';

export default function Navbar() {
  const handleLogoClick = () => {
    window.location.href = 'https://www.voyagervrlab.co.uk';
  };

  return (
    <div className="navbar">
      {/* We place content inside for spacing */}
      <div className="navbar-content">
        {/* Clickable logo ~ double size */}
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={handleLogoClick}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={100}
          />
          <span className="font-bold text-xl">
            Anything Immersive
          </span>
        </div>
        {/* If you want more nav items, put them here */}
      </div>
    </div>
  );
}
