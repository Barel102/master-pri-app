import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/auth/session";
import { he } from "@/lib/i18n/admin-he";

export const metadata = {
  title: `${he.login.title} | ${he.appName}`,
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/products");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{he.login.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{he.login.subtitle}</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
