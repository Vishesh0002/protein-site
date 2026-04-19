"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Phone, Search } from "lucide-react";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";
import "react-international-phone/style.css";

export default function PhoneInput({
  value,
  onChange,
  defaultCountry = "in",
}: {
  value: string;
  onChange: (phone: string) => void;
  defaultCountry?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry,
      value,
      countries: defaultCountries,
      onChange: (data) => onChange(data.phone),
    });

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return defaultCountries;
    return defaultCountries.filter((c) => {
      const parsed = parseCountry(c);
      return (
        parsed.name.toLowerCase().includes(q) ||
        parsed.dialCode.includes(q.replace(/^\+/, "")) ||
        parsed.iso2.toLowerCase().includes(q)
      );
    });
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex gap-0">
        {/* Country selector button */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-l-xl border border-r-0 border-white/10 bg-white/[0.03] px-3 text-sm text-white transition-all hover:bg-white/10"
        >
          <FlagImage iso2={country.iso2} size="20px" />
          <span className="font-medium">+{country.dialCode}</span>
          <ChevronDown size={14} className="text-white/40" />
        </button>

        {/* Phone number input */}
        <div className="relative flex-1">
          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            ref={inputRef}
            type="tel"
            value={inputValue}
            onChange={handlePhoneValueChange}
            className="w-full rounded-r-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none"
            placeholder="98765 43210"
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 shadow-2xl">
          <div className="border-b border-white/10 p-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full rounded-lg bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filteredCountries.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-white/40">No matches</p>
            ) : (
              filteredCountries.map((c) => {
                const p = parseCountry(c);
                const active = p.iso2 === country.iso2;
                return (
                  <button
                    key={p.iso2}
                    type="button"
                    onClick={() => {
                      setCountry(p.iso2);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-white/5 ${
                      active ? "bg-orange-500/10 text-orange-300" : "text-white/80"
                    }`}
                  >
                    <FlagImage iso2={p.iso2} size="20px" />
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="text-white/50">+{p.dialCode}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
