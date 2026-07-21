import type { Point } from '../data/world-map';

// 等距圆柱投影: 将经纬度转换为屏幕坐标
export function geoToScreen(
  lon: number,
  lat: number,
  width: number,
  height: number
): Point {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

// 将地理坐标数组转换为屏幕坐标数组
export function geoPathToScreen(
  points: [number, number][],
  width: number,
  height: number
): Point[] {
  return points.map(([lon, lat]) => geoToScreen(lon, lat, width, height));
}

// 绘制多边形
export function drawPolygon(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  fillColor: string,
  strokeColor: string,
  lineWidth: number = 1
) {
  if (points.length < 3) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  
  ctx.fillStyle = fillColor;
  ctx.fill();
  
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// 绘制带阴影的海岸线效果
export function drawCoastline(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string,
  lineWidth: number = 0.5
) {
  if (points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// 绘制网格线（经纬网）
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 0.5;
  
  // 经线（每30度）
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // 纬线（每30度）
  for (let lat = -90; lat <= 90; lat += 30) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

// 绘制海洋渐变
export function drawOcean(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
  gradient.addColorStop(0, '#1a2a3a');
  gradient.addColorStop(0.5, '#162433');
  gradient.addColorStop(1, '#0f1a25');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}