import Image from 'next/image';

export function Preview() {
  return (
    <div className="container">
      <div className="relative mx-auto aspect-[2/1] w-full overflow-hidden rounded-t-md shadow-2xl">
        <Image
          fill
          priority
          quality={100}
          className="object-cover object-top"
          src="https://ionic.io/appflow/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fionicframeworkcom%2Fcf63b06e-ea02-45ff-9bbd-71c3601b18ef_applfow-lp-automation-detail-2.png&w=1200&q=75"
          alt=""
        />
      </div>
    </div>
  );
}
