import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WithdrawDetailsRecord from '@/models/withdrawl-details';
import { Building2, Trash2 } from 'lucide-react';
import React from 'react';


type WithdrawDetailsCardProps = {
  record: WithdrawDetailsRecord;
  isDeleting: boolean;
  handleDelete: (id: number) => void;
};

const WithdrawDetailsCard: React.FC<WithdrawDetailsCardProps> = ({ record, isDeleting, handleDelete }) => {
  return (
    <Card variant="glass" key={record.id} className="hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center p-6 gap-6">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <Building2 className="h-6 w-6 text-indigo-600" />
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div>
            <p className="text-sm text-gray-300">Account Name</p>
            <p className="font-medium text-white">{record.accountName || 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-300">Account Number</p>
            <p className="font-medium text-white">{"••••••••" + (record.accountNumber?.slice(-4) || 'N/A')}</p>
          </div>

          <div>
            <p className="text-sm text-gray-300">Bank Name</p>
            <p className="font-medium text-white">{record.ifscCode ? 'Available' : 'N/A'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-300">IFSC Code</p>
            <p className="font-medium text-white">{record.ifscCode || 'N/A'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        
          <Button
            variant="ghost"
            size="icon"
            onClick={() => record.id && handleDelete(record.id)}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawDetailsCard;
