'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

export function DashboardMenu() {
  return (
    <Card className="p-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/dashboard/mentors" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Mentors</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/dashboard/profile" passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Profile</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Card>
  );
}
