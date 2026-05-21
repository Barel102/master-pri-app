export const ADMIN_COOKIE_NAME = "admin_token";
export const ADMIN_COOKIE_VALUE = "true";

export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function isValidAdminToken(value: string | undefined): boolean {
  return value === ADMIN_COOKIE_VALUE;
}
