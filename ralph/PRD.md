# P1 Features — Ralph Loop PRD

## Instructions

You are building features for Caawi, a mentorship platform. Each story below maps to a Jira ticket. Work through them **in order** — one per iteration.

### Workflow per story

1. Read the story below and understand the requirements
2. **Branch stacking** — each branch builds on the previous one:
   - For the **first story** (CAAWI-176): `git checkout test && git pull origin test && git checkout -b feat/CAAWI-176`
   - For **every subsequent story**: stay on the current branch and create a new one from it: `git checkout -b feat/<TICKET_ID>`
   - This ensures each branch has all prior schema changes and code available
3. Implement the feature fully (Prisma schema, server actions, API routes, UI components)
4. Run `pnpm lint:fix` to fix formatting
5. Run `pnpm check-types` — note: new Prisma model types will fail since we skip `pnpm generate`. That's expected. Only flag non-Prisma type errors.
6. Self-review your diff (`git diff`) for:
   - Security issues (XSS, injection, missing auth checks)
   - Missing edge cases
   - Consistency with existing patterns (shadcn/ui, withLogger, server actions)
   - Code quality
7. Fix any issues found
8. Commit: `git add -A && git commit -m "feat: <description> (<TICKET_ID>)"`
9. Push and create PR — **base the PR on the previous feature branch** (not `test`):
   - First story: `gh pr create --base test --title "feat: <description> (CAAWI-176)" --body "<summary>"`
   - Subsequent stories: `gh pr create --base feat/<PREVIOUS_TICKET_ID> --title "feat: <description> (<TICKET_ID>)" --body "<summary>"`
   - Record the base branch in PROGRESS.md so the human knows the merge order
10. Update `ralph/PROGRESS.md` — mark the story as `[x]` with the PR URL and base branch
11. Output `RALPH_NEXT` to signal you're done with this iteration

### Hard rules

- **NEVER** run `pnpm migrate`, `pnpm generate`, `doppler run`, or any DB scripts
- **NEVER** modify `prisma/views/public/MentorProfile.sql` directly — add a TODO comment in the PR description if the view needs updating
- **NEVER** delete or rename existing files unless the story explicitly requires it
- **DO** add new Prisma models/fields to `prisma/schema.prisma` (the human will run migrations later)
- **DO** follow existing patterns: `withLogger` for API routes, server actions in `app/actions/`, shadcn/ui components, Zod schemas
- **DO** run `pnpm lint:fix` before committing
- Each PR shows only the diff for that story (thanks to stacked base branches)
- **PR merge order matters**: merge bottom-up (CAAWI-176 first → test, then CAAWI-181 → test, etc.) or merge the final branch which contains everything

---

## Stories (in dependency order)

### 1. CAAWI-176 — Session count + tenure on profiles (social proof)
Show "47 sessions completed" and "Mentor since Jan 2025" on mentor profiles. Add `sessionCount` and `memberSince` fields to the Prisma `MentorProfile` view definition in `schema.prisma`. Update the mentor card and profile UI to display these. Note in PR that `MentorProfile.sql` view needs manual update.

### 2. CAAWI-181 — Mentor availability status
Add `isAcceptingMentees` (Boolean, default true), `onVacation` (Boolean, default false), `vacationEndsAt` (DateTime?), `monthlyCapacity` (Int?, null = unlimited) to the `Profile` model. Add availability settings UI in the mentor's dashboard profile. Show availability badge on mentor cards. Block booking/requests for unavailable mentors at API level.

### 3. CAAWI-172 — Trust & safety (report/block)
Add `Report` and `Block` Prisma models. Server actions for `reportUser`, `blockUser`, `unblockUser` in `app/actions/`. API guard: blocked users can't interact. Admin review endpoint for reports. Focus on the data model and server-side logic — UI can be minimal (report/block buttons on profiles).

### 4. CAAWI-174 — Post-session feedback (blind 2-sided rating)
Add `SessionFeedback` model (sessionId, authorId, role enum MENTOR|MENTEE, stars Int, comment String?, submittedAt, windowClosesAt). Server actions to submit and read feedback. Enforce 5-day blind window: neither party sees ratings until window closes. Dashboard UI for rating prompt after sessions.

### 5. CAAWI-171 — Session notes / structured outcomes
Add `SessionNote` model (sessionId, authorId, type enum PRE_SESSION|POST_SESSION, content, createdAt). Server actions for CRUD. Pre-session: mentee writes agenda. Post-session: both parties add notes. UI in the session detail view.

### 6. CAAWI-177 — Action items / accountability tracking
Add `ActionItem` model (sessionId, menteeId, title, description?, dueDate, completedAt?, createdAt). Server actions to create, toggle complete, list. Show outstanding items before next session. Dashboard UI for action item management.

### 7. CAAWI-180 — Goal tracking for mentees
Add `Goal` model (mentorshipId or menteeProfileId, title, description?, targetDate, status enum NOT_STARTED|IN_PROGRESS|COMPLETED, createdAt). Server actions for CRUD + status updates. Dashboard UI for goal management. Show completion rates.

### 8. CAAWI-175 — In-app notification bell
Add `Notification` model (userId, type enum, read Boolean default false, payload Json, createdAt). Bell icon in dashboard header with unread badge. Notification dropdown/panel. Mark as read. Create notifications from existing server actions (request received/accepted, session completed).

### 9. CAAWI-179 — Public SEO mentor profiles (/mentors/[slug])
New public route at `app/(marketing)/mentors/[slug]/page.tsx`. No auth required. SEO metadata via `generateMetadata`. Programmatic OG image via `opengraph-image.tsx` using `ImageResponse` from `next/og`. New `public-mentor-profile.tsx` component (do NOT modify existing `mentor-profile.tsx`). CTA for unauthenticated users to sign up.

### 10. CAAWI-173 — Session reminders (24h + 1h)
Email reminder infrastructure. Add a `Reminder` model or integrate with the `Session` model. Stub the email sending (use a `lib/email.ts` module with a `sendEmail` function that logs but doesn't send — human will wire up Resend later). Reminder scheduling logic that can be triggered by a cron/webhook.

### 11. CAAWI-178 — Admin dashboard
Admin-only route at `app/(dashboard)/dashboard/admin/`. Role guard (check user role in layout). Pages: user management (list, flag, ban), analytics (sign-ups, active users, sessions), content moderation (review flagged reports from CAAWI-172). Use server components + Prisma queries.
