import { apiFetch } from "../../../lib/apiClient";

export const getQR = async (id: string): Promise<string> => {
  return apiFetch<string>(`/user/getQR/${id}`);
};
