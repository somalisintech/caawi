import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <div className="py-16">
      <div className="container">
        <div className="rounded-md bg-primary px-6 py-16">
          <div className="flex flex-col items-center justify-center gap-4">
            <h3 className="text-3xl font-bold text-white">Join Caawi today</h3>
            <p className="max-w-4xl text-center text-white">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur, vel neque enim rerum impedit ipsam
              ducimus quibusdam dicta! Dolor asperiores ea ex ullam sed dolores ipsa libero assumenda temporibus quos?
            </p>
            <Button size="lg" variant="secondary">
              Get started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
