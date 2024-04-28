import Image from 'next/image';

const companies = [
  'https://cdn.worldvectorlogo.com/logos/netflix-3.svg',
  'https://cdn.worldvectorlogo.com/logos/netflix-3.svg',
  'https://cdn.worldvectorlogo.com/logos/netflix-3.svg',
  'https://cdn.worldvectorlogo.com/logos/netflix-3.svg'
];

export function Companies() {
  return (
    <div className="container flex justify-center">
      <div className="flex max-w-4xl flex-col items-center space-y-8 pb-16 pt-4">
        <h6 className="text-center font-medium uppercase leading-tight text-muted-foreground">Find mentors at</h6>
        <div className="grid grid-cols-2 gap-7 opacity-60 saturate-0 md:grid-cols-4">
          {companies.map((company, idx) => (
            <div key={idx} className="relative h-8 w-24">
              <Image src={company} fill alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
