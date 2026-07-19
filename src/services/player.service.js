import api from "./api";

export const getTopPlayer = async () => {
    const response = await api.get(
        "/players?sortBy=runs&order=desc&limit=1"
    );

    return response.data;
};