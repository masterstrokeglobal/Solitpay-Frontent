"use client";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormProvider from "@/components/form/form-provider";
import FormInput from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const schema = z.object({
  custTxnRefNo: z.string().min(3),
  externalReferenceNumber: z.string().optional(),
  txnType: z.enum(["IMPS", "NEFT", "RTGS"]),
  amount: z.coerce.number().positive(),
  valueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  benName: z.string().min(2),
  benIFSC: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, "Invalid IFSC"),
  benAcctNo: z.string().min(6),
  benEmail: z.string().email().optional().or(z.literal("")).optional(),
  benMobile: z.string().optional(),
  description: z.string().optional(),
  remark1: z.string().optional(),
  remark2: z.string().optional(),
  remark3: z.string().optional(),
});

export type PayoutInitiateFormValues = z.infer<typeof schema>;

type Props = {
  onSubmit: (values: PayoutInitiateFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
};

const PayoutInitiateForm = ({ onSubmit, isSubmitting = false }: Props) => {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const form = useForm<PayoutInitiateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      custTxnRefNo: "",
      externalReferenceNumber: "",
      txnType: "IMPS",
      amount: 1,
      valueDate: today,
      benName: "",
      benIFSC: "",
      benAcctNo: "",
      benEmail: "",
      benMobile: "",
      description: "",
      remark1: "",
      remark2: "",
      remark3: "",
    },
  });

  return (
    <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="custTxnRefNo" control={form.control} label="Customer Txn Ref No" glass />
        <FormInput name="externalReferenceNumber" control={form.control} label="External Ref No (optional)" glass />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput name="txnType" control={form.control} label="Txn Type (IMPS/NEFT/RTGS)" glass />
        <FormInput name="amount" control={form.control} label="Amount" type="number" glass />
        <FormInput name="valueDate" control={form.control} label="Value Date" type="date" glass />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="benName" control={form.control} label="Beneficiary Name" glass />
        <FormInput name="benIFSC" control={form.control} label="IFSC" glass />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="benAcctNo" control={form.control} label="Account Number" glass />
        <FormInput name="benEmail" control={form.control} label="Email (optional)" glass />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="benMobile" control={form.control} label="Mobile (optional)" glass />
        <FormInput name="description" control={form.control} label="Description (optional)" glass />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput name="remark1" control={form.control} label="Remark 1 (optional)" glass />
        <FormInput name="remark2" control={form.control} label="Remark 2 (optional)" glass />
        <FormInput name="remark3" control={form.control} label="Remark 3 (optional)" glass />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Initiate Payout
      </Button>
    </FormProvider>
  );
};

export default PayoutInitiateForm;


