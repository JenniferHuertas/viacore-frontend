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

export const createMeeting =
  async (
    meetingData: {
      date: string;

      time: string;

      targetUserId: string;

      trainingRequestId: string;
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