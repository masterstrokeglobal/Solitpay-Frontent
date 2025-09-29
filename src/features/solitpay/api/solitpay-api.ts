import api from "@/lib/axios/instance";

export type InitiatePayload = {
  amount: number | string;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  return_url: string;
};

export async function initiateSolitpayPayment(payload: InitiatePayload) {
  const { data } = await api.post("/solitpay/initiate", payload);
  return data as { order_id: string; txn_id: string; payment_url: string };
}

export async function getSolitpayBalance() {
  const { data } = await api.get("/solitpay/balance");
  return data as { status: string; error: boolean; message: string; data: { wallet_balance: string } };
}

export async function createSolitpayOrder(payload: {
  name: string;
  phone: string;
  amount: string | number;
  email?: string;
  merchantTxnId: string;
  notes?: string;
}) {
  const { data } = await api.post("/solitpay/orders/create", {
    ...payload,
    amount: String(payload.amount),
  });
  return data as any;
}

export async function initiateSolitpayPayout(payload: {
  name: string;
  phone: string;
  amount: string | number;
  account_number: string;
  ifsc_code: string;
  merchantTxnId: string;
  notes?: string;
}) {
  const { data } = await api.post("/solitpay/payout/initiate", {
    ...payload,
    amount: String(payload.amount),
  });
  return data as any;
}

export async function solitpayStatus(payload: { txnid: string }) {
  const { data } = await api.post("/solitpay/status", payload);
  return data as any;
}


