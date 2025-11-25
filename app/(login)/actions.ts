"use server";

// Legacy stub to satisfy type references from quarantined dashboard pages.
// Returns an ActionState-compatible object for form handling.
export async function updateAccount(
  _prev: { name?: string; error?: string; success?: string },
  formData: FormData
): Promise<{ name?: string; error?: string; success?: string }> {
  try {
    const name = formData.get("name")?.toString() || "";
    // No persistence; emulate success.
    return { name, success: "Saved" };
  } catch (e: any) {
    return { error: e?.message || "Unexpected error" };
  }
}

export async function inviteTeamMember(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  try {
    const email = formData.get("email")?.toString() || "";
    if (!email) return { error: "Email required" };
    return { success: `Invitation queued for ${email}` };
  } catch (e: any) {
    return { error: e?.message || "Unexpected error" };
  }
}

export async function removeTeamMember(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  try {
    const memberId = formData.get("memberId")?.toString() || "";
    if (!memberId) return { error: "Member id required" };
    return { success: `Removed member ${memberId}` };
  } catch (e: any) {
    return { error: e?.message || "Unexpected error" };
  }
}

export async function updatePassword(
  _prev: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    error?: string;
    success?: string;
  },
  formData: FormData
): Promise<{
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
}> {
  const currentPassword = formData.get("currentPassword")?.toString() || "";
  const newPassword = formData.get("newPassword")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";
  if (newPassword !== confirmPassword) {
    return {
      currentPassword,
      newPassword,
      confirmPassword,
      error: "Passwords do not match",
    };
  }
  if (newPassword.length < 8) {
    return {
      currentPassword,
      newPassword,
      confirmPassword,
      error: "Password too short",
    };
  }
  return {
    currentPassword,
    newPassword,
    confirmPassword,
    success: "Password updated (stub)",
  };
}

export async function deleteAccount(
  _prev: { password?: string; error?: string; success?: string },
  formData: FormData
): Promise<{ password?: string; error?: string; success?: string }> {
  const password = formData.get("password")?.toString() || "";
  if (!password) return { error: "Password required" };
  return { password, success: "Account deletion scheduled (stub)" };
}

export async function signOut(): Promise<void> {
  // No-op sign out stub.
}
