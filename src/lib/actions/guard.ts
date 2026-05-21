import { actionError, type ActionResult } from "@/lib/actions/types";
import { requireAdmin } from "@/lib/auth/session";

export async function withAdminAuth<T>(
  handler: () => Promise<ActionResult<T>>,
): Promise<ActionResult<T>> {
  const { authorized } = await requireAdmin();

  if (!authorized) {
    return actionError("נדרשת התחברות מנהל.");
  }

  return handler();
}
