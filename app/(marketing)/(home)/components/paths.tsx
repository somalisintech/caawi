import { Button } from '@/components/ui/button';
import { CheckCircle2Icon } from 'lucide-react';

export function Paths() {
  return (
    <div className="bg-muted py-16">
      <div className="container">
        <div className="flex flex-col gap-16 md:flex-row">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-primary">Become a mentee</h2>
              <p className="max-w-xl text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam atque quas ducimus accusantium dolor
                voluptatibus sit, cupiditate delectus error dignissimos quisquam, sunt inventore ad ea saepe officia!
                Cumque, odio dolorem?
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <CheckCircle2Icon className="text-primary" />
                <p>Benefit 1 of becoming a menee</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2Icon className="text-primary" />
                <p>Benefit 2 of becoming a menee</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2Icon className="text-primary" />
                <p>Benefit 3 of becoming a menee</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2Icon className="text-primary" />
                <p>Benefit 4 of becoming a menee</p>
              </div>
            </div>
            <Button>Register as a mentee</Button>
          </div>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-primary">Become a mentor</h2>
              <p className="max-w-xl text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam atque quas ducimus accusantium dolor
                voluptatibus sit, cupiditate delectus error dignissimos quisquam, sunt inventore ad ea saepe officia!
                Cumque, odio dolorem?
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <CheckCircle2Icon className="text-primary" />
                <p>Benefit 1 of becoming a mentor</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2Icon className="text-primary" />
                <p>Benefit 2 of becoming a mentor</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2Icon className="text-primary" />
                <p>Benefit 3 of becoming a mentor</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2Icon className="text-primary" />
                <p>Benefit 4 of becoming a mentor</p>
              </div>
            </div>
            <Button>Register as a mentor</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
