import api from "../api/axios";

export const getLiveMatch=async ()=>{
    const {data}=await api.get(
        "/matches?status=live"
    )
    return data.data
}

export const getUpcomingMatches=async ()=>{
    const {data}=await api.get(
        "/matches?status=upcoming&sortBy=matchDate&order=asc"
    )
    return data.data;
}