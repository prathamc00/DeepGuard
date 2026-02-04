
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
          <i className="fa-solid fa-shield-halved text-cyan-400 text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          DEEPGUARD
        </h1>
      </div>
    </header>
  );
};

export default Header;
