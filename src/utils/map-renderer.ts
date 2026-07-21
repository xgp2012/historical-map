import { continents, project } from '../data/world-map';
import { empires } from '../data/empires';
import type { HistoricalPeriod, Territory } from '../data/historical-data';
import { geoPathToScreen, drawPolygon, drawOcean, drawGrid } from './map-projection';

export class MapRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private currentPeriod: HistoricalPeriod | null = null;
  private animationProgress: number = 1;
  private prevTerritories: Territory[] = [];
  private nextTerritories: Territory[] = [];
  private isAnimating: boolean = false;
  private animationId: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.render();
  }

  setPeriod(period: HistoricalPeriod) {
    if (this.currentPeriod) {
      this.prevTerritories = this.currentPeriod.territories;
    } else {
      this.prevTerritories = period.territories;
    }
    this.nextTerritories = period.territories;
    this.currentPeriod = period;
    this.animationProgress = 0;
    this.isAnimating = true;
    this.animate();
  }

  private animate() {
    const duration = 600; // 动画持续时间（毫秒）
    const startTime = performance.now();
    
    const step = (time: number) => {
      const elapsed = time - startTime;
      this.animationProgress = Math.min(elapsed / duration, 1);
      // 缓动函数
      const eased = 1 - Math.pow(1 - this.animationProgress, 3);
      this.render(eased);
      
      if (this.animationProgress < 1) {
        this.animationId = requestAnimationFrame(step);
      } else {
        this.isAnimating = false;
        this.animationProgress = 1;
      }
    };
    
    this.animationId = requestAnimationFrame(step);
  }

  private render(transitionProgress: number = 1) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    
    // 清空画布
    ctx.clearRect(0, 0, w, h);
    
    // 绘制海洋背景
    drawOcean(ctx, w, h);
    
    // 绘制网格
    drawGrid(ctx, w, h);
    
    // 绘制大陆轮廓
    this.drawContinents(ctx, w, h);
    
    // 绘制帝国疆域
    if (this.currentPeriod) {
      this.drawTerritories(ctx, w, h, transitionProgress);
    }
    
    // 绘制大陆轮廓线（覆盖在疆域之上）
    this.drawContinentBorders(ctx, w, h);
  }

  private drawContinents(ctx: CanvasRenderingContext2D, w: number, h: number) {
    for (const continent of continents) {
      for (const path of continent.paths) {
        const points = path.map(([lon, lat]) => project(lon, lat, w, h));
        if (points.length < 3) continue;
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        
        // 大陆填充
        ctx.fillStyle = 'rgba(60, 50, 40, 0.6)';
        ctx.fill();
      }
    }
  }

  private drawContinentBorders(ctx: CanvasRenderingContext2D, w: number, h: number) {
    for (const continent of continents) {
      for (const path of continent.paths) {
        const points = path.map(([lon, lat]) => project(lon, lat, w, h));
        if (points.length < 3) continue;
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        
        ctx.strokeStyle = 'rgba(100, 85, 65, 0.8)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  private drawTerritories(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    transitionProgress: number
  ) {
    if (!this.currentPeriod) return;
    
    const territories = this.currentPeriod.territories;
    
    for (const territory of territories) {
      const empire = empires.find(e => e.id === territory.empireId);
      if (!empire) continue;
      
      // 计算透明度（过渡动画）
      const alpha = 0.5 + 0.3 * transitionProgress;
      const color = empire.color.replace(/[\d.]+\)$/, `${alpha})`);
      const borderColor = empire.borderColor;
      
      const points = geoPathToScreen(territory.points, w, h);
      drawPolygon(ctx, points, color, borderColor, 1.5);
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', () => this.resize());
  }
}