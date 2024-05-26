import Link from 'next/link';
// import { CaawiLogo } from '@/components/brand/caawi-logo';
import { Separator } from '@/components/ui/separator';

// const pageLinks = [
//   {
//     label: 'Link one',
//     href: '/'
//   },
//   {
//     label: 'Link two',
//     href: '/'
//   },
//   {
//     label: 'Link three',
//     href: '/'
//   },
//   {
//     label: 'Link four',
//     href: '/'
//   },
//   {
//     label: 'Link five',
//     href: '/'
//   }
// ];

const legalLink = [
  {
    label: 'Privacy Policy',
    href: '/privacy-policy'
  },
  {
    label: 'Terms and Conditions',
    href: '/terms-and-conditions'
  }
];

export function Footer() {
  return (
    <>
      <Separator />
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-6 py-5 md:flex-row">
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Caawi. All rights reserved.</div>
          <div className="flex gap-5">
            {legalLink.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={'_blank'}
                className="text-sm text-muted-foreground underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
  // return (
  //   <div className="bg-muted">
  //     <div className="container">
  //       <div className="flex flex-col items-center gap-6 py-16">
  //         <CaawiLogo />
  //         <div className="flex flex-col gap-5 md:flex-row">
  //           {pageLinks.map((link) => (
  //             <Link key={link.label} href={link.href}>
  //               {link.label}
  //             </Link>
  //           ))}
  //         </div>
  //       </div>
  //       <Separator />
  //       <div className="flex flex-col items-center justify-between gap-6 py-5 md:flex-row">
  //         <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Caawi. All rights reserved.</div>
  //         <div className="flex gap-5">
  //           {legalLink.map((link) => (
  //             <Link key={link.label} href={link.href} className="text-sm text-muted-foreground underline">
  //               {link.label}
  //             </Link>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
