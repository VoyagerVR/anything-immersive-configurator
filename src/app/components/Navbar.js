'use client';
import Image from 'next/image';

export default function Navbar() {
  const handleLogoClick = () => {
    window.location.href = 'https://www.voyagervrlab.co.uk';
  };

  return (
    <div className="navbar-box">
      <div
        className="cursor-pointer flex items-center gap-3"
        onClick={handleLogoClick}
      >
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
        <span className="font-bold text-xl">
          Anything Immersive Configurator
        </span>
      </div>
    </div>
  );
}
