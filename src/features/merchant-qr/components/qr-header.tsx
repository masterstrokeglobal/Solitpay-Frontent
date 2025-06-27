"use client";

import { QrCode } from 'lucide-react';

interface QRHeaderProps {
  title: string;
  description: string;
}

export const QRHeader = ({ title, description }: QRHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-1">
        <QrCode className="w-6 h-6 text-white" />
        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
      </div>
      <p className="text-gray-200">{description}</p>
    </div>
  );
};