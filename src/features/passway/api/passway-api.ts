import api from "@/lib/axios/instance";

// Payout types
export type PayoutInitiatePayment = {
    txnType: "IMPS" | "NEFT" | "RTGS";
    amount: number;
    valueDate: string; // yyyy-MM-dd
    benName: string;
    benIFSC: string;
    benAcctNo: string;
    benEmail?: string;
    benMobile?: string;
    description?: string;
    remark1?: string;
    remark2?: string;
    remark3?: string;
};

export type PayoutInitiatePayload = {
    custTxnRefNo: string;
    externalReferenceNumber?: string;
    payment: PayoutInitiatePayment;
};

export type PayoutOtpSubmitPayload = {
    custTxnRefNo: string;
    otp_value: string;
};

export type PayoutStatusPayload = {
    custTxnRefNo: string;
};

// UPI types
export type UpiCollectPayload = {
    clientRefId: string;
    amount: string; // pass as string per spec
    note: string;
    customerName: string;
    customerVpa: string;
    customerMcc: string;
    expiryValue: string;
};

export type UpiCollectStatusPayload = {
    clientRefId: string;
    custRefId: string;
};

export type UpiDynamicQrPayload = {
    clientRefId: string;
    amount: string; // string to preserve decimals formatting
    minAmount?: string;
    note: string;
    url?: string;
    expiry?: string;
};

export type UpiDynamicQrStatusPayload = {
    clientRefId: string;
};

export type UpiPaymentPayload = {
    clientRefId: string;
    amount: string;
    note: string;
    customerName: string;
    customerVpa: string;
    customerMcc: string;
};

export type UpiPaymentStatusPayload = {
    clientRefId: string;
};

export type UpiIntentPayload = {
    clientRefId: string;
    amount: string;
    note: string;
};

export const passwayAPI = {
    // Payout
    payoutInitiate: async (data: PayoutInitiatePayload) => {
        return api.post("/api/passway/payout/initiate", data);
    },
    payoutSubmitOtp: async (data: PayoutOtpSubmitPayload) => {
        return api.post("/api/passway/payout/submit-otp", data);
    },
    payoutResendOtp: async (data: { custTxnRefNo: string }) => {
        return api.post("/api/passway/payout/resend-otp", data);
    },
    payoutStatus: async (data: PayoutStatusPayload) => {
        return api.post("/api/passway/payout/status", data);
    },

    // UPI
    upiCollect: async (data: UpiCollectPayload) => {
        return api.post("/api/passway/upi/collect", data);
    },
    upiCollectStatus: async (data: UpiCollectStatusPayload) => {
        return api.post("/api/passway/upi/collect/status", data);
    },
    upiDynamicQr: async (data: UpiDynamicQrPayload) => {
        return api.post("/api/passway/upi/dynamic/qr", data);
    },
    upiDynamicQrStatus: async (data: UpiDynamicQrStatusPayload) => {
        return api.post("/api/passway/upi/dynamic/qr/status", data);
    },
    upiPayment: async (data: UpiPaymentPayload) => {
        return api.post("/api/passway/upi/payment", data);
    },
    upiPaymentStatus: async (data: UpiPaymentStatusPayload) => {
        return api.post("/api/passway/upi/payment/status", data);
    },
    upiIntent: async (data: UpiIntentPayload) => {
        return api.post("/api/passway/upi/intent", data);
    },
};

export default passwayAPI;

