import { api } from "./api";

export const registerUser = (payload: any) => {
  return api("/auth/signup", {
    method: "POST",

    body: JSON.stringify(payload),
  });
};

export const loginUser = (payload: {
  email: string;

  password: string;
}) => {
  return api("/auth/signin", {
    method: "POST",

    body: JSON.stringify(payload),
  });
};

export const completeProfile = async (
  id: string,
  payload: {
    phone: string;
    country: string;
    companyName: string;
    city: string;
    address: string;
  },
) => {
    const token = document.cookie
    .split("; ")
    .find((row) =>
      row.startsWith("userSession="),
    )
    ?.split("=")[1];
    console.log(token);

  if (!token) {
    throw new Error("No token found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/complete-profile/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error completando perfil");
  }

  return res.json();
};

