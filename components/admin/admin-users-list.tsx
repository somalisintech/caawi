import LayerCard from '@/components/layer-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { PAGE_SIZE } from '@/lib/constants/data';
import type { AdminUserRow } from '@/lib/queries/admin';
import { AdminUserBanButton } from './admin-user-ban-button';
import { AdminUsersSearch } from './admin-users-search';

type Props = {
  users: AdminUserRow[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  buildHref: (page: number) => string;
};

function initials(firstName: string | null, lastName: string | null, email: string | null) {
  const first = firstName?.[0] ?? '';
  const last = lastName?.[0] ?? '';
  const combined = `${first}${last}`.trim();
  if (combined) return combined.toUpperCase();
  return email?.[0]?.toUpperCase() ?? '?';
}

function fullName(firstName: string | null, lastName: string | null, email: string | null) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return name || email || 'Unknown user';
}

export function AdminUsersList({ users, totalCount, totalPages, currentPage, buildHref }: Props) {
  const start = totalCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const end = start + users.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Users</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalCount > 0 ? `Showing ${start}\u2013${end} of ${totalCount} users` : 'No users match these filters'}
          </p>
        </div>
      </div>

      <AdminUsersSearch />

      {users.length === 0 ? (
        <LayerCard>
          <LayerCard.Primary className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Try a different search or clear the filters.</p>
          </LayerCard.Primary>
        </LayerCard>
      ) : (
        <LayerCard>
          <LayerCard.Primary className="p-0">
            <ul className="divide-y divide-border">
              {users.map((user) => {
                const banned = !!user.bannedAt;
                return (
                  <li key={user.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                    <Avatar size="lg" className="shrink-0">
                      {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                      <AvatarFallback>{initials(user.firstName, user.lastName, user.email)}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {fullName(user.firstName, user.lastName, user.email)}
                        </p>
                        {user.role === 'ADMIN' && (
                          <Badge variant="outline" className="border-border">
                            Admin
                          </Badge>
                        )}
                        {user.profile?.userType === 'MENTOR' && (
                          <Badge variant="secondary" className="bg-secondary/60">
                            Mentor
                          </Badge>
                        )}
                        {user.profile?.userType === 'MENTEE' && (
                          <Badge variant="secondary" className="bg-secondary/60">
                            Mentee
                          </Badge>
                        )}
                        {banned && <Badge variant="destructive">Banned</Badge>}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email ?? 'No email'}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">
                        Joined {user.createdAt.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </span>
                      <AdminUserBanButton
                        userId={user.id}
                        userName={fullName(user.firstName, user.lastName, user.email)}
                        isBanned={banned}
                        isAdmin={user.role === 'ADMIN'}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </LayerCard.Primary>
        </LayerCard>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
