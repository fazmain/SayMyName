"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CARD_THEMES, CardTheme } from "@/lib/card-themes";
import { Check, Crown, Play } from "lucide-react";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
  showPremium?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  showPremium = false,
}) => {
  const availableThemes = showPremium
    ? CARD_THEMES
    : CARD_THEMES.filter((theme) => !theme.isPremium);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {availableThemes.map((theme) => (
          <div
            key={theme.id}
            className="relative cursor-pointer"
            onClick={() => onThemeChange(theme.id)}
          >
            <Card
              className={`transition-all duration-200 ${
                selectedTheme === theme.id
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "hover:shadow-md"
              }`}
            >
              <CardContent className="p-3">
                {/* Theme Preview */}
                <div
                  className={`${theme.preview} rounded-lg p-4 mb-3 min-h-[100px] flex flex-col justify-center items-center relative border`}
                >
                  {/* {theme.isPremium && (
                    <div className="absolute top-2 right-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                    </div>
                  )} */}

                  {/* Mini name card preview */}
                  <div className="text-center space-y-2 w-full">
                    <h4 className={`text-xs font-bold ${theme.textColor}`}>
                      Sample Name
                    </h4>
                    <div
                      className={`text-xs ${theme.textColor} opacity-70 font-mono`}
                    >
                      sample
                    </div>
                    <div className="flex justify-center">
                      <div
                        className={`w-6 h-6 rounded-full ${theme.buttonStyle} flex items-center justify-center`}
                      >
                        <Play className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theme Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                    {selectedTheme === theme.id && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {theme.description}
                  </p>
                  {/* {theme.isPremium && (
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )} */}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* {!showPremium && CARD_THEMES.some(theme => theme.isPremium) && (
        <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
          <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <h4 className="font-medium mb-1">Unlock Premium Themes</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Get access to exclusive themes and customization options
          </p>
          <Button size="sm" variant="outline">
            Upgrade to Pro
          </Button>
        </div>
      )} */}
    </div>
  );
};
