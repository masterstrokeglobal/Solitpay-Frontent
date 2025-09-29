"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WithdrawalType } from "@/models/user-withdrawl";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCreateUserWithdrawal } from "@/features/user-withdrawl/api/user-withdrawl-query";
import FormProvider from "@/components/form/form-provider";
import FormInput from "@/components/form/form-input";
import FormGroupSelect from "@/components/form/form-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useGetMerchantById } from "@/features/merchant/api/merchant-query";
import Merchant, { APIS } from "@/models/merchant";
import { appName } from "@/lib/utils";

const withdrawalFormSchema = z
    .object({
        userName: z.string().min(1, { message: "User name is required" }),
        userEmail: z.string().email({ message: "Invalid email format" }),
        type: z.nativeEnum(WithdrawalType),
        amount: z.coerce.number().min(1, { message: "Amount must be greater than 0" }),
        UPIId: z.string().optional(),
        accountName: z.string().optional(),
        accountNumber: z.string().optional(),
        ifscCode: z.string().optional(),
        bankName: z.string().optional(),
    })
    .refine((data) => {
        if (data.type === WithdrawalType.UPI && !data.UPIId) {
            return false;
        }
        if (data.type !== WithdrawalType.UPI && (!data.accountName || !data.accountNumber || !data.ifscCode || !data.bankName)) {
            return false;
        }
        return true;
    }, {
        message: "Required fields missing",
    });

export type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>;

const WithdrawalForm = () => {
    const { id: merchantId } = useParams();
    const [success, setSuccess] = useState(false);

    const { data, isSuccess } = useGetMerchantById(merchantId!.toString());

    const merchant = useMemo(() => {
        if (isSuccess) {
            return new Merchant(data?.data);
        }
        return null;
    }, [data]);

    const form = useForm<WithdrawalFormValues>({
        resolver: zodResolver(withdrawalFormSchema),
        defaultValues: {
            type: WithdrawalType.UPI,
            amount: 0,
            UPIId: "",  // Ensure empty string instead of undefined
            accountName: "",
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            userEmail: "",
            userName: ""
        }
    });

    const { mutate, isPending } = useCreateUserWithdrawal();
    const watchType = form.watch("type");

    const onSubmit = (data: WithdrawalFormValues) => {
        mutate({ ...data, merchantId }, {
            onSuccess: () => {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    form.reset();

                }, 3000);
            },
        });
    };

    if (merchant?.isRestricted(APIS.USER_WITHDRAW)) {
        return <h1>Restricted</h1>;
    }

    return (
        <Card className="max-w-xl mx-auto border mt-10 border-gray-200 shadow-lg bg-white rounded-lg">
            <CardHeader className="bg-primary text-white py-4 rounded-t-lg">
                <CardTitle className="text-center text-white text-xl font-bold">
                    User Withdrawal Request
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)}>

                    <div className="flex flex-col gap-5">
                        <FormInput control={form.control} label="Name" name="userName" />
                        <FormInput control={form.control} label="Email" name="userEmail" type="email" />

                        <FormGroupSelect
                            control={form.control}
                            label="Withdrawal Type"
                            name="type"
                            options={[
                                { label: "RTGS", value: WithdrawalType.RTGS },
                                { label: "NEFT", value: WithdrawalType.NEFT },
                                { label: "IMPS", value: WithdrawalType.IMPS },
                                { label: "UPI", value: WithdrawalType.UPI },
                            ]}
                        />

                        {watchType === WithdrawalType.UPI && (
                            <FormInput control={form.control} label="UPI ID" name="UPIId" />
                        )}

                        {watchType !== WithdrawalType.UPI && (
                            <>
                                <FormInput control={form.control} label="Account Name" name="accountName" />
                                <FormInput control={form.control} label="Account Number" name="accountNumber" />
                                <FormInput control={form.control} label="IFSC Code" name="ifscCode" />
                                <FormGroupSelect
                                    control={form.control}
                                    label="Bank Name"
                                    name="bankName"
                                    options={[
                                        { label: "State Bank of India (SBI)", value: "SBI" },
                                        { label: "HDFC Bank", value: "HDFC" },
                                        { label: "ICICI Bank", value: "ICICI" },
                                        { label: "Axis Bank", value: "AXIS" },
                                        { label: "Punjab National Bank", value: "PNB" },
                                        { label: "Kotak Mahindra Bank", value: "KOTAK" },
                                        { label: "Union Bank of India", value: "UNION" },
                                        { label: "Bank of Baroda", value: "BOB" },
                                        { label: "Citibank", value: "CITI" },
                                        { label: "HSBC", value: "HSBC" },
                                        { label: "Standard Chartered", value: "SC" },
                                        { label: "Deutsche Bank", value: "DB" },
                                    ]}
                                />
                            </>
                        )}

                        <FormInput control={form.control} label="Amount" name="amount" type="number" />

                        <Button disabled={isPending} className="w-full text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-md">
                            {isPending ? "Processing..." : "Submit Withdrawal"}
                        </Button>
                    </div>
                </FormProvider>

                {success && (
                    <motion.div
                        className="flex items-center justify-center text-green-600 mt-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <CheckCircle size={40} />
                        <span className="ml-2 font-medium">Withdrawal Successful!</span>
                    </motion.div>
                )}
            </CardContent>

            {/* Powered By Section */}
            <div className="text-center text-gray-500 text-sm py-3 border-t">
                Powered by <span className="font-semibold text-blue-600">{appName}</span>
            </div>
        </Card>
    );
};

export default WithdrawalForm;
