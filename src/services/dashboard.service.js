import api from "../api/axios";

export const getDashboardStats=async ()=>{
    const {data}=await api.get(
        "/dashboard/stats"
    )

    return data.data
}