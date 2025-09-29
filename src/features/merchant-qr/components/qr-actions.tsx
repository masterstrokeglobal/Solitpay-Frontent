"use client";

import { Plus } from 'lucide-react';


import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { QRGenerateForm } from './qr-generate-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogClose } from '@radix-ui/react-dialog';
import { useRef } from 'react';
import { useCreateMerchantQr } from '../api/merchant-qr-query';
interface CreateQRValues {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
    upiId: string;
}


export const QuickActions = () => {
    const createMutation = useCreateMerchantQr();

    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const handleGenerateNewQR = async (values: CreateQRValues): Promise<void> => {
        try {
            await createMutation.mutateAsync(values);
        } catch (error) {
            console.error('Error generating QR:', error);
        }
    };
    return (

        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New QR
                </Button>
            </DialogTrigger>
            <DialogContent glass className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-6 shadow-lg shadow-black/20">
                <DialogClose ref={closeButtonRef} />
                <ScrollArea className="h-[80vh] ">
                    <QRGenerateForm onSubmit={handleGenerateNewQR} isGenerating={createMutation.isPending} />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};