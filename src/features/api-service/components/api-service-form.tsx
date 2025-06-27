import FormInput from "@/components/form/form-input";
import FormProvider from "@/components/form/form-provider";
import FormSwitch from "@/components/form/form-switch";
import FormTextArea from "@/components/form/form-text-area";
import { Button } from "@/components/ui/button";
import FormImage from "@/components/ui/form-image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const apiServiceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    active: z.boolean().default(true),
    imageUrl: z.string().url("Invalid URL format").optional().nullable(),
});

export type ApiServiceSchemaType = z.infer<typeof apiServiceSchema>;

type Props = {
    onSubmit: (data: ApiServiceSchemaType) => void;
    defaultValues?: ApiServiceSchemaType;
    isLoading?: boolean;
};

const ApiServiceForm = ({ onSubmit, defaultValues, isLoading }: Props) => {
    const form = useForm<ApiServiceSchemaType>({
        resolver: zodResolver(apiServiceSchema),
        defaultValues: defaultValues,
    });

    console.log(defaultValues);


    return (
        <section className="w-full">
            <FormProvider methods={form} className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormInput
                    control={form.control}
                    name="name"
                    glass
                    label="Name"
                    placeholder="Enter API service name"
                />

                <FormTextArea
                    control={form.control}
                    name="description"
                    glass
                    label="Description"
                    placeholder="Enter API service description"
                />

                <FormInput
                    control={form.control}
                    name="price"
                    glass
                    label="Price"
                    type="number"
                    placeholder="0.00"
                    description="Price in your default currency"
                />

                <FormSwitch
                    control={form.control}
                    name="active"
                    glass
                    label="Active"
                    description="If enabled, this API service will be available"
                />

                <FormImage
                    control={form.control}
                    name="imageUrl"
                    glass
                    label="Service Image"
                    description="Upload an image for this API service"
                />

                <Button type="submit" disabled={isLoading} className="mt-4 w-full">
                    {isLoading ? "Loading..." : "Submit"}
                </Button>
            </FormProvider>
        </section>
    );
};

export default ApiServiceForm;