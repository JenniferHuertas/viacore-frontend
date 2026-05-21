import { Suspense } from "react";
import AuthView from "@/app/views/autenticacion-vista/AuthView";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthView />
    </Suspense>
  );
}
