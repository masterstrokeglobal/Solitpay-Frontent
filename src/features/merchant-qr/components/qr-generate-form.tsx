"use client";

import FormInput from '@/components/form/form-input';
import FormSwitch from '@/components/form/form-switch';
import { Button } from "@/components/ui/button";
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { merchantQrFormSchema, MerchantQrFormValues } from '../type';

interface QRGenerateFormProps {
    onSubmit: (values: MerchantQrFormValues) => Promise<void>;
    isGenerating: boolean;
    title?: string;
    description?: string;
    defaultValues?: Partial<MerchantQrFormValues>;
}

export const QRGenerateForm = ({ onSubmit, isGenerating, defaultValues, title = "Generate New QR Code", description = "Create a new QR code for your bank account" }: QRGenerateFormProps) => {
    const form = useForm<MerchantQrFormValues>({
        resolver: zodResolver(merchantQrFormSchema),
        defaultValues: {
            accountName: defaultValues?.accountName ?? "",
            accountNumber: defaultValues?.accountNumber ?? "",
            bankName: defaultValues?.bankName ?? "",
            upiId: defaultValues?.upiId ?? "",
            ifscCode: defaultValues?.ifscCode ?? "",
            isActive: defaultValues?.isActive ?? true
        }
    });

    return (
        <div >
            <DialogHeader className="mb-6">
                <DialogTitle className="text-white text-xl font-semibold">{title}</DialogTitle>
                <DialogDescription className="text-white/80">
                    {description}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            control={form.control}
                            name='accountName'
                            label='Account Name'
                            glass={true}
                        />

                        <FormInput
                            control={form.control}
                            name='accountNumber'
                            label='Account Number'
                            glass={true}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            control={form.control}
                            name='bankName'
                            label='Bank Name'
                            glass={true}
                        />

                        <FormInput
                            control={form.control}
                            name='upiId'
                            label='UPI ID'
                            glass={true}
                        />
                    </div>

                    <FormInput
                        control={form.control}
                        name='ifscCode'
                        label='IFSC Code'
                        glass={true}
                    />

                    <FormSwitch
                        control={form.control}
                        name="isActive"
                        label="Active Status"
                        description="Set whether this QR code is active"
                        glass={true}
                    />

                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            className='w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/25 backdrop-blur-sm transition-all duration-300'
                            disabled={isGenerating}
                        >
                            {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isGenerating ? "Generating..." : "Generate QR Code"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </div>
    );
};