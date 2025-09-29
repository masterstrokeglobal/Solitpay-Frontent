import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import passwayAPI, {
  PayoutInitiatePayload,
  PayoutOtpSubmitPayload,
  PayoutStatusPayload,
  UpiCollectPayload,
  UpiCollectStatusPayload,
  UpiDynamicQrPayload,
  UpiDynamicQrStatusPayload,
  UpiIntentPayload,
  UpiPaymentPayload,
  UpiPaymentStatusPayload,
} from "./passway-api";

export const usePasswayPayoutInitiate = () =>
  useMutation({
    mutationFn: (data: PayoutInitiatePayload) => passwayAPI.payoutInitiate(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to initiate payout"),
  });

export const usePasswayPayoutSubmitOtp = () =>
  useMutation({
    mutationFn: (data: PayoutOtpSubmitPayload) => passwayAPI.payoutSubmitOtp(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to submit OTP"),
  });

export const usePasswayPayoutResendOtp = () =>
  useMutation({
    mutationFn: (data: { custTxnRefNo: string }) => passwayAPI.payoutResendOtp(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to resend OTP"),
  });

export const usePasswayPayoutStatus = () =>
  useMutation({
    mutationFn: (data: PayoutStatusPayload) => passwayAPI.payoutStatus(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to get payout status"),
  });

export const usePasswayUpiCollect = () =>
  useMutation({
    mutationFn: (data: UpiCollectPayload) => passwayAPI.upiCollect(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "UPI collect failed"),
  });

export const usePasswayUpiCollectStatus = () =>
  useMutation({
    mutationFn: (data: UpiCollectStatusPayload) => passwayAPI.upiCollectStatus(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Collect status failed"),
  });

export const usePasswayUpiDynamicQr = () =>
  useMutation({
    mutationFn: (data: UpiDynamicQrPayload) => passwayAPI.upiDynamicQr(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Dynamic QR failed"),
  });

export const usePasswayUpiDynamicQrStatus = () =>
  useMutation({
    mutationFn: (data: UpiDynamicQrStatusPayload) => passwayAPI.upiDynamicQrStatus(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "Dynamic QR status failed"),
  });

export const usePasswayUpiPayment = () =>
  useMutation({
    mutationFn: (data: UpiPaymentPayload) => passwayAPI.upiPayment(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "UPI payment failed"),
  });

export const usePasswayUpiPaymentStatus = () =>
  useMutation({
    mutationFn: (data: UpiPaymentStatusPayload) => passwayAPI.upiPaymentStatus(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "UPI payment status failed"),
  });

export const usePasswayUpiIntent = () =>
  useMutation({
    mutationFn: (data: UpiIntentPayload) => passwayAPI.upiIntent(data),
    onError: (error: any) => toast.error(error.response?.data?.message ?? "UPI intent failed"),
  });


