"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCreateMerchantApiKey } from '../api/merchant-api-query';
import ApiKeyGeneratorForm from './generate-key-form';
import { cn } from "@/lib/utils";

interface ApiKeyFormValues {
    ipAddress: string;
    mode: string;
}

interface CreateApiKeyDialogProps {
    children: React.ReactNode;  // For DialogTrigger
    merchantId?: number;        // Optional merchantId if needed for the API call
    onSuccess?: () => void;     // Optional callback for after successful creation
}

const CreateApiKeyDialog = ({
    children,
    merchantId,
    onSuccess
}: CreateApiKeyDialogProps) => {
    const [open, setOpen] = React.useState(false);
    const { mutate, isPending } = useCreateMerchantApiKey();

    const onSubmit = (data: ApiKeyFormValues) => {
        // Prepare data for API call
        const apiKeyData = {
            ...data,
            merchantId
        };

        mutate(apiKeyData, {
            onSuccess: (response) => {
                setOpen(false);

                // Copy API key to clipboard if available in response
                if (response?.data.headerKey) {
                    navigator.clipboard.writeText(response.data.headerKey)
                        .then(() => {
                            toast.success("API key copied to clipboard");
                        })
                        .catch(() => {
                            toast.info("Please copy your API key now - it won't be shown again");
                        });
                }

                if (onSuccess) {
                    onSuccess();
                }
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className={cn(
                "sm:max-w-[500px] bg-white/10 backdrop-blur-2xl border border-white/20",
                "shadow-2xl shadow-black/30 text-white",
                "hover:shadow-white/5 transition-all duration-300"
            )}>
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl font-semibold text-white/90  p-4 ">
                        Create New API Key
                    </DialogTitle>
                    <DialogDescription className="text-white/70 bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-2xl border border-white/10 p-3 rounded-lg shadow-lg shadow-black/15">
                        Configure and generate a new API key for merchant integration.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4 h-px bg-gradient-to-r from-white/20 via-white/10 to-white/20 shadow-lg shadow-black/20" />
                <ApiKeyGeneratorForm
                    onSubmit={onSubmit}
                    isLoading={isPending}
                />
            </DialogContent>
        </Dialog>
    );
};

export default CreateApiKeyDialog;