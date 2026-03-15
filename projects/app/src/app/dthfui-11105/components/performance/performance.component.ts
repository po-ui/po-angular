import { Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';

import { generateMockItems } from '../../mock-data';

@Component({
  selector: 'dthfui-11105-performance',
  templateUrl: './performance.component.html',
  standalone: false
})
export class PerformanceTestComponent implements OnDestroy {
  @ViewChild('fpsDisplay', { static: false }) fpsDisplay!: ElementRef;

  items = generateMockItems(5000);
  fps = 0;
  theadPositionY = 'N/A';
  autoScrolling = false;

  columns: Array<PoTableColumn> = [
    { property: 'id', label: 'ID', width: '80px' },
    { property: 'name', label: 'Nome', width: '200px' },
    { property: 'email', label: 'Email', width: '250px' },
    { property: 'city', label: 'Cidade', width: '150px' },
    { property: 'status', label: 'Status', width: '120px' },
    { property: 'value', label: 'Valor', width: '120px', type: 'currency', format: 'BRL' },
    { property: 'date', label: 'Data', width: '150px', type: 'date' },
    { property: 'category', label: 'Categoria', width: '150px' }
  ];

  height = this.getHeight();

  private fpsFrameId: number | null = null;
  private autoScrollId: number | null = null;
  private lastTime = performance.now();
  private frameCount = 0;

  constructor(private ngZone: NgZone) {}

  startFpsCounter(): void {
    if (this.fpsFrameId !== null) return;

    this.ngZone.runOutsideAngular(() => {
      const measure = () => {
        this.frameCount++;
        const now = performance.now();
        const elapsed = now - this.lastTime;

        if (elapsed >= 1000) {
          this.fps = Math.round((this.frameCount * 1000) / elapsed);
          this.frameCount = 0;
          this.lastTime = now;
          this.updateTheadPosition();
        }

        this.fpsFrameId = requestAnimationFrame(measure);
      };

      this.fpsFrameId = requestAnimationFrame(measure);
    });
  }

  stopFpsCounter(): void {
    if (this.fpsFrameId !== null) {
      cancelAnimationFrame(this.fpsFrameId);
      this.fpsFrameId = null;
    }
  }

  toggleAutoScroll(): void {
    if (this.autoScrolling) {
      this.stopAutoScroll();
    } else {
      this.startAutoScroll();
    }
  }

  private startAutoScroll(): void {
    this.autoScrolling = true;
    const viewport = document.querySelector('cdk-virtual-scroll-viewport');
    if (!viewport) return;

    let scrollDown = true;

    this.ngZone.runOutsideAngular(() => {
      const scroll = () => {
        if (!this.autoScrolling) return;

        if (scrollDown) {
          viewport.scrollTop += 3;
          if (viewport.scrollTop >= viewport.scrollHeight - viewport.clientHeight) {
            scrollDown = false;
          }
        } else {
          viewport.scrollTop -= 3;
          if (viewport.scrollTop <= 0) {
            scrollDown = true;
          }
        }

        this.autoScrollId = requestAnimationFrame(scroll);
      };

      this.autoScrollId = requestAnimationFrame(scroll);
    });
  }

  private stopAutoScroll(): void {
    this.autoScrolling = false;
    if (this.autoScrollId !== null) {
      cancelAnimationFrame(this.autoScrollId);
      this.autoScrollId = null;
    }
  }

  private updateTheadPosition(): void {
    const thead = document.querySelector('po-table thead');
    if (thead) {
      const rect = thead.getBoundingClientRect();
      this.theadPositionY = `${Math.round(rect.top)}px`;
    }
  }

  getHeight(): number {
    return window.innerHeight - 400;
  }

  ngOnDestroy(): void {
    this.stopFpsCounter();
    this.stopAutoScroll();
  }
}
