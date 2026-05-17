export type PublicEnv = Readonly<{
  NEXT_PUBLIC_API_URL: string | null;
}>;

export function getPublicEnv(): PublicEnv {
  return {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL?.trim() || null,
  };
}
