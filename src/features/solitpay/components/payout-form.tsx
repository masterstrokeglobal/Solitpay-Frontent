"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormProvider from "@/components/form/form-provider";
import FormGroupInput from "@/components/form/form-input";
import { toast } from "sonner";
import { initiateSolitpayPayout } from "../api/solitpay-api";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  amount: z.coerce.number().positive(),
  account_number: z.string().min(6),
  ifsc_code: z.string().min(4),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SolitpayPayoutForm() {
  const [loading, setLoading] = useState(false);
  const [txnRef, setTxnRef] = useState<string>("");
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const merchantTxnId = `TXN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const res = await initiateSolitpayPayout({
        ...values,
        merchantTxnId,
      });
      const ref = res?.data?.transaction?.txnReference ?? merchantTxnId;
      setTxnRef(ref);
      toast.success("Payout initiated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to initiate payout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormGroupInput control={form.control} name="name" label="Beneficiary Name" placeholder="John Doe" />
        <FormGroupInput control={form.control} name="phone" label="Phone" placeholder="9876543210" />
        <FormGroupInput control={form.control} name="amount" label="Amount (INR)" placeholder="100.00" />
        <FormGroupInput control={form.control} name="account_number" label="Account Number" placeholder="XXXXXXXXXXXX" />
        <FormGroupInput control={form.control} name="ifsc_code" label="IFSC" placeholder="ICIC0001790" />
        <FormGroupInput control={form.control} name="notes" label="Notes (optional)" placeholder="Payout note" />
        <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Initiate Payout"}</Button>
      </FormProvider>
      {txnRef && (
        <div className="mt-3 text-sm">
          <div><b>Txn Reference:</b> {txnRef}</div>
        </div>
      )}
    </div>
  );
}


