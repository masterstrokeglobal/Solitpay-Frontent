import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CreditCard, Hash, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import WithdrawDetailsRecord from '@/models/withdrawl-details';
import Merchant from '@/models/merchant';
import { Building2, Mail, User, MapPin, Percent, Calendar } from "lucide-react";

const DetailRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | null|undefined }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-5 h-5 text-white/60 mt-0.5" />
      <div>
        <p className="text-sm text-white/60">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
};

const WithdrawalDetailsCard = ({ withdrawDetails }:{withdrawDetails:WithdrawDetailsRecord}) => {
  const formatAccountNumber = (number?:string|null) => {
    if (!number) return "";
    const last4 = number.slice(-4);
    return `XXXX XXXX ${last4}`;
  };

  return (
    <Card className="w-full bg-white/10 border-white/20 backdrop-blur-md shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-white">Bank Account Details</CardTitle>
      </CardHeader>
      
      <CardContent className="grid gap-2">
        <DetailRow
          icon={Building}
          label="Account Name"
          value={withdrawDetails.accountName}
        />
        
        <DetailRow
          icon={CreditCard}
          label="Account Number"
          value={formatAccountNumber(withdrawDetails.accountNumber)}
        />
        
        <DetailRow
          icon={Hash}
          label="IFSC Code"
          value={withdrawDetails.ifscCode?.toUpperCase()}
        />
        
        <DetailRow
          icon={CalendarClock}
          label="Added On"
          value={format(new Date(withdrawDetails.createdAt!), 'MMM d, yyyy')}
        />
      </CardContent>
    </Card>
  );
};

const MerchantDetailsCard = ({ merchant }:{merchant:Merchant}) => {
    return (
      <Card className="w-full bg-white/10 border-white/20 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-white">Merchant Details</CardTitle>
        </CardHeader>
        
        <CardContent className="grid gap-2">
          <DetailRow
            icon={User}
            label="Name"
            value={merchant.name}
          />
          
          <DetailRow
            icon={Mail}
            label="Email"
            value={merchant.email}
          />
          
          <DetailRow
            icon={Building2}
            label="Company Name"
            value={merchant.companyName}
          />
          
          <DetailRow
            icon={MapPin}
            label="Company Address"
            value={merchant.companyAddress}
          />
          
          {merchant.companyGSTNumber && (
            <DetailRow
              icon={Building2}
              label="GST Number"
              value={merchant.companyGSTNumber}
            />
          )}
          
          <DetailRow
            icon={Percent}
            label="Platform Fee"
            value={`${merchant.platformFeePercentage}%`}
          />
          
          <DetailRow
            icon={Calendar}
            label="Member Since"
            value={format(new Date(merchant.createdAt!), 'MMM d, yyyy')}
          />
        </CardContent>
      </Card>
    );
  };

export {MerchantDetailsCard,WithdrawalDetailsCard};