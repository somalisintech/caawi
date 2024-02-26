import { Hero } from './components/hero';
import { Companies } from './components/companies';
import { Preview } from './components/preview';
import { Features } from './components/features';
import { Paths } from './components/paths';
import { Mentors } from './components/mentors';
import { CallToAction } from './components/call-to-action';

export default function Home() {
  return (
    <>
      <Hero />
      <Companies />
      <Preview />
      <Features />
      <Paths />
      <Mentors />
      <CallToAction />
    </>
  );
}
