"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllMerchantQrs } from "@/features/merchant-qr/api/merchant-qr-query";
import { AlertCircle, QrCode, Copy, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MerchantQr } from "@/features/merchant-qr/type";
import Link from "next/link";
import { useMerchantQrWebSocket } from "@/hooks/use-payments";



const QrSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
  </Card>
);

interface MerchantQrCardProps {
  qr: MerchantQr;
}

const MerchantQrCard = ({ qr }: MerchantQrCardProps) => {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(" Copied Text");
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          {qr.accountName}
        </CardTitle>
        <Badge variant={qr.isActive ? "default" : "secondary"}>
          {qr.isActive ? "Active" : "Inactive"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* QR Code Display */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <img
                src={qr.qrCode}
                alt="Payment QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">UPI ID</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm">{qr.upiId}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleCopy(qr.upiId, "UPI ID")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Bank Name</p>
              <p className="font-medium">{qr.bankName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Account Number</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm">{qr.accountNumber}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleCopy(qr.accountNumber, "Account Number")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">IFSC Code</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm">{qr.ifscCode}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleCopy(qr.ifscCode, "IFSC Code")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Link href={`upi://pay?pa=${qr.upiId}`} target="_blank">
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => window.open()}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Pay with UPI App
              </Button>
            </Link>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MerchantQrPage = () => {
  const { data, isLoading, error } = useGetAllMerchantQrs({ isActive: true });


  useMerchantQrWebSocket();
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Payment QR Codes</h1>
          <p className="text-gray-500">Scan or click to make payments</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, index) => (
            <QrSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load payment QRs. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payment QR Codes</h1>
        <p className="text-gray-500">Scan or click to make payments</p>
      </div>

      {!data?.data?.length ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <QrCode className="h-12 w-12 text-gray-400" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No Payment QRs Available</h3>
              <p className="text-gray-500">Please check back later.</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {data.data.map((qr: MerchantQr) => (
            <MerchantQrCard key={qr.id} qr={qr} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantQrPage;