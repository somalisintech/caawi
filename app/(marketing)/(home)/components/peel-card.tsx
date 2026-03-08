'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';

const PATTERN_MAP = {
  green: '/landing/pattern-green.png',
  lavender: '/landing/pattern-blue.png',
  coral: '/landing/pattern-orange.png',
  white: '/landing/pattern-red.png'
};

const REST_RADIUS = 240;
const HOVER_RADIUS = 500;
const LERP_SPEED = 0.06;

function buildMask(r: number) {
  return `radial-gradient(circle ${r}px at 100% 0%, black 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 75%, transparent 100%)`;
}

export function PeelCard({
  color,
  title,
  subtitle,
  graphic
}: {
  color: keyof typeof PATTERN_MAP;
  title: string;
  subtitle: string;
  graphic: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const currentRadius = useRef(REST_RADIUS);
  const targetRadius = useRef(REST_RADIUS);

  const animate = useCallback(() => {
    const diff = targetRadius.current - currentRadius.current;
    if (Math.abs(diff) < 0.5) {
      currentRadius.current = targetRadius.current;
    } else {
      currentRadius.current += diff * LERP_SPEED;
    }

    if (overlayRef.current) {
      const mask = buildMask(currentRadius.current);
      overlayRef.current.style.maskImage = mask;
      overlayRef.current.style.webkitMaskImage = mask;
    }

    if (Math.abs(targetRadius.current - currentRadius.current) > 0.5) {
      animRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const startAnim = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const colorMap = {
    green: 'bg-[#00A651] text-[#003311]',
    lavender: 'bg-[#D8CEF6] text-[#2a1a4a]',
    coral: 'bg-[#FF6B4A] text-[#4a1000]',
    white: 'bg-white text-black dark:bg-[#1a1a1a] dark:text-white'
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: decorative hover animation only
    <div
      onMouseEnter={() => {
        targetRadius.current = HOVER_RADIUS;
        startAnim();
      }}
      onMouseLeave={() => {
        targetRadius.current = REST_RADIUS;
        startAnim();
      }}
      className={`group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl p-[30px] transition-all duration-[250ms] ease-out hover:-translate-y-0.5 ${colorMap[color]}`}
      style={{
        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.08), inset 0 0 80px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: buildMask(REST_RADIUS),
          WebkitMaskImage: buildMask(REST_RADIUS)
        }}
      >
        <Image
          src={PATTERN_MAP[color]}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="relative z-10 size-[60px]">{graphic}</div>

      <div className="relative z-10 flex items-end justify-between">
        <div>
          <h3 className="mb-1 text-[28px] font-extrabold tracking-tight">{title}</h3>
          <span className="text-sm font-medium opacity-80">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
