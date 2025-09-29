"use client";
import { useSearchParams } from "next/navigation";

export default function PayReturnPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const status = params.get("status");
  const txnId = params.get("txn_id");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Result</h1>
      <div className="space-y-2">
        <div><b>Order ID:</b> {orderId || "-"}</div>
        <div><b>Transaction ID:</b> {txnId || "-"}</div>
        <div><b>Status:</b> {status || "Check dashboard after webhook"}</div>
      </div>
      <p className="text-gray-500 mt-4">Final status is confirmed via webhook in your dashboard.</p>
    </div>
  );
}


