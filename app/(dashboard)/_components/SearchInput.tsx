"use client";

import React, { useEffect, useState } from "react";
import qs from "query-string";
import { Search, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const SearchInput = () => {
  const router = useRouter();

  const [value, setValue] = useState("");

  const [debounceValue, setDebounceValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);

      const url = qs.stringifyUrl(
        {
          url: "/",
          query: {
            search: debounceValue,
          },
        },
        { skipEmptyString: true, skipNull: true }
      );

      router.push(url);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, debounceValue, router]);

  return (
    <div className="relative w-full max-w-[520px] flex items-center gap-3">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

      <Input
        className="w-full px-9"
        value={value}
        placeholder="Search Boards..."
        onChange={(e) => setValue(e.target.value)}
      />

      {value.length > 0 && (
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          type="button"
          onClick={() => setValue("")}
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
