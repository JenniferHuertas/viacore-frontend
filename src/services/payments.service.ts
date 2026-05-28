import { api } from "./api";

export type PaymentsFilters = {
  startDate: string;
  endDate: string;
  status?: string;
  page?: number;
};

export const getPayments = async (
  filters: PaymentsFilters,
) => {
  const params =
    new URLSearchParams({
      startDate:
        filters.startDate,

      endDate:
        filters.endDate,

      page: String(
        filters.page ?? 1,
      ),

      limit: "5",
    });

  if (filters.status) {

    params.append(
      "status",
      filters.status,
    );
  }

  return await api(
    `/api/payments?${params.toString()}`,
  );
};