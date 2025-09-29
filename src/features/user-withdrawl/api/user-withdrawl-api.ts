import api from "@/lib/axios/instance";

export const userWithdrawalAPI = {
    getAllUserWithdrawals: async (filter: any) => {
        return api.get("/user-withdrawal", {
            params: filter,
        });
    },
    createUserWithdrawal: async (data: any) => {
        return api.post("/user-withdrawal", data);
    },
    getUserWithdrawalById: async (withdrawalId: string) => {
        return api.get(`/user-withdrawal/${withdrawalId}`);
    },
    updateUserWithdrawalStatus: async (withdrawalId: string, data: any) => {
        return api.patch(`/user-withdrawal/${withdrawalId}`, data);
    },

    createBulkPayout: async (data: any) => {
        return api.post("/user-withdrawal/bulk", data,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

};

export default userWithdrawalAPI;
