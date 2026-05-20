export type PaymentsFilters = {
  startDate: string;
  endDate: string;
  status?: string;
  page?: number;
};

export const getPayments = async (
  token: string,
  filters: PaymentsFilters,
) => {
  const params = new URLSearchParams({
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: String(filters.page ?? 1),
    limit: "5",
  });

  if (filters.status) {
    params.append("status", filters.status);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payments?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Error obteniendo pagos");
  }

  return response.json();
};