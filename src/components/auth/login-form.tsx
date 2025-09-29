"use client";
import { useAdminLogin } from "@/features/authentication/query/user";
import { useCreateLoginLog } from "@/features/login-logs/api/login-log-query";
import { AdminRole } from "@/models/admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDeviceInfo } from "../common/use-device-info";
import FormInput from "../form/form-input";
import FormPassword from "../form/form-password";
import FormProvider from "../form/form-provider";
import FormGroupSelect from "../form/form-select";
import { Button } from "../ui/button";

const loginFormSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email format" })
        .max(255, { message: "Email must be less than 255 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

const defaultValues: LoginFormValues = {
    email: "",
    password: "",
};

const LoginForm = () => {
    const router = useRouter();
    const { mutate, isPending } = useAdminLogin();
    const { mutate: createLoginLog } = useCreateLoginLog();
    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues,
    });

    const deviceInfo = useDeviceInfo();
    const onSubmit = (formValue: LoginFormValues) => {
        mutate({ ...formValue, loginAs: AdminRole.SUPER_ADMIN }, {
            onSuccess: (data: AxiosResponse<any>) => {
                router.push("/dashboard");
            }
        });
    };

    return (
        <FormProvider className="w-full space-y-3" methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput
                control={form.control}
                label="Email"
                placeholder="Enter your email"
                name="email"
                type="email"
                glass
            />
            <FormPassword
                control={form.control}
                label="Password"
                glass
                placeholder="Enter your password"
                name="password"
            />
            {/* Removed merchant/admin dropdown per request; always admin login */}
            <div className="space-y-2 pt-2">
                <Button disabled={isPending} className="block w-full"  >
                    Login
                </Button>
            </div>
        </FormProvider>
    );
};

export default LoginForm;