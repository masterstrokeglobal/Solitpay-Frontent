"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { initiateSolitpayPayment } from "../api/solitpay-api";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/form/form-provider";
import FormGroupInput from "@/components/form/form-input";
import { toast } from "sonner";
import { useAuthStore } from "@/context/auth-context";

const schema = z.object({
  amount: z.coerce.number().positive(),
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_mobile: z.string().min(8),
  merchantId: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SolitpayInitiateForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { userDetails } = useAuthStore();

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const payload: any = {
        amount: values.amount,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_mobile: values.customer_mobile,
        return_url: `${window.location.origin}/pay/return`,
      };
      if (userDetails?.role === "admin" && values.merchantId) {
        payload.merchantId = values.merchantId;
      }
      const res = await initiateSolitpayPayment(payload);
      window.location.href = res.payment_url;
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {userDetails?.role === "admin" && (
        <FormGroupInput control={form.control} name="merchantId" label="Merchant ID (admin only)" placeholder="123" />
      )}
      <FormGroupInput control={form.control} name="amount" label="Amount (INR)" placeholder="100.00" />
      <FormGroupInput control={form.control} name="customer_name" label="Customer Name" placeholder="John Doe" />
      <FormGroupInput control={form.control} name="customer_email" label="Customer Email" placeholder="john@example.com" />
      <FormGroupInput control={form.control} name="customer_mobile" label="Customer Mobile" placeholder="919876543210" />
      <Button type="submit" disabled={loading}>{loading ? "Processing..." : "Pay with Solitpay"}</Button>
    </FormProvider>
  );
}


