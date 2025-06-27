"use client";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useUploadQrImage } from "@/features/merchant-qr/api/merchant-qr-query";
import { Upload, X } from "lucide-react";
import React, { useState, useCallback, useEffect } from 'react';
import { Control, FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface FormMultiImageUploadProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>;
    name: TName;
    label?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    maxFiles?: number;
    glass?: boolean;
}

function FormMultiImageUpload<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    placeholder = "Select or drag and drop images",
    className,
    disabled = false,
    maxFiles = 5,
    glass = false,
    ...props
}: FormMultiImageUploadProps<TFieldValues, TName>) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const { setValue, watch } = useFormContext();
    const uploadImageMutation = useUploadQrImage();

    // Watch the current field value to sync with form state
    const fieldValue = watch(name);

    useEffect(() => {
        // If the field value changes externally, update the state
        if (fieldValue && Array.isArray(fieldValue)) {
            setImageUrls(fieldValue);
        }
    }, [fieldValue]);

    const handleUpload = useCallback((file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        uploadImageMutation.mutate(formData, {
            onSuccess: (response) => {
                const uploadedFileUrl = response.data.fileUrl;
                
                // Update the image URLs
                const newUrls = [...imageUrls, uploadedFileUrl];
                setImageUrls(newUrls);
                
                // Update the form value
                setValue(name, newUrls as any);
                
                toast.success('Image uploaded successfully');
            },
            onError: () => {
                toast.error('Failed to upload image');
            }
        });
    }, [name, setValue, imageUrls, uploadImageMutation]);

    const handleRemove = useCallback((indexToRemove: number) => {
        const updatedUrls = imageUrls.filter((_, index) => index !== indexToRemove);
        
        setImageUrls(updatedUrls);
        setValue(name, updatedUrls as any);
        
        toast.info('Image removed');
    }, [name, setValue, imageUrls]);

    return (
        <FormField
            control={control}
            name={name}
            render={() => (
                <FormItem className={`${className} space-y-2`} {...props}>
                    {label && <FormLabel className={glass ? "text-white" : ""}>{label}</FormLabel>}

                    <div className="flex flex-col gap-2">
                        {imageUrls.length < maxFiles && (
                            <label
                                className={`
                                    flex items-center justify-center 
                                    border-2 border-dashed rounded-lg 
                                    p-4 cursor-pointer 
                                    transition-colors
                                    ${glass 
                                        ? 'bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white' 
                                        : 'hover:bg-gray-100'
                                    }
                                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleUpload(file);
                                        }
                                    }}
                                    disabled={disabled}
                                    className="hidden"
                                />
                                {!disabled && (
                                    <div className={`flex items-center gap-2 ${glass ? 'text-white' : 'text-gray-600'}`}>
                                        <Upload size={20} />
                                        <span>{placeholder}</span>
                                    </div>
                                )}
                            </label>
                        )}

                        {imageUrls.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {imageUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className={`relative rounded-lg overflow-hidden ${glass ? 'bg-white/10 backdrop-blur-md border border-white/20' : ''}`}
                                    >
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                        {!disabled && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(index)}
                                                className="
                                                    absolute top-1 right-1 
                                                    bg-red-500 text-white 
                                                    rounded-full p-1
                                                    hover:bg-red-600
                                                "
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default FormMultiImageUpload;