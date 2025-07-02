"use client";

import React, { useState, useEffect } from "react";
import { firebaseClient } from "@/lib/firebase-rest";
import { NameCard } from "@/components/name-card/NameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Filter, X, Globe } from "lucide-react";
import { LANGUAGES, getLanguageByCode } from "@/lib/languages";

interface NameCardData {
  id: string;
  fullName: string;
  phoneticSpelling: string;
  pronouns?: string;
  description?: string;
  audioUrl: string;
  audioPath?: string;
  userId: string;
  userName: string;
  userPhoto?: string | null;
  createdAt: any;
  shareId: string;
  languages?: string[];
  theme?: string;
}

export const NameCardGallery: React.FC = () => {
  const [nameCards, setNameCards] = useState<NameCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState<NameCardData[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const fetchNameCards = async () => {
    try {
      const cards = await firebaseClient.getDocuments(
        "nameCards",
        "createdAt",
        50
      );
      setNameCards(cards as NameCardData[]);
    } catch (error) {
      console.error("Error fetching name cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNameCards();
  }, []);

  useEffect(() => {
    let filtered = nameCards;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (card) =>
          card.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.phoneticSpelling
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          card.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (card.description &&
            card.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (card.languages &&
            card.languages.some((langCode) => {
              const lang = getLanguageByCode(langCode);
              return (
                lang &&
                (lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  lang.nativeName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
              );
            }))
      );
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      if (selectedFilter === "with-pronouns") {
        filtered = filtered.filter((card) => card.pronouns);
      } else if (selectedFilter === "with-description") {
        filtered = filtered.filter((card) => card.description);
      } else if (selectedFilter === "with-languages") {
        filtered = filtered.filter(
          (card) => card.languages && card.languages.length > 0
        );
      }
    }

    // Apply language filter
    if (selectedLanguage !== "all") {
      filtered = filtered.filter(
        (card) => card.languages && card.languages.includes(selectedLanguage)
      );
    }

    setFilteredCards(filtered);
  }, [searchTerm, nameCards, selectedFilter, selectedLanguage]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearFilters = () => {
    setSelectedFilter("all");
    setSelectedLanguage("all");
    setSearchTerm("");
  };

  // Get unique languages from all cards
  const getAvailableLanguages = () => {
    const languageCodes = new Set<string>();
    nameCards.forEach((card) => {
      if (card.languages) {
        card.languages.forEach((code) => languageCodes.add(code));
      }
    });
    return Array.from(languageCodes)
      .map((code) => getLanguageByCode(code))
      .filter(Boolean)
      .sort((a, b) => a!.name.localeCompare(b!.name));
  };

  const availableLanguages = getAvailableLanguages();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-20 via-green-50 to-purple-50 pt-24">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Name Pronunciation Gallery
            </h1>
            <p className="text-muted-foreground">
              Discover how to pronounce names correctly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="w-full max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <Skeleton className="h-6 w-32 mx-auto" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                    <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-20 via-green-50 to-purple-50 pt-24">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Name Pronunciation Gallery
          </h1>
          <p className="text-muted-foreground mb-6">
            Discover how to pronounce names correctly from around the world
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, pronunciation, language, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Cards ({nameCards.length})
                  </SelectItem>
                  <SelectItem value="with-pronouns">
                    With Pronouns (
                    {nameCards.filter((card) => card.pronouns).length})
                  </SelectItem>
                  <SelectItem value="with-description">
                    With Description (
                    {nameCards.filter((card) => card.description).length})
                  </SelectItem>
                  <SelectItem value="with-languages">
                    With Languages (
                    {
                      nameCards.filter(
                        (card) => card.languages && card.languages.length > 0
                      ).length
                    }
                    )
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {availableLanguages.map((language) => (
                    <SelectItem key={language!.code} value={language!.code}>
                      <div className="flex items-center gap-2">
                        <span>{language!.flag}</span>
                        <span>{language!.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedFilter !== "all" ||
                selectedLanguage !== "all" ||
                searchTerm) && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(selectedFilter !== "all" || selectedLanguage !== "all") && (
              <div className="flex flex-wrap justify-center gap-2">
                {selectedFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-3 w-3" />
                    {selectedFilter
                      .replace("-", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setSelectedFilter("all")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedLanguage !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Globe className="h-3 w-3" />
                    {getLanguageByCode(selectedLanguage)?.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => setSelectedLanguage("all")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}

            {/* Search Results Info */}
            {(searchTerm ||
              selectedFilter !== "all" ||
              selectedLanguage !== "all") && (
              <div className="text-sm text-muted-foreground">
                {filteredCards.length} result
                {filteredCards.length !== 1 ? "s" : ""} found
                {searchTerm && ` for "${searchTerm}"`}
              </div>
            )}
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="bg-muted p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ||
              selectedFilter !== "all" ||
              selectedLanguage !== "all"
                ? "No name cards match your current filters. Try adjusting your search criteria."
                : "No name cards available yet."}
            </p>
            {(searchTerm ||
              selectedFilter !== "all" ||
              selectedLanguage !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCards.map((nameCard) => (
              <NameCard
                key={nameCard.id}
                nameCard={nameCard}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
