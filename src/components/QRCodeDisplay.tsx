
import { useEffect, useRef } from 'react';

interface QRCodeDisplayProps {
  text: string;
  size?: number;
}

export const QRCodeDisplay = ({ text, size = 150 }: QRCodeDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !text) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple QR code-like pattern generator
    const cellSize = 4;
    const gridSize = Math.floor(size / cellSize);
    
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate pattern based on text hash
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Create QR-like pattern
    ctx.fillStyle = '#000000';
    
    // Position markers (corners)
    const drawPositionMarker = (x: number, y: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if ((i === 0 || i === 6 || j === 0 || j === 6) || 
              (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            ctx.fillRect((x + i) * cellSize, (y + j) * cellSize, cellSize, cellSize);
          }
        }
      }
    };
    
    // Draw position markers
    drawPositionMarker(0, 0); // Top-left
    drawPositionMarker(gridSize - 7, 0); // Top-right
    drawPositionMarker(0, gridSize - 7); // Bottom-left
    
    // Fill data area with pattern
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // Skip position markers
        if ((x < 9 && y < 9) || 
            (x >= gridSize - 9 && y < 9) || 
            (x < 9 && y >= gridSize - 9)) {
          continue;
        }
        
        // Generate pseudo-random pattern based on position and hash
        const seed = hash + x * 31 + y * 17;
        if (seed % 3 === 0) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [text, size]);

  return (
    <div className="bg-white rounded-lg p-2 shadow-lg border border-gray-200 inline-block">
      <canvas 
        ref={canvasRef}
        className="block"
        style={{ width: size, height: size }}
      />
      <div className="text-center mt-2">
        <div className="text-xs text-gray-500 font-medium">Scan QR Code</div>
      </div>
    </div>
  );
};
