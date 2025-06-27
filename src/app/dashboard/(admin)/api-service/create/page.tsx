"use client";

import { Separator } from "@/components/ui/separator";
import ApiServiceForm from "@/features/api-service/components/api-service-form";
import { ApiServiceSchemaType } from "@/features/api-service/components/api-service-form";
import { useCreateAPIService } from "@/features/api-service/api/api-service-query";
import { useRouter } from "next/navigation";
        
const defaultValues: ApiServiceSchemaType = {
    name: "",
    description: "",
    price: 0,
    active: true,
    imageUrl: "",
};

const CreateApiService = () => {
    const { mutate: createApiService, isPending } = useCreateAPIService();
    const router = useRouter();

    const onSubmit = (data: ApiServiceSchemaType) => {
        createApiService(data, {
            onSuccess: () => {
                router.push("/dashboard/api-service");
            }
        });
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <div className="border-white/20 bg-white/10 max-w-2xl mx-auto backdrop-blur-md shadow-lg rounded-lg p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white">Create API Service</h3>
                        <p className="text-sm text-white/70">
                            Add a new API service to the system
                        </p>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="max-w-2xl">
                        <ApiServiceForm onSubmit={onSubmit} isLoading={isPending} defaultValues={defaultValues} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateApiService;