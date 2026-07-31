import api from "../api/axios";

export const getTopPlayers = async () => {

    const { data } = await api.get(
        "/players?sortBy=runs&order=desc&limit=5"
    );

    return data.data;
};

export const getTopPlayer = async () => {

    const { data } = await api.get(
        "/players?sortBy=runs&order=desc&limit=1"
    );

    return data.data[0];
};

export const getPlayers = async (page = 1, limit = 8) => {
  const { data } = await api.get(
    `/players?page=${page}&limit=${limit}`
  );

  return data;
};