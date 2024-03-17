import { PropsWithChildren } from 'react';

export default async function MentorsLayout({ children }: PropsWithChildren) {
  return <div className="container">{children}</div>;
}
