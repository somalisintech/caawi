import { PeelCard } from './peel-card';

export function HowItWorks() {
  return (
    <>
      <div className="mb-10 text-center text-sm font-medium uppercase tracking-widest">How It Works</div>

      <section className="grid grid-cols-4 gap-6 px-[60px] pb-20 max-lg:grid-cols-2 max-lg:px-10 max-sm:grid-cols-1 max-sm:px-6">
        <PeelCard color="green" title="Profile" subtitle="Tell your story" graphic={<StarGraphic />} />
        <PeelCard color="lavender" title="Goals" subtitle="Set direction" graphic={<BarGraphic />} />
        <PeelCard color="coral" title="Connect" subtitle="Find mentors" graphic={<CirclesGraphic />} />
        <PeelCard color="white" title="Grow" subtitle="Build momentum" graphic={<PeakGraphic />} />
      </section>
    </>
  );
}

function StarGraphic() {
  return (
    <div className="relative size-10">
      <div
        className="absolute size-full bg-[#003311]"
        style={{ clipPath: 'polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)' }}
      />
    </div>
  );
}

function BarGraphic() {
  return (
    <div className="flex h-10 items-end gap-1">
      <div className="w-2.5 bg-[#2a1a4a]" style={{ height: '40%' }} />
      <div className="h-full w-2.5 bg-[#2a1a4a]" />
      <div className="w-2.5 bg-[#2a1a4a]" style={{ height: '60%' }} />
    </div>
  );
}

function CirclesGraphic() {
  return (
    <div className="relative size-10">
      <div className="absolute bottom-0 left-0 size-6 rounded-full bg-[#4a1000]" />
      <div className="absolute right-1 top-0 size-3 rounded-full bg-[#4a1000]" />
    </div>
  );
}

function PeakGraphic() {
  return (
    <div className="relative size-10">
      <div
        className="absolute bottom-0"
        style={{
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '35px solid #000'
        }}
      />
      <div
        className="absolute bottom-[5px] left-2.5"
        style={{
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: '18px solid #FFF'
        }}
      />
    </div>
  );
}
