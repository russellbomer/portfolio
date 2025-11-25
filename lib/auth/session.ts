export async function hashPassword(password: string): Promise<string> {
  return password; // Stub: no hashing
}

export async function verifyToken(
  token: string
): Promise<{ user: { id: number }; expires: string } | null> {
  return null; // Stub: always unauthenticated
}

export async function setSession(_userId: string): Promise<void> {
  // Stub: no-op
}
