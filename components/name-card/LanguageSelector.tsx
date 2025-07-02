'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { LANGUAGES, Language, getLanguagesByName } from '@/lib/languages';
import { Check, Plus, X, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
  maxLanguages?: number;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  onLanguagesChange,
  maxLanguages = 5,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedLanguageObjects = selectedLanguages
    .map(code => LANGUAGES.find(lang => lang.code === code))
    .filter(Boolean) as Language[];

  const availableLanguages = LANGUAGES.filter(
    lang => !selectedLanguages.includes(lang.code)
  );

  const filteredLanguages = searchTerm
    ? getLanguagesByName(searchTerm).filter(lang => !selectedLanguages.includes(lang.code))
    : availableLanguages;

  const handleLanguageSelect = (languageCode: string) => {
    if (selectedLanguages.length < maxLanguages) {
      onLanguagesChange([...selectedLanguages, languageCode]);
      setOpen(false);
      setSearchTerm('');
    }
  };

  const handleLanguageRemove = (languageCode: string) => {
    onLanguagesChange(selectedLanguages.filter(code => code !== languageCode));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedLanguageObjects.map((language) => (
          <Badge
            key={language.code}
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleLanguageRemove(language.code)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        
        {selectedLanguages.length < maxLanguages && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-dashed"
              >
                <Plus className="h-4 w-4" />
                Add Language
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search languages..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>No languages found.</CommandEmpty>
                  <CommandGroup>
                    {filteredLanguages.slice(0, 10).map((language) => (
                      <CommandItem
                        key={language.code}
                        value={language.name}
                        onSelect={() => handleLanguageSelect(language.code)}
                        className="flex items-center gap-3"
                      >
                        <span className="text-lg">{language.flag}</span>
                        <div className="flex flex-col">
                          <span>{language.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {language.nativeName}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {selectedLanguages.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span>Add languages to help others understand the origin of your name</span>
        </div>
      )}

      {selectedLanguages.length >= maxLanguages && (
        <p className="text-sm text-muted-foreground">
          Maximum {maxLanguages} languages allowed
        </p>
      )}
    </div>
  );
};