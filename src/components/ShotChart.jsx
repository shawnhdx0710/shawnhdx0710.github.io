import { useEffect, useRef } from 'react';

const WIDTH = 500;
const HEIGHT = 470;

// Synthetic NBA shot data — made/missed 3-pointers
const shots = [
  { x: 80, y: 210, made: true },
  { x: 420, y: 210, made: true },
  { x: 250, y: 50, made: false },
  { x: 160, y: 100, made: true },
  { x: 340, y: 100, made: true },
  { x: 100, y: 300, made: false },
  { x: 400, y: 300, made: true },
  { x: 60, y: 150, made: true },
  { x: 440, y: 150, made: false },
  { x: 250, y: 30, made: true },
  { x: 190, y: 70, made: false },
  { x: 310, y: 70, made: true },
  { x: 130, y: 180, made: true },
  { x: 370, y: 180, made: false },
  { x: 250, y: 140, made: true },
];

function drawCourt(ctx) {
  const w = WIDTH;
  const h = HEIGHT;

  // Floor
  ctx.fillStyle = '#f5f0eb';
  ctx.fillRect(0, 0, w, h);

  // Three-point arc
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w / 2, h - 60, 230, Math.PI, 0);
  ctx.stroke();

  // Key
  ctx.strokeRect(w / 2 - 60, h - 200, 120, 140);
  ctx.beginPath();
  ctx.arc(w / 2, h - 60, 60, Math.PI, 0);
  ctx.stroke();

  // Hoop
  ctx.beginPath();
  ctx.arc(w / 2, h - 60, 7, 0, 2 * Math.PI);
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawShots(ctx) {
  for (const shot of shots) {
    ctx.beginPath();
    ctx.arc(shot.x, shot.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = shot.made ? '#2ecc71' : '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export default function ShotChart() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawCourt(ctx);
    drawShots(ctx);
  }, []);

  return (
    <div className="my-6 flex flex-col items-center">
      <canvas
        ref={ref}
        width={WIDTH}
        height={HEIGHT}
        className="rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-[500px] h-auto"
      />
      <div className="flex gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#2ecc71]" />
          Made
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#e74c3c]" />
          Missed
        </span>
      </div>
    </div>
  );
}
