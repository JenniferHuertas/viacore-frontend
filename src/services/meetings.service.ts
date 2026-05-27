import { api } from "./api";

export const getMeetings = async () => {
  return await api("/meetings", {
    method: "GET",
  });
};

export const getAvailability = async (date: string) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return await api(
    `/meetings/availability?date=${date}&timezone=${encodeURIComponent(timezone)}`,
    {
      method: "GET",
    },
  );
};

export const createMeeting = async (meetingData: {
  date: string;
  time: string;
  trainingRequestId: string;
  topic?: string;
}) => {
  return await api("/meetings", {
    method: "POST",
    body: JSON.stringify({
      ...meetingData,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  });
};

export const cancelMeeting = async (id: string) => {
  return await api(`/meetings/${id}`, {
    method: "DELETE",
  });
};

export const rescheduleMeeting = async (
  id: string,
  date: string,
  time: string,
) => {
  return await api(`/meetings/${id}/reschedule`, {
    method: "PATCH",
    body: JSON.stringify({
      date,
      time,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  });
};
