export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function actionError(error: string): ActionResult<never> {
  return { success: false, error };
}

export const ORDER_STATUSES = [
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const UPDATABLE_ORDER_STATUSES = [
  "Pending",
  "Shipped",
  "Delivered",
] as const;
