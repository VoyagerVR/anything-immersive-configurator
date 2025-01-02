'use client';

import Image from 'next/image';

export default function Navbar() {
  const handleLogoClick = () => {
    window.location.href = 'https://www.voyagervrlab.co.uk';
  };

  return (
    <div className="navbar-outer">
      <div className="navbar-container" onClick={handleLogoClick}>
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
        <span className="font-bold text-xl ml-2 cursor-pointer">
          Anything Immersive Configurator
        </span>
      </div>
    </div>
  );
}
