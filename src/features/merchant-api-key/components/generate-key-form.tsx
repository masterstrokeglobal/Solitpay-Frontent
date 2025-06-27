"use client";

import React from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Key } from "lucide-react";
import { ApiKeyMode, ApiKeyStatus } from '@/models/merchant-api';
import FormInput from '@/components/form/form-input';
import FormSelect from '@/components/form/form-select';
import FormProvider from '@/components/form/form-provider';

const apiKeySchema = z.object({
    ipAddress: z.string()
        .min(1, "IP Address is required")
        .refine(
            (val) => /^(\d{1,3}\.){3}\d{1,3}$|^(\*\.\d{1,3}\.){2}\d{1,3}$|^\*$/.test(val),
            "Please enter a valid IP address format (e.g., 192.168.1.1 or *.168.1.1 or *)"
        ),
    mode: z.string({
        required_error: "Please select a mode"
    }).min(1, "Please select a mode"),
});

type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

// Dropdown options for mode selection
const modeOptions = [
    { label: ApiKeyMode.LIVE_MODE, value: ApiKeyMode.LIVE_MODE },
    { label: ApiKeyMode.TEST_MODE, value: ApiKeyMode.TEST_MODE },
];

interface ApiKeyGeneratorFormProps {
    onSubmit: (data: ApiKeyFormValues) => void;
    isLoading?: boolean;
}

const ApiKeyGeneratorForm = ({
    onSubmit,
    isLoading = false,
}: ApiKeyGeneratorFormProps) => {
    const form = useForm<ApiKeyFormValues>({
        resolver: zodResolver(apiKeySchema),
        defaultValues: {
            ipAddress: '',
            mode: ApiKeyMode.TEST_MODE,
        }
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full ">
            <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                    name="ipAddress"
                    label="IP Address"
                    type="text"
                    control={control}
                    glass       
                    placeholder="192.168.1.1 or *.168.1.1 or *"
                    description='Enter the IP address that will be allowed to use this API key. Use "*" to allow all IP addresses.'
                />

                <FormSelect
                    control={control}
                    options={modeOptions}   
                    label="API Key Mode"
                    name="mode"
                    placeholder="Select API Key Mode"
                    glass
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating API Key
                        </>
                    ) : (
                        "Generate API Key"
                    )}
                </Button>
            </FormProvider>
        </div>
    );
};

export default ApiKeyGeneratorForm;