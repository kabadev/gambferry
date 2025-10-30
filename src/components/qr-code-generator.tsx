"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeGenerator({
  value,
  size = 200,
  className = "",
}: QRCodeGeneratorProps) {
  return (
    <div className={className}>
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        includeMargin={true}
        className="w-full h-auto border-2 border-gray-300 rounded-lg"
      />
    </div>
  );
}
