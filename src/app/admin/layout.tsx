import { Heebo } from "next/font/google";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      lang="he"
      dir="rtl"
      className={`${heebo.variable} min-h-screen font-sans`}
      style={{ fontFamily: "var(--font-heebo), Arial, sans-serif" }}
    >
      {children}
    </div>
  );
}
