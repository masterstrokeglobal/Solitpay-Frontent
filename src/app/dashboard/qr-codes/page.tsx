"use client"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import {
    useCreateMerchantQr,
    useGetAllMerchantQrs
} from '@/features/merchant-qr/api/merchant-qr-query';
import { QuickActions } from '@/features/merchant-qr/components/qr-actions';
import QRDetails from '@/features/merchant-qr/components/qr-details';
import { QRDisplay } from '@/features/merchant-qr/components/qr-display';
import { QRHeader } from '@/features/merchant-qr/components/qr-header';
import { Search, Loader2, RefreshCw } from 'lucide-react';
import React from 'react';

interface MerchantQr {
    id: string;
    name?: string;
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    createdAt: string;
    ifscCode?: string;
    isActive: boolean;
    upiId?: string;
}

const MerchantQRDashboard: React.FC = () => {
    const [selectedQRId, setSelectedQRId] = React.useState<string>('');
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const { userDetails } = useAuthStore();
    const {
        data: qrCodes,
        isLoading,
        refetch
    } = useGetAllMerchantQrs({ merchantId: userDetails?.id });

    // Keyboard shortcut for search focus
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Filter QR codes
    const filteredQRCodes = React.useMemo(() => {
        if (!qrCodes?.data) return [];
        const searchString = searchQuery.toLowerCase();
        return qrCodes.data.filter((qr: MerchantQr) => {
            return (
                qr.name?.toLowerCase().includes(searchString) ||
                qr.accountName?.toLowerCase().includes(searchString) ||
                qr.bankName?.toLowerCase().includes(searchString) ||
                qr.accountNumber?.includes(searchString) ||
                qr.upiId?.toLowerCase().includes(searchString)
            );
        });
    }, [qrCodes?.data, searchQuery]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-8 border border-white/30">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </div>
        );
    }

    // Get the selected QR code
    const selectedQR = qrCodes?.data?.find((qr: { id: string; }) => qr.id === selectedQRId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg">
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex justify-between items-center mb-6">
                    <QRHeader
                        title="Payment QR"
                        description="Manage and customize your payment QR codes"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-lg shadow-black/20"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                <div className="mb-6 flex justify-between flex-wrap">
                    <div className="relative w-full md:w-[320px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                        <Input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search QR codes... (Ctrl + K)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full transition-all duration-300 focus:ring-2 focus:ring-purple-400/50 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder-white/60 focus:bg-white/15 focus:border-white/30 shadow-lg shadow-black/20"
                        />
                        {searchQuery && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-white/70">
                                {filteredQRCodes.length} results
                            </div>
                        )}
                    </div>
                    <QuickActions />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* QR List */}
                    <div className="lg:col-span-1 space-y-2">
                        {filteredQRCodes.map((qr: MerchantQr) => (
                            <div
                                key={qr.id}
                                onClick={() => setSelectedQRId(qr.id)}
                                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer backdrop-blur-xl shadow-lg shadow-black/20 ${
                                    selectedQRId === qr.id
                                        ? 'border-purple-400/50 bg-purple-500/20 shadow-xl shadow-purple-500/20'
                                        : 'border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30'
                                }`}
                            >
                                <div className="font-medium text-white">
                                    {qr.upiId || `QR Code ${qr.id}`}
                                </div>
                                {qr.bankName && (
                                    <div className="text-sm text-white/80">
                                        {qr.bankName}
                                    </div>
                                )}
                                <div className="text-xs text-white/60">
                                    Created: {new Date(qr.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                        {filteredQRCodes.length === 0 && (
                            <div className="text-center p-4 text-white/70 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg shadow-black/20">
                                No matching QR codes found
                            </div>
                        )}
                    </div>

                    {/* QR Details */}
                    <div className="lg:col-span-2">
                        {selectedQR ? (<>
                            <QRDisplay qrCode={selectedQR} />
                            <div className="space-y-6">
                                <QRDetails merchantQR={selectedQR} />
                                <Alert className="border-2 bg-purple-500/20 backdrop-blur-xl border-purple-400/30 shadow-lg shadow-purple-500/20">
                                    <AlertDescription className="text-sm text-white/90">
                                        Your QR code automatically updates with your latest merchant information. It's safe to share with customers.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[400px] bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg shadow-black/20">
                                <div className="text-center text-white/70">
                                    Select a QR code to view details
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MerchantQRDashboard;