import { Hero } from './components/hero';
import { Companies } from './components/companies';
import { Features } from './components/features';
import { Paths } from './components/paths';
import { CallToAction } from './components/call-to-action';

export default function Home() {
  return (
    <>
      {/* <div className="bg-primary"> */}
      <Hero />
      {/* </div> */}
      <Companies />
      <Features />
      <Paths />
      <CallToAction />
    </>
  );
}
