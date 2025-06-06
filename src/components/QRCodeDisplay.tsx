
interface QRCodeDisplayProps {
  text: string;
  size?: number;
}

export const QRCodeDisplay = ({ text, size = 150 }: QRCodeDisplayProps) => {
  // Mock QR code display - in production, use a proper QR code library
  return (
    <div 
      className="bg-white rounded-lg flex items-center justify-center text-xs p-4 break-all text-center shadow-lg border border-gray-200"
      style={{ width: size, height: size }}
    >
      <div className="space-y-2">
        <div className="text-4xl">📱</div>
        <div className="text-gray-700 text-xs font-mono leading-tight">
          {text?.substring(0, 25)}...
        </div>
        <div className="text-gray-500 text-xs">
          QR Code
        </div>
      </div>
    </div>
  );
};
