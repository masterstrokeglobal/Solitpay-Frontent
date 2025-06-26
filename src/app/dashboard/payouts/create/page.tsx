"use client";
import LoadingScreen from '@/components/common/loading-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/context/auth-context';
import { useGetMerchantById } from '@/features/merchant/api/merchant-query';
import PayoutRequestForm, { PayoutFormValues } from '@/features/payout/create/payout-form';
import { useCreatePayout } from '@/features/transaction/query/transactions-queries';
import { randomID } from '@/lib/utils';
import Merchant from '@/models/merchant';
import { TransactionType } from '@/models/transaction';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';


const PayoutRequestPage = () => {
  const { userDetails } = useAuthStore();
  const router = useRouter();
  const { mutate, isPending } = useCreatePayout();

  const { data, isLoading, isSuccess } = useGetMerchantById(userDetails!.id!.toString());

  const merchant = useMemo(() => {
    if (isSuccess && data) {
      return new Merchant(data.data);
    }
    return null;
  }, [data, isSuccess]);


  const handlePayoutSubmit = async (data: PayoutFormValues) => {
    mutate({
      amount: data.amount,
      withdrawDetails: data.withdrawDetails,
    },{
      onSuccess: () => {
        toast.success('Payout request submitted successfully');
        router.push('/dashboard/payouts');
      },
    });


  };

  if (isLoading && merchant === null) {
    return <LoadingScreen />;
  }

  if (!userDetails?.isMerchant) {
    return (<div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-xl font-semibold">You are not authorized to view this page</h1>
      </div>
    </div>);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/merchants/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Request Payout</h1>
            </div>
            <div className="text-sm text-gray-500">
              ID: {merchant?.id}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Side - Form */}
            <div className="md:col-span-2">
              <PayoutRequestForm
                onSubmit={handlePayoutSubmit}
                isLoading={isPending}
                paymentMethods={merchant?.withdrawDetails ?? []}
                walletBalance={merchant?.wallet?.amount ?? 0}
              />
            </div>

            {/* Right Side - Info Cards */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payout Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Minimum Amount</h3>
                    <p className="text-sm text-gray-500">Minimum payout amount is Rs. 100</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Maximum Amount</h3>
                    <p className="text-sm text-gray-500">Maximum payout amount is Rs.10,000 per transaction</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    If you have any questions about payouts, please contact our support team.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutRequestPage;