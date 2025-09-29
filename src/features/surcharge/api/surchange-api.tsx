import api from "@/lib/axios/instance";
import { SurchargeSchemaType } from "../components/surchange-form";

const surchargeAPI = {
    getSurcharge: async (filter?: any) => {
        const response = await api.get("/surcharge/all", { params: filter });
        return response.data;
    },

    getSurchargeById: async (id: number) => {
        const response = await api.get(`/surcharge/${id}`);
        return response.data;
    },

    createSurcharge: async (data: SurchargeSchemaType) => {
        const response = await api.post("/surcharge/create", data);
        return response.data;
    },
    updateSurcharge: async ({ id, data }: { id: number, data: SurchargeSchemaType }) => {
        const response = await api.patch(`/surcharge/${id}`, data);
        return response.data;
    },
    deleteSurcharge: async (id: number) => {
        const response = await api.delete(`/surcharge/${id}`);
        return response.data;
    }
}

export default surchargeAPI;
