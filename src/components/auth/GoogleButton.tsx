"use client";

import { useSearchParams } from "next/navigation";

type GoogleButtonProps = {
  mode: "signin" | "signup";
};

export default function GoogleButton({
  mode,
}: GoogleButtonProps) {

  const searchParams =
    useSearchParams();

  const handleGoogleLogin =
    () => {

      const returnTo =
        searchParams.get(
          "returnTo",
        );

      if (returnTo) {

        sessionStorage.setItem(
          "googleReturnTo",
          returnTo,
        );
      }

      sessionStorage.setItem(
        "googleMode",
        mode,
      );

      // 🔥 ahora pasa por NEXT
      window.location.href =
        `/api/auth/google/${mode}`;
    };

  return (

    <div className="flex justify-center items-center">

      <button
        type="button"

        onClick={
          handleGoogleLogin
        }

        className="w-full border border-[#C7962D]/40 bg-[#111111] hover:bg-[#181818] text-white rounded-xl py-3 px-6 flex items-center justify-center gap-3 font-medium transition-all"
      >

        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
        />

        <span>
          Continuar con Google
        </span>

      </button>

    </div>
  );
}
