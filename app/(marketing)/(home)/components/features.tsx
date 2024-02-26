import { Button } from '@/components/ui/button';
import { ArrowRightIcon, BoxIcon } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: BoxIcon,
    title: 'Connect with Experienced Mentors and Ambitious Mentees',
    description:
      'Caawi is a platform that brings together mentors and mentees, empowering them to learn, grow, and succeed together.',
    href: '/'
  },
  {
    icon: BoxIcon,
    title: 'Unlock Your Potential with Personalized Mentorship',
    description: 'Experience the power of one-on-one mentorship tailored to your goals and aspirations.',
    href: '/'
  },
  {
    icon: BoxIcon,
    title: 'Make a Difference as a Mentor or Mentee',
    description:
      'Share your expertise and guide others on their professional journey or find a mentor who can help you reach new heights.',
    href: '/'
  }
];

export function Features() {
  return (
    <div className="relative bg-background py-12 shadow-[0_-24px_56px_-16px_rgba(0,0,0,0.1)] md:py-24">
      <div className="container space-y-8  md:space-y-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <h2 className="text-3xl font-bold">Discover a World of Mentorship Opportunities on Caawi</h2>
          <p className="text-sm text-muted-foreground">
            Connect with mentors/mentees and start your mentorship journey today. Explore opportunities and connect with
            experienced mentors/ambitious mentees. Join for personalised mentorship and one-on-one support on your path
            to success. Become a mentor/mentee or find someone to guide you. Discover Caawi and begin your journey now.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-20">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-start gap-4">
              <feature.icon size={32} className="text-primary" />
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="flex-1 text-muted-foreground">{feature.description}</p>
              <Button asChild variant="outline">
                <Link className="gap-2" href={feature.href}>
                  Join
                  <ArrowRightIcon size={16} />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
