import type { Member } from '.';

/** Stub: no Wix members on Vercel. Always returns null. */
export const getCurrentMember = async (): Promise<Member | null> => {
  return null;
};
