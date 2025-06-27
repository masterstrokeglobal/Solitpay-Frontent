import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FormMultiImageUpload from "@/components/form/form-multiimage";
import FormProvider from "@/components/form/form-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormImage from "@/components/ui/form-image";

// Define schema for merchant document input
export const createMerchantDocumentSchema = z.object({
    moa: z.string().url("Must be a valid URL"),
    aoa: z.string().url("Must be a valid URL"),
    companyPanCard: z.string().url("Must be a valid URL"),
    companyGSTNumber: z.string().url("Must be a valid URL"),
    cio: z.string().url("Must be a valid URL"),
    cancelledCheque: z.string().url("Must be a valid URL"),
    rentAgreement: z.string().url("Must be a valid URL"),
    officeVideo: z.string().url("Must be a valid URL"),
    officePhotos: z.array(z.string().url("Each photo must be a valid URL")),
    directorAadharCardFront: z.string().url("Must be a valid URL"),
    directorAadharCardBack: z.string().url("Must be a valid URL"),
    directorPan: z.string().url("Must be a valid URL"),
});

export type MerchantDocumentFormValues = z.infer<typeof createMerchantDocumentSchema>;

type Props = {
    defaultValues?: MerchantDocumentFormValues;
    onSubmit: (data: MerchantDocumentFormValues) => void;
    isLoading?: boolean;
};

const MerchantDocumentForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<MerchantDocumentFormValues>({
        resolver: zodResolver(createMerchantDocumentSchema),
        defaultValues: defaultValues
    });

    const handleSubmit = (data: MerchantDocumentFormValues) => {
        onSubmit(data);
    };

    const values = form.watch();
    console.log(values);
    return (
        <FormProvider onSubmit={form.handleSubmit(handleSubmit)} methods={form}>
            <div className="space-y-8">
                {/* MOA and AOA */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                    <CardHeader>
                        <CardTitle className="text-white">Incorporation Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormImage
                                control={form.control}
                                name="moa"
                                label="Memorandum of Association (MOA)*"
                                glass={true}
                            />
                            <FormImage
                                control={form.control}
                                name="aoa"
                                label="Articles of Association (AOA)*"
                                glass={true}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Company Registration Documents */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                    <CardHeader>
                        <CardTitle className="text-white">Company Registration Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormImage
                                control={form.control}
                                name="companyPanCard"
                                label="Company PAN Card*"
                                glass
                            />
                            <FormImage
                                control={form.control}
                                name="companyGSTNumber"
                                label="Company GST Certificate*"
                                glass={true}
                            />
                            <FormImage
                                control={form.control}
                                name="cio"
                                label="Certificate of Incorporation*"
                                glass={true}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Financial and Office Documents */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                    <CardHeader>
                        <CardTitle className="text-white">Financial and Office Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormImage
                                control={form.control}
                                name="cancelledCheque"
                                label="Cancelled Cheque*"
                                glass={true}
                            />
                            <FormImage
                                control={form.control}
                                name="rentAgreement"
                                label="Rent Agreement*"
                                glass={true}
                            />
                            <FormImage
                                control={form.control}
                                name="officeVideo"
                                label="Office Video*"
                                glass={true}
                            />
                        </div>
                        <FormMultiImageUpload
                            control={form.control}
                            name="officePhotos"
                            label="Office Photos*"
                            glass={true}
                        />
                    </CardContent>
                </Card>

                {/* Director Documents */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                    <CardHeader>
                        <CardTitle className="text-white">Director Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormImage
                                control={form.control}
                                name="directorAadharCardFront"
                                label="Director Aadhar Card (Front)*"
                                glass={true}
                            />
                            <FormImage
                                control={form.control}
                                name="directorAadharCardBack"
                                label="Director Aadhar Card (Back)*"
                                glass={true}
                            />
                            <FormImage
                                control={form.control}
                                name="directorPan"
                                label="Director PAN Card*"
                                glass={true}
                                />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()} className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                    {isLoading ? "Saving..." : "Save Documents"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default MerchantDocumentForm;