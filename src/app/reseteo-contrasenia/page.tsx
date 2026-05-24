import { Suspense } from "react";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ReseteoContraseniaPage() {
  return (
    <main className="min-h-screen bg-[#0B0D0F] flex items-center justify-center px-4">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}