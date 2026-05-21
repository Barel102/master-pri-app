"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/actions/admin-auth";
import { he } from "@/lib/i18n/admin-he";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await loginAdmin(password);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          {he.login.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={he.login.passwordPlaceholder}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? he.login.submitting : he.login.submit}
      </button>
    </form>
  );
}
