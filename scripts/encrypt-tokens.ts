/**
 * One-time migration: encrypt existing plaintext Calendly tokens.
 * Run: npx tsx scripts/encrypt-tokens.ts
 *
 * Idempotent — skips values that already look encrypted (contain ':' separator).
 */
import { decrypt, encrypt } from '../lib/crypto';
import prisma from '../lib/db';

function isAlreadyEncrypted(value: string): boolean {
  const parts = value.split(':');
  if (parts.length !== 3 || parts.some((p) => p.length === 0)) return false;
  try {
    decrypt(value);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const users = await prisma.calendlyUser.findMany({
    select: { uri: true, accessToken: true, refreshToken: true }
  });

  console.log(`Found ${users.length} CalendlyUser records`);

  let updated = 0;
  for (const user of users) {
    const needsAccessEncrypt = user.accessToken && !isAlreadyEncrypted(user.accessToken);
    const needsRefreshEncrypt = user.refreshToken && !isAlreadyEncrypted(user.refreshToken);

    if (!needsAccessEncrypt && !needsRefreshEncrypt) {
      console.log(`  [skip] ${user.uri} — already encrypted`);
      continue;
    }

    await prisma.calendlyUser.update({
      where: { uri: user.uri },
      data: {
        ...(needsAccessEncrypt && { accessToken: encrypt(user.accessToken!) }),
        ...(needsRefreshEncrypt && user.refreshToken != null ? { refreshToken: encrypt(user.refreshToken) } : {})
      }
    });

    updated++;
    console.log(`  [encrypted] ${user.uri}`);
  }

  console.log(`Done. Encrypted ${updated}/${users.length} records.`);
}

main()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
