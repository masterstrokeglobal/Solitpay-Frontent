"use client";
import LoadingScreen from "@/components/common/loading-screen";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCreateMerchantDocument, useGetMerchantDocumentByMerchantId, useUpdateMerchantDocument } from "./api/merchant-query";
import MerchantDocumentForm, { MerchantDocumentFormValues } from "./merchant-documents-form";

type Props = {
    merchantId: string;
}

const CreateMerchantDocumentForm = ({merchantId}:Props) => {
    const router = useRouter();

    const { data: merchantData, isSuccess, isError, isLoading } = useGetMerchantDocumentByMerchantId(merchantId.toString() || "");
    const defaultValues: MerchantDocumentFormValues|null = useMemo(() => {
        if (isSuccess && merchantData?.data) {
            return merchantData.data;
        }

        if (isError)
            return {
                moa: "",
                aoa: "",
                companyPanCard: "",
                companyGSTNumber: "",
                cio: "",
                cancelledCheque: "",
                rentAgreement: "",
                officeVideo: "",
                officePhotos: [],
                directorAadharCardFront: "",
                directorAadharCardBack: "",
                directorPan: "",
            };

        return null;
    }, [merchantData, isSuccess, isError]);

    const { mutate: createMerchantDocument, isPending:createPending } = useCreateMerchantDocument();
    const {mutate:updateMerchantDocument,isPending:updatePending} = useUpdateMerchantDocument();

    const onSubmit = (data: MerchantDocumentFormValues) => {
        if (isSuccess) {
            updateMerchantDocument({
                ...data, merchant: merchantId,
                id : merchantData?.data?.id
            }, {
                onSuccess: () => {
                    router.push(`/dashboard/merchants/${merchantId}`);
                }
            });
        } else {
            createMerchantDocument({
                ...data, merchant: merchantId
            }, {
                onSuccess: () => {
                    router.push(`/dashboard/merchants/${merchantId}`);
                },
            });
        }
    }

    return (
        <section className="flex flex-col gap-4 p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
            <h1 className="text-2xl font-bold text-white">Save Merchant Document</h1>
            {isLoading && <LoadingScreen className="min-h-96" />}
            {defaultValues !== null && (
                <MerchantDocumentForm 
                    onSubmit={onSubmit} 
                    isLoading={createPending || updatePending || isLoading} 
                    defaultValues={defaultValues} 
                />
            )}
        </section>
    );
}

export default CreateMerchantDocumentForm;
