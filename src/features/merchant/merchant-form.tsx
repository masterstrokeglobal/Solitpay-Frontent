import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormInput from "@/components/form/form-input";
import FormPassword from "@/components/form/form-password";
import FormProvider from "@/components/form/form-provider";
import FormSwitch from "@/components/form/form-switch";
import FormTextArea from "@/components/form/form-text-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormImage from "@/components/ui/form-image";
import { z } from "zod";

// Define schema for merchant input
export const createMerchantInputSchema = (isEdit: boolean) => z.object({
    id: z.string().optional(),
    name: z.string().max(100),
    email: z.string().email(),
    password: isEdit 
        ? z.string().optional() 
        : z.string().min(8, { message: "Password must be at least 8 characters long" }),
    companyName: z.string().max(100),
    companyPanNumber: z.string().optional(),
    companyCINNumber: z.string().optional(),
    isVerified: z.boolean().optional(),
    companyAddress: z.string().max(200),
    companyGSTNumber: z.string().optional(),
    companyGSTImage: z.string().optional(),
    companyPANImage: z.string().optional(),
    companyCINImage: z.string().optional(),
    additionalVerificationInfo: z.string().optional(),
    platformFeePercentage: z.coerce.number().positive(),
});

export type MerchantFormValues = z.infer<ReturnType<typeof createMerchantInputSchema>>;

type Props = {
    defaultValues?: MerchantFormValues;
    onSubmit: (data: MerchantFormValues) => void;
    isLoading?: boolean;
    isEdit?: boolean;
};

const MerchantForm = ({ defaultValues, onSubmit, isLoading, isEdit = false }: Props) => {
    const form = useForm<MerchantFormValues>({
        resolver: zodResolver(createMerchantInputSchema(isEdit)),
        defaultValues,
    });

    const handleSubmit = (data: MerchantFormValues) => {
        onSubmit(data);
    };

    return (
        <FormProvider onSubmit={form.handleSubmit(handleSubmit)} methods={form}>
            <div className="space-y-8">
                {/* Basic Information */}
                <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
                    <CardHeader className="border-b border-white/10">
                        <CardTitle className="text-white/90 font-semibold">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <FormInput control={form.control} name="name" placeholder="Merchant Name*" glass  label="Merchant Name*" />
                        <FormInput control={form.control} name="email" placeholder="Email*" glass label="Email*" />
                        <FormPassword
                            control={form.control}
                            name="password"
                            label="Password*"
                            type="password"
                            placeholder="Password*"
                            glass
                        />
                    </CardContent>
                </Card>

                {/* Company Information */}
                <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
                    <CardHeader className="border-b border-white/10">
                        <CardTitle className="text-white/90 font-semibold">Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <FormInput
                            control={form.control}
                            name="companyName"
                            glass
                            placeholder="Company Name*"
                            label="Company Name*"
                        />
                        <FormTextArea
                            glass
                            control={form.control}
                            name="companyAddress"
                            placeholder="Company Address*"
                            label="Company Address*"
                        />
                    </CardContent>
                </Card>

                {/* Platform Settings */}
                <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
                    <CardHeader className="border-b border-white/10">
                        <CardTitle className="text-white/90 font-semibold">Platform Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <FormInput
                            control={form.control}
                            name="platformFeePercentage"
                            type="number"
                            glass
                            label="Platform Fee Percentage*"
                        />
                        <FormSwitch
                            control={form.control}
                            glass
                            name="isVerified"
                            label="Is Verified"
                            description="If the merchant is verified, it will be shown in the dashboard"
                        />
                    </CardContent>
                </Card>
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => form.reset()}
                    className="backdrop-blur-md bg-white/10 border-white/20 text-white/90 hover:bg-white/20 transition-all duration-300"
                >
                    Reset
                </Button>
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="backdrop-blur-md bg-blue-500/80 border-blue-400/30 text-white hover:bg-blue-500/90 transition-all duration-300 shadow-lg"
                >
                    {isLoading ? "Saving..." : "Save Merchant"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default MerchantForm;