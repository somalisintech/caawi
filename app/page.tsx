import TopNav from '@/components/TopNav';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <TopNav />
      <h1 className="text-4xl font-bold">Landing Page</h1>
    </main>
  );
}
