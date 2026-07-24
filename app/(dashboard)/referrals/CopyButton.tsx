// @ts-nocheck
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl max-w-lg w-full">
      <span className="font-mono text-xs text-indigo-200 select-all truncate flex-1 pl-1">
        {text}
      </span>
      <Button
        onClick={handleCopy}
        size="sm"
        className={`h-9 font-bold rounded-lg px-4 ${
          copied ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  );
}
