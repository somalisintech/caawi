import { Footer } from '@/components/layout/footer';
import { Nav } from '@/components/layout/nav';
import prisma from '@/lib/db';
import { createClient } from '@/utils/supabase/server';
import { Hero } from './components/hero';
import { HowItWorks } from './components/how-it-works';

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  let user = null;
  if (data.user && !error && data.user.email) {
    user = await prisma.user.findUnique({
      where: { email: data.user.email },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        image: true
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-manrope)]">
      <Nav user={user} className="px-[60px] max-lg:px-10 max-sm:px-6" />
      <Hero />
      <HowItWorks />
      <Footer className="px-[60px] max-lg:px-10 max-sm:px-6" />
    </div>
  );
}
