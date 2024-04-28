import { Hero } from './components/hero';
import { Companies } from './components/companies';
import { Paths } from './components/paths';
import { CallToAction } from './components/call-to-action';

export default function Home() {
  return (
    <>
      <Hero />
      <Companies />
      <Paths />
      <CallToAction />
    </>
  );
}
