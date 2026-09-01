import { ElementRef, Injectable } from '@angular/core';

/**
 * Serviço responsável pelo gerenciamento de foco e navegação por teclado do PoTreeView.
 */
@Injectable()
export class PoTreeViewKeyboardService {
  private hostElement: ElementRef<HTMLElement>;
  private lastFocusedNode: HTMLElement | null = null;

  setHostElement(element: ElementRef<HTMLElement>) {
    this.hostElement = element;
  }

  setLastFocusedNode(node: HTMLElement) {
    this.lastFocusedNode = node;
  }

  focusLastOrFirst(): void {
    if (this.lastFocusedNode && this.hostElement?.nativeElement.contains(this.lastFocusedNode)) {
      this.focusNode(this.lastFocusedNode);
    } else {
      this.focusFirst();
    }
  }

  private getVisibleNodes(): Array<HTMLElement> {
    if (!this.hostElement) {
      return [];
    }
    return Array.from(this.hostElement.nativeElement.querySelectorAll('.po-tree-view-item-content-padding[tabindex]'));
  }

  private getFocusableNodes(): Array<HTMLElement> {
    return this.getVisibleNodes().filter(node => this.isNodeFocusable(node));
  }

  focusFirst(): void {
    const nodes = this.getFocusableNodes();
    if (nodes.length) {
      this.focusNode(nodes[0]);
    }
  }

  focusLast(): void {
    const nodes = this.getFocusableNodes();
    if (nodes.length) {
      this.focusNode(nodes[nodes.length - 1]);
    }
  }

  focusNext(currentNode: HTMLElement): void {
    const nodes = this.getFocusableNodes();
    const index = nodes.indexOf(currentNode);
    if (index < nodes.length - 1) {
      this.focusNode(nodes[index + 1]);
    }
  }

  focusPrevious(currentNode: HTMLElement): void {
    const nodes = this.getFocusableNodes();
    const index = nodes.indexOf(currentNode);
    if (index > 0) {
      this.focusNode(nodes[index - 1]);
    }
  }

  focusFirstChild(currentNode: HTMLElement): void {
    this.focusNext(currentNode);
  }

  focusParent(currentNode: HTMLElement): void {
    const currentLi = currentNode.closest('[po-tree-view-item]');
    if (!currentLi) {
      return;
    }

    const parentGroup = currentLi.closest('.po-tree-view-item-group');
    if (!parentGroup) {
      return;
    }

    const parentLi = parentGroup.closest('[po-tree-view-item]');
    if (!parentLi) {
      return;
    }

    const parentNode = parentLi.querySelector(':scope > po-tree-view-item-content .po-tree-view-item-content-padding');
    if (parentNode) {
      this.focusNode(parentNode as HTMLElement);
    }
  }

  hasParentNode(currentNode: HTMLElement): boolean {
    const currentLi = currentNode.closest('[po-tree-view-item]');
    if (!currentLi) {
      return false;
    }
    const parentGroup = currentLi.closest('.po-tree-view-item-group');
    return !!parentGroup;
  }

  focusByCharacter(char: string, currentNode: HTMLElement): void {
    const nodes = this.getFocusableNodes();
    if (!nodes.length) {
      return;
    }

    const currentIndex = nodes.indexOf(currentNode);
    const totalNodes = nodes.length;
    const searchChar = char.toLowerCase();

    for (let i = 1; i <= totalNodes; i++) {
      const candidateIndex = (currentIndex + i) % totalNodes;
      const candidate = nodes[candidateIndex];

      const label = candidate.getAttribute('aria-label') || '';
      if (label.length && label[0].toLowerCase() === searchChar) {
        this.focusNode(candidate);
        return;
      }
    }
  }

  private isNodeFocusable(node: HTMLElement): boolean {
    const isDisabled = node.getAttribute('aria-disabled') === 'true';
    if (!isDisabled) {
      return true;
    }

    return node.hasAttribute('aria-expanded');
  }

  private focusNode(node: HTMLElement): void {
    (node as any).focus({ focusVisible: true });
  }
}
