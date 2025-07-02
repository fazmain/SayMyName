'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  nameCardTitle: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  nameCardTitle,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && shareUrl) {
      generateQRCode();
    }
  }, [isOpen, shareUrl]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `${nameCardTitle.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded successfully');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share URL copied to clipboard');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${nameCardTitle}'s Name Pronunciation`,
          text: `Learn how to pronounce ${nameCardTitle}'s name correctly`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing or sharing failed
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">QR</span>
            </div>
            Share QR Code
          </DialogTitle>
          <DialogDescription>
            Scan this QR code to access {nameCardTitle}'s name pronunciation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code Display */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                {loading ? (
                  <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-[300px] h-[300px] rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-[300px] h-[300px] bg-gray-50 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Failed to generate QR code</span>
                  </div>
                )}

                <div className="text-center space-y-2">
                  <h3 className="font-semibold">{nameCardTitle}</h3>
                  <Badge variant="secondary" className="text-xs">
                    Name Pronunciation Card
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
              />
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleDownload} disabled={!qrCodeDataUrl} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
            <Button variant="outline" onClick={handleShare} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Usage Tips */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-blue-900 mb-1">How to use:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Print and display at your desk or workspace</li>
              <li>• Add to your email signature or business card</li>
              <li>• Share in presentations or virtual meetings</li>
              <li>• Include in conference name tags or materials</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};