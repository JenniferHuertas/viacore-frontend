const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const api = async (
  endpoint: string,
  options: RequestInit = {},
) => {

  const isInternal =
    endpoint.startsWith("/api");

  const url =
    isInternal
      ? endpoint
      : `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,

    credentials: "include",

    headers: {
      ...(options.body instanceof FormData
        ? {}
        : {
            "Content-Type":
              "application/json",
          }),

      ...(options.headers || {}),
    },
  });

  const text =
    await res.text();

  const data =
    text
      ? JSON.parse(text)
      : null;

  if (!res.ok) {
    throw {
      statusCode: res.status,
      ...(data || {}),
    };
  }

  return data;
};
