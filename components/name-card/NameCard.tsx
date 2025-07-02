"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QRCodeModal } from "./QRCodeModal";
import {
  Play,
  Pause,
  Share2,
  QrCode,
  Copy,
  Trash2,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { getThemeById } from "@/lib/card-themes";
import { getLanguageByCode } from "@/lib/languages";

interface NameCardData {
  id: string;
  fullName: string;
  phoneticSpelling: string;
  pronouns?: string;
  description?: string;
  audioUrl: string;
  userId: string;
  userName: string;
  userPhoto?: string | null;
  createdAt: any;
  shareId: string;
  languages?: string[];
  theme?: string;
}

interface NameCardProps {
  nameCard: NameCardData;
  showActions?: boolean;
  onDelete?: () => void;
  currentUserId?: string;
}

export const NameCard: React.FC<NameCardProps> = ({
  nameCard,
  showActions = true,
  onDelete,
  currentUserId,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => new Audio(nameCard.audioUrl));
  const [showQRModal, setShowQRModal] = useState(false);

  const theme = getThemeById(nameCard.theme || "default");
  const shareUrl = `${window.location.origin}/share/${nameCard.shareId}`;

  const handlePlay = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${nameCard.fullName}'s Name Pronunciation`,
          text: `Learn how to pronounce ${nameCard.fullName}'s name correctly`,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to copy
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Share link copied to clipboard");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };

  const handleShowQR = () => {
    setShowQRModal(true);
  };

  const canDelete = currentUserId === nameCard.userId;

  // Set up audio event listeners
  React.useEffect(() => {
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [audio]);

  // Get language badges
  const languageBadges =
    nameCard.languages
      ?.map((code) => getLanguageByCode(code))
      .filter(Boolean) || [];

  return (
    <>
      <Card
        className={`w-full max-w-md mx-auto group overflow-hidden ${theme.gradient} border-none shadow-lg hover:shadow-xl transition-all duration-500`}
      >
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Name Information */}
            <div className="text-center space-y-4">
              <h3
                className={`text-3xl font-bold ${theme.textColor} tracking-tight`}
              >
                {nameCard.fullName}
              </h3>

              <div className="flex flex-col items-center gap-3">
                <div
                  className={`inline-flex px-4 py-2 rounded-full ${
                    theme.textColor === "text-white"
                      ? "bg-white/10 backdrop-blur-sm"
                      : "bg-black/5"
                  }`}
                >
                  <p className={`font-mono text-lg ${theme.textColor}`}>
                    {nameCard.phoneticSpelling}
                  </p>
                </div>

                {/* Languages */}
                {languageBadges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {languageBadges.map((language) => (
                      <Badge
                        key={language?.code}
                        variant="secondary"
                        className={`text-sm px-3 py-1 ${
                          theme.textColor === "text-white"
                            ? "bg-white/20"
                            : "bg-black/5"
                        } backdrop-blur-sm`}
                      >
                        <span>{language?.flag}</span>
                        <span className="ml-1">{language?.name}</span>
                      </Badge>
                    ))}
                  </div>
                )}

                {nameCard.pronouns && (
                  <Badge
                    variant="secondary"
                    className={`text-sm px-3 py-1 ${
                      theme.textColor === "text-white"
                        ? "bg-white/20"
                        : "bg-black/5"
                    } backdrop-blur-sm`}
                  >
                    {nameCard.pronouns}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {nameCard.description && (
              <div
                className={`relative rounded-2xl overflow-hidden ${
                  theme.textColor === "text-white"
                    ? "bg-white/10"
                    : "bg-black/5"
                } backdrop-blur-sm`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                <div
                  className={`text-sm ${theme.textColor} p-4 text-center relative z-10 leading-relaxed`}
                >
                  <span className="opacity-70 block mb-1">
                    Origin or Meaning:
                  </span>
                  <span className="font-medium block break-words whitespace-normal">
                    {nameCard.description}
                  </span>
                </div>
              </div>
            )}

            {/* Audio Player */}
            <div className="flex justify-center">
              <div className="relative">
                <Button
                  title="Play Audio"
                  onClick={handlePlay}
                  size="lg"
                  className={`rounded-full w-20 h-20 shadow-lg transition-all duration-300 text-white ${
                    isPlaying
                      ? `${theme.buttonStyle} animate-pulse`
                      : `${theme.buttonStyle} hover:scale-110`
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>

                {/* Sound waves animation when playing */}
                {isPlaying && (
                  <div
                    className={`absolute -inset-2 rounded-full border-2 ${theme.accentColor.replace(
                      "text-",
                      "border-"
                    )} animate-ping opacity-75`}
                  ></div>
                )}

                {/* Volume icon indicator */}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                  <Volume2 className="h-3 w-3 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex justify-center space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className={`${
                    theme.textColor === "text-white"
                      ? "bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white"
                      : "hover:bg-blue-50"
                  } backdrop-blur-sm transition-colors`}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className={`${
                    theme.textColor === "text-white"
                      ? "bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white"
                      : "hover:bg-green-50"
                  } backdrop-blur-sm transition-colors`}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowQR}
                  className={`${
                    theme.textColor === "text-white"
                      ? "bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white"
                      : "hover:bg-purple-50"
                  } backdrop-blur-sm transition-colors`}
                >
                  <QrCode className="h-4 w-4 mr-1" />
                  QR
                </Button>
                {canDelete && onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${
                          theme.textColor === "text-white"
                            ? "bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white"
                            : "hover:bg-red-50 hover:text-red-600"
                        } backdrop-blur-sm transition-colors`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Name Card</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;
                          {nameCard.fullName}&quot;? This action cannot be
                          undone and will permanently remove the name card and
                          its audio recording.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        shareUrl={shareUrl}
        nameCardTitle={nameCard.fullName}
      />
    </>
  );
};
