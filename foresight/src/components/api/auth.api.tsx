import { api } from "./axios";

export const loginApi = async (username: string, password: string) => {
    const { data } = await api.post("/api/v1/auth/token", {
        username,
        password,
    });
    return data;
};

export const profileApi = async () => {
    const { data } = await api.get("/auth/profile");
    return data;
};