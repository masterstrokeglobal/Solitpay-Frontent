"use client";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUploadQrImage } from "@/features/merchant-qr/api/merchant-qr-query";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Control, FieldPath, FieldValues, useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface FormImageProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>;
    name: TName;
    label?: string;
    description?: string;
    className?: string;
    inputClassName?: string;
    accept?: string;
    glass?: boolean;
}

const FormImage = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    className,
    inputClassName,
    accept = "image/*",
    glass = false,
}: FormImageProps<TFieldValues, TName>) => {
    const { setValue, watch } = useFormContext();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const uploadImageMutation = useUploadQrImage();
    const fieldValue = watch(name);
    useEffect(() => {
        if (!fieldValue) {
            setPreviewUrl(null);
        }
    }, [fieldValue]);

    useEffect(() => {
        console.log(fieldValue)
        if (fieldValue) {
            setPreviewUrl(fieldValue);
        }
    },[]);

    const handleUpload = useCallback((file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        uploadImageMutation.mutate(formData, {
            onSuccess: (response) => {
                const uploadedFileUrl = response.data.fileUrl;
                setValue(name, uploadedFileUrl);
                setPreviewUrl(uploadedFileUrl);
            },
            onError: () => {
                setPreviewUrl(null);
                setValue(name, "" as unknown as TFieldValues[TName]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadImageMutation]);

    const handleRemove = useCallback(() => {
        setPreviewUrl(null);
        setValue(name, "" as unknown as TFieldValues[TName]);
        toast.info('Image removed');
    }, [setValue, name]);


    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange } }) => (
                <FormItem className={className}>
                    {label && <FormLabel className={glass ? "text-white" : ""}>{label}</FormLabel>}
                    <FormControl>
                        <div className="relative">
                            {previewUrl ? (
                                <div className={`relative rounded-xl pr-12 ${glass ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-gray-100"}`}>
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        width={160}
                                        height={160}
                                        className="w-auto h-40 rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className={`
                                        border-2 border-dashed rounded-lg p-6 
                                        cursor-pointer transition-colors
                                        ${glass 
                                            ? "bg-white/10 backdrop-blur-md border-white/20 hover:border-white/40 text-white" 
                                            : "bg-[#FAFAFA] border-[#E2E2E2] hover:border-gray-400"
                                        }
                                        ${inputClassName}
                                    `}
                                    onClick={() => document.getElementById(`file-${name}`)?.click()}
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Image
                                            width={32}
                                            height={32}
                                            alt="file"
                                            src="/images/file.svg"
                                            className="w-8 h-8"
                                        />

                                        {uploadImageMutation.isPending ? (
                                            <div className="flex items-center gap-2">
                                                <span>Uploading...</span>
                                            </div>
                                        ) : (
                                            <div className={`flex text-sm ${glass ? "text-white/70" : "text-gray-600"}`}>
                                                <p className="relative">
                                                    Drop a file here or
                                                    {" "}
                                                    <span className={`${glass ? "text-blue-300 hover:text-blue-200" : "text-blue-600 hover:underline"} hover:underline`}>browse</span>
                                                    {" "}to upload file
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <input
                                id={`file-${name}`}
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleUpload(file);
                                        onChange(file);
                                    }
                                }}
                                accept={accept}
                            />
                        </div>
                    </FormControl>
                    {description && <FormDescription className={glass ? "text-white/70" : ""}>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default FormImage;