import { api } from "./api";

export const getMeetings =
  async () => {

    return await api(
      "/meetings",
      {
        method: "GET",
      },
    );
  };

export const getAvailability =
  async (
    date: string,
  ) => {

    return await api(
      `/meetings/availability?date=${date}`,
      {
        method: "GET",
      },
    );
  };

export const createMeeting =
  async (
    meetingData: {
      date: string;

      time: string;

      trainingRequestId: string;

      topic?: string;
    },
  ) => {

    return await api(
      "/meetings",
      {
        method: "POST",

        body: JSON.stringify(
          meetingData,
        ),
      },
    );
  };

export const cancelMeeting =
  async (
    id: string,
  ) => {

    return await api(
      `/meetings/${id}`,
      {
        method: "DELETE",
      },
    );
  };

export const rescheduleMeeting =
  async (
    id: string,

    newStartTime: string,
  ) => {

    return await api(
      `/meetings/${id}/reschedule`,
      {
        method: "PATCH",

        body: JSON.stringify({
          newStartTime,
        }),
      },
    );
  };