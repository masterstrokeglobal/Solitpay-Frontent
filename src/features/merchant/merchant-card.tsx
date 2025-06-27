import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  BadgeCheck,
  Calendar,
  Building2,
  MapPin,
  Mail,
  Phone,
  Percent,
  Image as ImageIcon
} from 'lucide-react';
import Merchant from '@/models/merchant';

const MerchantProfileCard = ({ merchant }: { merchant: Merchant }) => {
  const formatDate = (date: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const InfoItem = ({ icon: Icon, label, value, className = "" }:any) => (
    <div className={`p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-blue-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-white/70">{label}</p>
          <p className="text-sm font-semibold text-white truncate">{value || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  const Section = ({ title, children }:any) => (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white border-l-4 border-blue-400 pl-3 backdrop-blur-sm">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );

  return (
    <Card variant="glass" className="w-full overflow-hidden ">
      <CardHeader className="border-b border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30 backdrop-blur-sm">
              <User className="h-6 w-6 text-blue-300" />
            </div>
            <span className="text-xl text-white">Merchant Profile</span>
            {merchant.isVerified && (
              <BadgeCheck className="h-6 w-6 text-green-400" />
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            
            <Section title="Basic Information">
              <InfoItem icon={User} label="Full Name" value={merchant.name} />
              <InfoItem icon={Mail} label="Email Address" value={merchant.email} />
              {merchant.wallet?.amount!=undefined && (<InfoItem icon={Percent} label="Wallet Balance" value={`Rs. ${merchant.wallet?.getFormattedAmount()}`} />)}
            </Section>

            <Section title="Company Details">
              <InfoItem
                icon={Building2}
                label="Company Name"
                value={merchant.companyName}
                className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-400/30"
              />
              <InfoItem icon={MapPin} label="Company Address" value={merchant.companyAddress} />
              <InfoItem
                icon={Percent}
                label="Platform Fee"
                value={merchant.platformFeePercentage ? `${merchant.platformFeePercentage}%` : 'N/A'}
              />
            </Section>
          </div>

          <div className="space-y-6">
            <Section title="Additional Information">
            
              <InfoItem
                icon={Calendar}
                label="Account Created"
                value={formatDate(merchant.createdAt ?? new Date())}
              />
              <InfoItem
                icon={Calendar}
                label="Last Updated"
                value={formatDate(merchant.updatedAt ?? new Date())}
              />
            </Section>

            <Section title="Status Information">
              <InfoItem
                icon={BadgeCheck}
                label="Verification Status"
                value={merchant.isVerified ? 'Verified' : 'Not Verified'}
                className={merchant.isVerified ? 'bg-green-500/10 hover:bg-green-500/20 border-green-400/30' : 'bg-white/10 hover:bg-white/20 border-white/20'}
              />
              {merchant.deletedAt && (
                <InfoItem
                  icon={Calendar}
                  label="Deletion Date"
                  value={formatDate(merchant.deletedAt)}
                  className="bg-red-500/10 hover:bg-red-500/20 border-red-400/30"
                />
              )}
            </Section>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantProfileCard;