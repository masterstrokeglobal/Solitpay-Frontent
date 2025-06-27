"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/context/auth-context';
import { useCreateAPIServiceRequest, useGetAllAPIRequests, useGetAllAPIServices } from '@/features/api-service/api/api-service-query';
import { appName } from '@/lib/utils';
import { ApiRequestStatus } from '@/models/api-request';
import APIRequest from '@/models/api-request';
import APIService from '@/models/api-service';
import { TransactionType } from '@/models/transaction';
import { Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';

const ApiMarketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const { data: servicesData, isLoading, error } = useGetAllAPIServices({
    active: true,
    search: searchQuery,
    page: 1,
    limit: 100,
  });

  const { data: apiRequestsData } = useGetAllAPIRequests({
    page: 1,
    limit: 100,
    status: type === "all" ? undefined : type,
  });

  const apiRequests = useMemo(() => {
    return apiRequestsData?.data?.apiRequests ?? [];
  }, [apiRequestsData]);

  const services = useMemo(() => {
    return servicesData?.data?.apiLists ?? [];
  }, [servicesData]);

  const showAll = type === "all";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex justify-between items-center p-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white/90">API Marketplace</h2>
          <p className="text-sm mt-1 text-white/70">Integrate powerful services into your applications</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-xl border border-white/20 px-3 py-1 rounded-full font-medium shadow-lg shadow-black/20">{appName}</span>
        </div>
      </div>

      <div className="flex px-4 justify-between">
        <div className="mb-6  relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/50" />
          </div>
          <Input
            type="text"
            placeholder="Search APIs..."
            className='pl-10'
            glass
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ShadCN Select for Type Filter */}
        <Select value={type} onValueChange={(val) => {
          setType(val as TransactionType)
        }} >
          <SelectTrigger className='w-40 bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg shadow-black/20'>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
            <SelectGroup>
              <SelectLabel className="text-white/70">Types</SelectLabel>
              <SelectItem value="all" className="text-white hover:bg-white/20">All Types</SelectItem>
              <SelectItem value={ApiRequestStatus.APPROVED} className="text-white hover:bg-white/20">
                Approved
              </SelectItem>
              <SelectItem value={ApiRequestStatus.REJECTED} className="text-white hover:bg-white/20">
                Rejected
              </SelectItem>
              <SelectItem value={ApiRequestStatus.PENDING} className="text-white hover:bg-white/20">
                Pending
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-white/70">Loading services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg shadow-black/20">
            <p className="text-red-400">Error loading services. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showAll ? services.map((service: APIService) => (
                <ServiceCard key={service.id} service={service} />
              )) : apiRequests.map((request: APIRequest) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
            {showAll && services.length === 0 ||
              !showAll && apiRequests.length === 0 && (
                <div className="text-center py-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-lg shadow-black/20">
                  <p className="text-white/70">No Search Result Found.</p>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: APIService;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { mutate: createApiService, isPending } = useCreateAPIServiceRequest();
  const { userDetails } = useAuthStore();

  const handleBuyNow = () => {
    createApiService({
      apiServiceId: service.id,
      apiList: service.id,
    });
  }
  
  return (
    <Card className="overflow-hidden transition-all duration-300 border border-white/20 rounded-lg bg-white/10 backdrop-blur-xl shadow-lg shadow-black/20 hover:shadow-white/5 hover:bg-white/15">
      <div className="relative">
        <img
          src={service.imageUrl ?? ""}
          alt={service.name ?? ""}
          className="w-full h-48 object-cover bg-gradient-to-br from-white/10 to-white/5"
        />
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-white/90">{service.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white/70">{service.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          className='w-full bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 text-white border border-white/20 shadow-lg shadow-black/20'
          disabled={isPending}
          onClick={handleBuyNow}
        >
          {isPending ? "Processing..." : "Buy Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

type RequestCardProps = {
  request: APIRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 border border-white/20 rounded-lg bg-white/10 backdrop-blur-xl shadow-lg shadow-black/20 hover:shadow-white/5 hover:bg-white/15">
      <div className="relative">
        <img
          src={request.apiList?.imageUrl ?? ""}
          alt={request.apiList?.name ?? ""}
          className="w-full h-48 object-cover bg-gradient-to-br from-white/10 to-white/5"
        />
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-white/90">{request.apiList?.name}</CardTitle>
          <Badge variant="outline" className="border-white/30 text-white/80 bg-white/10 backdrop-blur-xl">
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-white/70">{request.apiList?.description}</p>
      </CardContent>
    </Card>
  );
};

export default ApiMarketplace;
