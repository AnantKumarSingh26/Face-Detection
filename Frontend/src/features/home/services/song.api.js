import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5173/", // Replace with your API base URL
    withCredentials: true, // Include credentials for cross-origin requests
});

export async function getSong({mood}) {
    const response = await api.get(`/api/songs/${mood}`)
    return response.data;
}