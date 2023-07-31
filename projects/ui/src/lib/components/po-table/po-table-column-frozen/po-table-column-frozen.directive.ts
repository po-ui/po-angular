import { AfterViewInit, Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[pFrozenColumn]',
  host: {
    class: 'p-element',
    '[class.po-frozen-column]': 'frozen'
  }
})
export class PoTableColumnFrozenDirective implements AfterViewInit, OnChanges {
  _frozen: boolean = true;

  get frozen(): boolean {
    return this._frozen;
  }

  @Input('pFrozenColumn') set frozen(val: boolean) {
    this._frozen = val;

    if (!val) {
      this.renderer.removeClass(this.el.nativeElement, 'po-table-column-fixed');
    } else {
      this.updateStickyPosition();
    }
  }

  @Input() alignFrozen: string = 'left';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateStickyPosition();
    }, 300);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.frozen.previousValue && !changes.frozen.currentValue) {
      setTimeout(() => {
        this.resizeColumns();
      }, 100);
    }
  }

  /* istanbul ignore next */
  updateStickyPosition() {
    if (this._frozen) {
      if (this.alignFrozen === 'right') {
        let right = 0;
        const next = this.el.nativeElement.nextElementSibling;

        if (next) {
          right = this.getOuterWidth(next) + (parseFloat(next.style.right) || 0);
        }
        this.el.nativeElement.style.right = right + 'px';
      } else {
        let left = 0;
        const prev = this.el.nativeElement.previousElementSibling;
        if (
          prev &&
          !prev.classList.contains('po-table-column-selectable') &&
          !prev.classList.contains('po-table-column-actions') &&
          !prev.classList.contains('po-table-column-detail-toggle') &&
          !prev.classList.contains('po-table-header-master-detail')
        ) {
          left = this.getOuterWidth(prev) + (parseFloat(prev.style.left) || 0);
        }
        this.el.nativeElement.style.left = left - 1 + 'px';
        this.renderer.addClass(this.el.nativeElement, 'po-table-column-fixed');
      }

      const filterRow = this.el.nativeElement.parentElement.nextElementSibling;

      if (filterRow) {
        const index = this.index(this.el.nativeElement);
        if (filterRow.children && filterRow.children[index]) {
          filterRow.children[index].style.left = this.el.nativeElement.style.left;
          filterRow.children[index].style.right = this.el.nativeElement.style.right;
        }
      }
    }
  }

  /* istanbul ignore next */
  resizeColumns() {
    const currentElement = this.el.nativeElement;
    const prevElements = [];
    let prevElement = currentElement.previousElementSibling;

    // Encontra todos os elementos anteriores com a classe 'po-table-column-fixed'
    while (prevElement && prevElement.classList.contains('po-table-column-fixed')) {
      prevElements.push(prevElement);
      prevElement = prevElement.previousElementSibling;
    }

    // Verifica se há elementos suficientes para ajustar os widths
    if (prevElements.length >= 2) {
      let leftAccumulator = 0;

      // Calcula o novo 'left' para cada elemento anterior e aplica
      for (let i = prevElements.length - 1; i >= 0; i--) {
        const prevWidth = this.getOuterWidth(prevElements[i], true);
        prevElements[i].style.left = leftAccumulator - 1 + 'px';
        leftAccumulator += prevWidth;
      }
    }
  }

  getOuterWidth(el, margin?) {
    let width = el.offsetWidth;

    if (margin) {
      const style = getComputedStyle(el);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    return width - 1;
  }

  index(element: any): number {
    const children = element.parentNode.childNodes;
    let num = 0;
    for (let i = 0; i < children.length; i++) {
      if (children[i] === element) {
        return num;
      }
      if (children[i].nodeType === 1) {
        num++;
      }
    }
    return -1;
  }
}
