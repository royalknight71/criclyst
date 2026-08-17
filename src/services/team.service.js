import api from "../api/axios";

export const getTeams = async (
  page = 1,
  limit = 8,
  search = "",
  format = ""
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (format) {
    params.append("format", format);
  }

  const { data } = await api.get(`/teams?${params.toString()}`);

  return data;
};

export const getTeamById = async (id) => {
  const { data } = await api.get(`/teams/${id}`);

  return data.data;
};