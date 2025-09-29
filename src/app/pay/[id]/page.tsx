"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTransaction } from "@/features/transaction/query/transactions-queries";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import FormProvider from "@/components/form/form-provider";
import FormInput from "@/components/form/form-input";
import { useGetMerchantById } from "@/features/merchant/api/merchant-query";
import MerchantQRCarousel from "@/features/merchant-qr/components/qr-carousel";
import Merchant, { APIS } from "@/models/merchant";

const paymentFormSchema = z.object({
  pgId: z.string().min(1, { message: "Transaction ID is required" }),
  amount: z.string().min(1, { message: "Amount is required" }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const defaultValues: PaymentFormValues = {
  pgId: "",
  amount: "",
};

const PaymentPage = () => {
  const { id: merchantId } = useParams();

  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, data, isPending } = useCreateTransaction();
  const { data: merchantData } = useGetMerchantById(merchantId!.toString());

  const merchant = new Merchant(merchantData?.data);


  const form = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  const onSubmit = (formValue: PaymentFormValues) => {
    mutate(
      {
        ...formValue,
        amount: parseFloat(formValue.amount),
        merchantId,
        type: "deposit",
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          // Reset form after 2 seconds
          setTimeout(() => {
            setIsSuccess(false);
            form.reset();
          }, 2000);
        },
      }
    );
  };

  if (merchant.isRestricted(APIS.MERCHANT_PAYIN)) return <h1>Restricted</h1>;


  return (
    <section className="p-4 flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md relative overflow-hidden">
        <div
          className={`transition-opacity duration-500 ${isSuccess ? "opacity-0" : "opacity-100"
            }`}
        >
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Payment Details</h2>
            {merchant && (
              <p className="text-center text-gray-500">
                Merchant Name: {merchant.name}
              </p>
            )}
            <MerchantQRCarousel merchantId={merchantId as string} />
          </CardHeader>

          <CardContent className="space-y-6">


            <FormProvider
              className="space-y-4"
              methods={form}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormInput
                control={form.control}
                label="Transaction ID"
                name="pgId"
                placeholder="Enter transaction ID"
                className="transition-all duration-300 hover:border-primary focus:ring-2 focus:ring-primary"
              />

              <FormInput
                control={form.control}
                label="Amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                className="transition-all duration-300 hover:border-primary focus:ring-2 focus:ring-primary"
              />

              <Button
                type="submit"
                className={`relative w-full h-11 transition-all duration-300
                    ${isSuccess ? "bg-green-500 hover:bg-green-600" : ""}
                    ${isPending ? "cursor-not-allowed opacity-80" : ""}
                `}
                disabled={isPending || isSuccess}
              >
                <span
                  className={`flex items-center justify-center gap-2 transition-opacity duration-300 
                    ${isPending || isSuccess ? "opacity-0" : "opacity-100"}`}
                >
                  Submit Deposit
                </span>

                {isPending && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </span>
                )}

                {isSuccess && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </FormProvider>
          </CardContent>
        </div>

        {/* Success Message Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-white/95 transition-opacity duration-500
                    ${isSuccess ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-green-600">
              Payment Successful!
            </h3>
            {data && (
              <p className="text-gray-600">
                Transaction ID: {data.data.id}
              </p>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default PaymentPage;