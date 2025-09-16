"use client";

import { useEffect, useState } from 'react';

export function GradientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-float delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-3xl animate-float delay-500" />
      
      {/* Additional smaller orbs */}
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/15 to-rose-500/15 rounded-full blur-2xl animate-pulse delay-700" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-orange-500/15 to-yellow-500/15 rounded-full blur-2xl animate-pulse delay-300" />
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-gradient-x" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent animate-gradient-y" />
      
      {/* Particle effect */}
      <div className="particles absolute inset-0" />
    </div>
  );
}