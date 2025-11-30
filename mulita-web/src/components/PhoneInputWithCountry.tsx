"use client";

import React, { useState, useRef, useEffect } from "react";
import { getCountryCallingCode } from "libphonenumber-js";
import { countries } from "country-flag-icons";

interface Country {
  code: string;
  name: string;
  callingCode: string;
  flag: string;
}

const COUNTRY_LIST: Country[] = countries
  .map((code) => {
    try {
      const callingCode = getCountryCallingCode(code as any);
      return {
        code,
        name: new Intl.DisplayNames(["es"], { type: "region" }).of(code) || code,
        callingCode: `+${callingCode}`,
        flag: String.fromCodePoint(...[...code].map((x) => 0x1f1a5 + x.charCodeAt(0))),
      };
    } catch {
      return null;
    }
  })
  .filter(Boolean) as Country[];

COUNTRY_LIST.sort((a, b) => a.name.localeCompare(b.name));

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PhoneInputWithCountry({
  value,
  onChange,
  placeholder = "Teléfono",
}: PhoneInputWithCountryProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRY_LIST.find((c) => c.code === "AR") || COUNTRY_LIST[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountries = COUNTRY_LIST.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.callingCode.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm("");
    // Set only the country code
    onChange(country.callingCode);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    const callingCode = selectedCountry.callingCode;

    // Only allow numbers, spaces, dashes, parentheses (no + anywhere)
    input = input.replace(/[^\d\s\-()]/g, "");

    // Get just the digits part after the calling code (without +)
    const callingCodeDigits = callingCode.replace("+", "");

    // If input is empty or being deleted to near the start, restore country code
    if (!input || input.length < callingCodeDigits.length) {
      onChange(callingCode);
      return;
    }

    // If it starts with calling code already, keep it
    if (input.startsWith(callingCodeDigits)) {
      onChange(callingCode + input.substring(callingCodeDigits.length));
      return;
    }

    // Otherwise prepend calling code
    onChange(callingCode + input);
  };

  return (
    <div className="flex gap-2 w-full">
      {/* Country Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-lg border border-gray-300 h-10 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-xl">{selectedCountry.flag}</span>
          <span className="text-sm font-medium">{selectedCountry.callingCode}</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Country List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelectCountry(country)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="text-xl">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.callingCode}</div>
                  </div>
                  {selectedCountry.code === country.code && (
                    <span className="text-blue-600 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={handlePhoneChange}
        className="flex-1 shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-lg border border-gray-300 h-10 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  );
}
