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
