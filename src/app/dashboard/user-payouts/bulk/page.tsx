"use client";
import React, { useState, ChangeEvent, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';
import { useCreateBulkPayout } from '@/features/user-withdrawl/api/user-withdrawl-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/auth-context';
import Merchant, { APIS } from '@/models/merchant';

// Types
interface BankTransferRecord {
  UserName: string;
  UserEmail: string;
  Amount: number;
  AccountName: string;
  AccountNumber: number;
  IFSCCode: string;
  BankName: string;
  PaymentMode: "IMPS";
}

interface UpiTransferRecord {
  UserName: string;
  UserEmail: string;
  Amount: number;
  UpiId: string;
  PaymentMode: "UPI";
}

type PayoutRecord = BankTransferRecord | UpiTransferRecord;

// Helper function to determine record type
const isUpiTransfer = (record: PayoutRecord): record is UpiTransferRecord => {
  return record.PaymentMode === "UPI";
};

// File Uploader Component
interface FileUploaderProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setPreview: React.Dispatch<React.SetStateAction<PayoutRecord[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ file, setFile, setPreview, setError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      setFile(null);
      setPreview([]);
      return;
    }

    setFile(selectedFile);
    setError('');

    try {
      // Use FileReader as a Promise
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
        reader.onerror = (e) => reject(new Error('Error reading file'));
        reader.readAsArrayBuffer(selectedFile);
      });

      // Parse the Excel file
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Get the first sheet
      if (workbook.SheetNames.length === 0) {
        throw new Error('No sheets found in Excel file');
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON with proper header handling
      const rawRecords = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        blankrows: false
      });

      if (rawRecords.length <= 1) {
        throw new Error('Excel file has no data or only headers');
      }

      // Extract headers from first row
      const headers = rawRecords[0] as string[];

      // Check if required columns exist
      const requiredColumns = ['UserName', 'UserEmail', 'Amount', 'PaymentMode'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));

      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }

      // Process data rows
      const records: PayoutRecord[] = [];

      for (let i = 1; i < rawRecords.length; i++) {
        const row = rawRecords[i] as any[];
        const record: any = {};

        // Map values to keys based on headers
        headers.forEach((header, index) => {
          if (row[index] !== undefined) {
            record[header] = row[index];
          }
        });

        // Validate required fields
        if (!record.UserName || !record.UserEmail || !record.Amount || !record.PaymentMode) {
          continue; // Skip invalid rows
        }

        // Validate PaymentMode
        if (record.PaymentMode === 'UPI') {
          if (!record.UpiId) {
            continue; // Skip invalid UPI records
          }
        } else if (record.PaymentMode === 'IMPS') {
          if (!record.AccountName || !record.AccountNumber || !record.IFSCCode || !record.BankName) {
            continue; // Skip invalid IMPS records
          }
        } else {
          continue; // Skip records with invalid payment mode
        }

        records.push(record as PayoutRecord);
      }

      setPreview(records);

      if (records.length === 0) {
        throw new Error('No valid payment records found in Excel file');
      }

    } catch (error: any) {
      console.error('Error parsing Excel file:', error);
      setError(error.message || 'Failed to parse Excel file. Please check the format.');
      setFile(null);
      setPreview([]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    processFile(selectedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    processFile(droppedFile);
  };

  return (
    <div
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer shadow-2xl ${
        isDragging 
          ? 'bg-blue-500/20 border-blue-400/30 shadow-blue-500/30 scale-105' 
          : 'hover:bg-white/20 hover:border-white/30 hover:shadow-2xl hover:scale-[1.02]'
      }`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />

      {file ? (
        <div className="flex flex-col items-center">
          <div className="backdrop-blur-lg bg-green-500/15 p-4 rounded-full mb-4 shadow-lg">
            <FileSpreadsheet className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-sm font-medium text-white/90">{file.name}</p>
          <p className="text-xs text-white/70 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 backdrop-blur-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 text-white/90 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
              setPreview([]);
            }}
          >
            Change File
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="backdrop-blur-lg bg-white/10 p-4 rounded-full mb-4 shadow-lg">
            <UploadCloud className="h-12 w-12 text-white/80" />
          </div>
          <p className="text-sm font-medium text-white/90">Click to upload or drag and drop</p>
          <p className="text-xs text-white/70 mt-1">Excel files only (.xlsx, .xls)</p>
        </div>
      )}
    </div>
  );
};

// Data Preview Component
interface DataPreviewProps {
  preview: PayoutRecord[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ preview }) => {
  if (preview.length === 0) return null;

  const totalAmount = preview.reduce((sum, record) => sum + record.Amount, 0);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Preview</h3>
        <div className="text-sm text-gray-500">
          {preview.length} payouts • Total: ₹{totalAmount.toLocaleString()}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Mode</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {preview.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.UserName}</TableCell>
              <TableCell>{record.UserEmail}</TableCell>
              <TableCell>₹{record.Amount.toLocaleString()}</TableCell>
              <TableCell>{record.PaymentMode}</TableCell>
              <TableCell>
                {isUpiTransfer(record) ? (
                  <span className="text-sm">UPI: {record.UpiId}</span>
                ) : (
                  <span className="text-sm">
                    A/C: {record.AccountNumber}<br />
                    IFSC: {record.IFSCCode}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Status Messages Component
interface StatusMessagesProps {
  error: string;
  isSuccess: boolean;
}

const StatusMessages: React.FC<StatusMessagesProps> = ({ error, isSuccess }) => {
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="bg-green-50 border-green-200 mt-4">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Bulk payout was created successfully</AlertDescription>
        </Alert>
      )}
    </>
  );
};

// Template Info Component
const TemplateInfo: React.FC = () => {
  return (
    <Alert className="mb-4 border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-lg shadow-black/20">
      <div className="flex items-start">
        <Info className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0 text-white/80" />
        <div className="flex-1">
          <AlertTitle className="font-medium mb-1 text-white/90">Template Information</AlertTitle>
          <AlertDescription className="text-white/70">
            <p className="mb-2">Your Excel file should include the following columns:</p>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li><span className="font-medium text-white/90">Required for all:</span> UserName, UserEmail, Amount, PaymentMode (UPI or IMPS)</li>
              <li><span className="font-medium text-white/90">For IMPS payments:</span> AccountName, AccountNumber, IFSCCode, BankName</li>
              <li><span className="font-medium text-white/90">For UPI payments:</span> UpiId</li>
            </ul>
          </AlertDescription>
          <div className="mt-3 pt-2 flex items-center">
            <FileSpreadsheet className="h-4 mr-2 text-white/80" />
            <a
              href="/excel/dummy-bulk-payments.xlsx"
              download
              className="text-sm text-blue-200 hover:text-blue-300 hover:underline font-medium flex items-center transition-colors"
            >
              Download sample template
            </a>
          </div>
        </div>
      </div>
    </Alert>
  );
};

// Main Component
const BulkPayoutUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PayoutRecord[]>([]);
  const [error, setError] = useState<string>('');
  const createBulkPayoutMutation = useCreateBulkPayout();
  const router = useRouter();

  const { userDetails } = useAuthStore();
  const merchant = userDetails as Merchant;
  if (!merchant.hasAccessTo(APIS.USER_WITHDRAW_BULK)) return null;
  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      await createBulkPayoutMutation.mutateAsync(formData);

      // On success, redirect or reset form
      setTimeout(() => {
        // Option 1: Reset the form
        setFile(null);
        setPreview([]);

        // Option 2: Redirect to dashboard
        router.push('/dashboard/user-payouts');
      }, 1500); // Brief delay to show success message
    } catch (err) {
      console.error('Error submitting bulk payout:', err);
    }
  };

  return (
    <div className="w-full mx-auto">
      <Card variant="glass" className="w-full border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-white/90  ">Bulk Payout</CardTitle>
          <CardDescription className="text-white/70">
            Upload an Excel file to create multiple payouts at once
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <TemplateInfo />

            <FileUploader
              file={file}
              setFile={setFile}
              setPreview={setPreview}
              setError={setError}
            />

            <StatusMessages
              error={error}
              isSuccess={createBulkPayoutMutation.isSuccess}
            />

            {/* Action button moved above the table */}
            {preview.length > 0 && (
              <div className="flex justify-end mt-6">
                <Button
                  disabled={createBulkPayoutMutation.isPending}
                  onClick={handleSubmit}
                  className="mb-4"
                >
                  {createBulkPayoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Create Bulk Payout'
                  )}
                </Button>
              </div>
            )}

            <DataPreview preview={preview} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkPayoutUploader;