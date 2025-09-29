import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RegisterPayload, userAPI } from '../api/user';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import Admin, { AdminRole } from '@/models/admin';
import Merchant from '@/models/merchant';



// Registration hook
export const useRegisterUser = () => {
    return useMutation<RegisterPayload, AxiosError<any, any>, RegisterPayload>({
        mutationFn: async (data: RegisterPayload) => {
            const response = await userAPI.register(data);
            return response.data;
        },
    });
};

// Current user fetch hook
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: ['user', "my-details"],
        retry: (failureCount) => {
            return failureCount < 3;
        },
        queryFn: async () => {
            const response = await userAPI.getCurrentUser();
            const user = response.data.role === AdminRole.Merchant ? new Merchant(response.data) : new Admin(response.data);
            return user;
        },
    });
};
// Current user fetch hook
export const useGetCurrentMerchant = () => {
    return useQuery({
        queryKey: ['user', "merchangt"],
        retry: (failureCount) => {
            return failureCount < 3;
        },
        queryFn: userAPI.getCurrentUser,
    });
};

// User update hook
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation(
        {
            mutationFn: userAPI.updateUser,
            onSuccess: () => {
                queryClient.invalidateQueries({
                    predicate: query => query.queryKey[0] === 'user',
                });
            },
        }
    );
};

export const useAdminLogin = () => {
    return useMutation<AxiosResponse<any, any>, AxiosError<any, any>, any>({
        mutationFn: userAPI.login,
        onSuccess: (data) => {
            toast.success("Login successful");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message ?? "Error logging in");
        },
    });
}