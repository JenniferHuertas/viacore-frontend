"use client";

import { useSearchParams } from "next/navigation";

type GoogleButtonProps = {
  mode: "signin" | "signup";
};
export default function GoogleButton({ mode }: GoogleButtonProps) {
  const searchParams = useSearchParams();

  const handleGoogleLogin = () => {
    const returnTo = searchParams.get("returnTo");
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google/${mode}`,
    );
    if (returnTo) {
      url.searchParams.set("returnTo", returnTo);
    }
    window.location.href = url.toString();
  };
  return (
    <div className="flex justify-center items-center">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="
          w-full
          border
          border-[#C7962D]/40
          bg-[#111111]
          hover:bg-[#181818]
          text-white
          rounded-xl
          py-3
          px-6
          flex
          items-center
          justify-center
          gap-3
          font-medium
          transition-all
          duration-300
          cursor-pointer
          hover:border-[#C7962D]
          hover:shadow-[0_0_20px_rgba(199,150,45,0.15)]
        "
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span>Continuar con Google</span>
      </button>
    </div>
  );
}
