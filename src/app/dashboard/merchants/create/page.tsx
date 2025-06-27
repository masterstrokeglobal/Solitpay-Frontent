"use client";

import { Separator } from "@/components/ui/separator";
import { useCreateMerchant } from "@/features/merchant/api/merchant-query";
import MerchantForm, { MerchantFormValues } from "@/features/merchant/merchant-form";
import { useRouter } from "next/navigation";

const defaultValues: MerchantFormValues = {
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyAddress: "",
    companyGSTNumber: "",
    platformFeePercentage: 0,
};

const CreateMerchantPage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateMerchant();

    const onSubmit = (data: MerchantFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/merchants");
            },
        });
    };

    return (
        <section className="container-main min-h-[60vh] mx-auto">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Create Merchant</h2>
            </header>
            <Separator className="mt-4 bg-white/10" />
            <main className="mt-4">
                <MerchantForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isLoading={isPending} // Loading state to show while creating
                />
            </main>
        </section>
    );
};

export default CreateMerchantPage;
