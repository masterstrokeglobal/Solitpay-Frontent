import React, { useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { MerchantDocumentFormValues } from './merchant-documents-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useGetMerchantDocumentByMerchantId } from './api/merchant-query';
import LoadingScreen from '@/components/common/loading-screen';
import { Button } from '@/components/ui/button';
import { Download, EyeIcon } from 'lucide-react';

const DocumentImage = ({
    label,
    url
}: {
    label: string,
    url?: string
}) => {
    if (!url) return null;

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <div className="border rounded-lg overflow-hidden">
                <img
                    src={url}
                    alt={label}
                    className="w-full h-auto object-cover"
                />
                <div className='flex w-full'>

                    <a
                        href={url}
                        target="_blank"
                        className='flex-1 w-full'
                        rel="noreferrer"
                    >
                        <Button variant="outline" className='w-full'>
                            <EyeIcon className="w-5 h-5 mr-2" />
                        </Button>
                    </a>
                    <a
                        href={url}
                        target="_blank"
                        className='flex-1'
                        rel="noreferrer"
                        download={label}
                    >
                        <Button variant="outline" className='w-full'><Download /></Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

const MerchantDocumentViewDialog = ({
    merchantId,
    children
}: {
    children: React.ReactNode,
    merchantId: string,
}) => {

    const { data: merchantData, isSuccess, isError, isLoading } = useGetMerchantDocumentByMerchantId(merchantId.toString() || "");
    const defaultValues: MerchantDocumentFormValues | null = useMemo(() => {
        if (isSuccess && merchantData?.data) {
            return merchantData.data;
        }
        return null;
    }, [merchantData, isSuccess, isError]);

    if (!defaultValues) return <LoadingScreen />;

    if (isError) return <p>Failed to load merchant documents</p>;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>
                    Merchant Documents
                </DialogTitle>
                <ScrollArea className='h-[60vh]'>
                    <div>
                        <div className="space-y-8 w-full">
                            {/* MOA and AOA */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Incorporation Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DocumentImage
                                        label="Memorandum of Association (MOA)"
                                        url={defaultValues.moa}
                                    />
                                    <DocumentImage
                                        label="Articles of Association (AOA)"
                                        url={defaultValues.aoa}
                                    />
                                </CardContent>
                            </Card>

                            {/* Company Registration Documents */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Company Registration Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DocumentImage
                                        label="Company PAN Card"
                                        url={defaultValues.companyPanCard}
                                    />
                                    <DocumentImage
                                        label="Company GST Certificate"
                                        url={defaultValues.companyGSTNumber}
                                    />
                                    <DocumentImage
                                        label="Certificate of Incorporation"
                                        url={defaultValues.cio}
                                    />
                                </CardContent>
                            </Card>

                            {/* Financial and Office Documents */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Financial and Office Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <DocumentImage
                                            label="Cancelled Cheque"
                                            url={defaultValues.cancelledCheque}
                                        />
                                        <DocumentImage
                                            label="Rent Agreement"
                                            url={defaultValues.rentAgreement}
                                        />
                                        <DocumentImage
                                            label="Office Video"
                                            url={defaultValues.officeVideo}
                                        />
                                    </div>
                                    {defaultValues.officePhotos && defaultValues.officePhotos.length > 0 && (
                                        <div className="mt-4 grid grid-cols-3 gap-4">
                                            {defaultValues.officePhotos.map((photoUrl, index) => (
                                                <DocumentImage
                                                    key={index}
                                                    label={`Office Photo ${index + 1}`}
                                                    url={photoUrl}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Director Documents */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Director Documents</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DocumentImage
                                        label="Director Aadhar Card (Front)"
                                        url={defaultValues.directorAadharCardFront}
                                    />
                                    <DocumentImage
                                        label="Director Aadhar Card (Back)"
                                        url={defaultValues.directorAadharCardBack}
                                    />
                                    <DocumentImage
                                        label="Director PAN Card"
                                        url={defaultValues.directorPan}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default MerchantDocumentViewDialog;