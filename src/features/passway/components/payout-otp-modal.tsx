"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormInput from "@/components/form/form-input";
import FormProvider from "@/components/form/form-provider";
import { useCountdown } from "@/hooks/use-countdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const otpSchema = z.object({
  otp_value: z.string().min(4, "Enter OTP").max(10),
});

export type OtpValues = z.infer<typeof otpSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: OtpValues) => Promise<void> | void;
  onResend: () => Promise<void> | void;
  isSubmitting?: boolean;
  isResending?: boolean;
  custTxnRefNo: string;
};

const PayoutOtpModal = ({ open, onClose, onSubmit, onResend, isSubmitting = false, isResending = false, custTxnRefNo }: Props) => {
  const form = useForm<OtpValues>({ resolver: zodResolver(otpSchema), defaultValues: { otp_value: "" } });
  const { timeRemaining, isCountdownActive, startCountdown } = useCountdown(30);

  const handleResend = async () => {
    await onResend();
    startCountdown();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Reference: {custTxnRefNo}</p>
          <FormProvider methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput name="otp_value" control={form.control} label="OTP" placeholder="Enter OTP" glass />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="button" variant="secondary" onClick={handleResend} disabled={isResending || isCountdownActive}>
                {isResending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                {isCountdownActive ? `Resend in ${timeRemaining}s` : "Resend OTP"}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutOtpModal;


