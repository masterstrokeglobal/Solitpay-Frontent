"use client";

import { Download, Share2, Trash } from 'lucide-react';
import { useState, useRef } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MerchantQr, MerchantQrFormValues } from '../type';
import QRCode from './custom-qr-code';
import { useDeleteMerchantQr, useUpdateMerchantQr } from '../api/merchant-qr-query';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { QRGenerateForm } from './qr-generate-form';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QRDisplayProps {
    qrCode: MerchantQr;
}

export const QRDisplay = ({ qrCode }: QRDisplayProps) => {
    const [copied, setCopied] = useState(false);
    const qrCodeRef = useRef(null);
    const { mutateAsync: deleteQr, isPending: isDeleting } = useDeleteMerchantQr();

    const handleCopyLink = () => {
        if (qrCode?.upiId) {
            navigator.clipboard.writeText(qrCode.upiId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        if (!qrCode?.qrCode || !qrCodeRef.current) return;

        // Create a canvas from the QR code element
        const qrElement = qrCodeRef.current;

        // Use html2canvas (you'll need to install this package)
        import('html2canvas').then((html2canvas) => {
            html2canvas.default(qrElement).then((canvas) => {
                // Convert canvas to image data URL
                const imageData = canvas.toDataURL('image/png');

                // Create a download link
                const downloadLink = document.createElement('a');
                downloadLink.href = imageData;
                downloadLink.download = `qrcode_${qrCode.upiId || 'merchant'}.png`;

                // Trigger download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            });
        });
    };

    const formattedDate = qrCode?.updatedAt
        ? format(new Date(qrCode.updatedAt), 'PPP p')
        : 'N/A';

    return (
        <Card className="lg:col-span-2 border-2">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{qrCode?.upiId || 'Active QR Code'}</CardTitle>
                        <CardDescription>
                            Last updated: {formattedDate}
                        </CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        className="border-green-500 text-green-600"
                    >
                        Active
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                <div className="bg-gradient-to-b from-white to-gray-50 rounded-xl border-2 border-gray-100 p-8">
                    <div className="flex justify-center">
                        <div
                            ref={qrCodeRef}
                            className="relative group bg-white p-6 rounded-lg shadow-sm"
                        >
                            {qrCode?.upiId ? (
                                <QRCode merchantQr={qrCode} />
                            ) : (
                                <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                                    <p className="text-gray-500">No QR Code Available</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all rounded-lg" />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="grid grid-cols-2 gap-4">
                <UpdateQrMerchant qrCode={qrCode} />
                <Button
                    variant="outline"
                    onClick={() => deleteQr(qrCode.id.toString())}
                    disabled={isDeleting}
                >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            </CardFooter>
            <CardFooter className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={!qrCode?.qrCode}
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                </Button>
                <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    disabled={!qrCode?.upiId}
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Share'}
                </Button>
            </CardFooter>
        </Card>
    );
};



type Props = {
    qrCode: MerchantQr;
}

export const UpdateQrMerchant = ({ qrCode }: Props) => {
    const createMutation = useUpdateMerchantQr();

    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const handleGenerateNewQR = async (values: MerchantQrFormValues): Promise<void> => {
        try {
            await createMutation.mutateAsync({ qrId: qrCode.id.toString(), data: values });
        } catch (error) {
            console.error('Error generating QR:', error);
        }
    };
    return (

        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Update QR
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogClose ref={closeButtonRef} />
                <ScrollArea className="h-[80vh]">
                    <QRGenerateForm onSubmit={handleGenerateNewQR} isGenerating={createMutation.isPending} defaultValues={qrCode}
                        title="Update QR Code"
                        description="Update the details of your QR code"
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};