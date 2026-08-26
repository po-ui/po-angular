import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PoTreeViewKeyboardService } from './po-tree-view-keyboard.service';

describe('PoTreeViewKeyboardService:', () => {
  let service: PoTreeViewKeyboardService;
  let hostElement: HTMLElement;

  function createNode(label: string, options: { disabled?: boolean; hasSubItems?: boolean } = {}): HTMLElement {
    const li = document.createElement('li');
    li.setAttribute('po-tree-view-item', '');

    const content = document.createElement('po-tree-view-item-content');
    const node = document.createElement('div');
    node.classList.add('po-tree-view-item-content-padding');
    node.setAttribute('tabindex', '-1');
    node.setAttribute('aria-label', label);

    if (options.disabled) {
      node.setAttribute('aria-disabled', 'true');
    }
    if (options.hasSubItems) {
      node.setAttribute('aria-expanded', 'false');
    }

    content.appendChild(node);
    li.appendChild(content);
    return li;
  }

  function buildTree(nodes: Array<HTMLElement>): void {
    const ul = document.createElement('ul');
    ul.classList.add('po-tree-view');
    nodes.forEach(n => ul.appendChild(n));
    hostElement.appendChild(ul);
  }

  function getNodes(): Array<HTMLElement> {
    return Array.from(hostElement.querySelectorAll('.po-tree-view-item-content-padding'));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoTreeViewKeyboardService]
    });

    service = TestBed.inject(PoTreeViewKeyboardService);
    hostElement = document.createElement('po-tree-view');
    document.body.appendChild(hostElement);
    service.setHostElement(new ElementRef(hostElement));
  });

  afterEach(() => {
    document.body.removeChild(hostElement);
  });

  describe('getVisibleNodes:', () => {
    it('should return empty array when hostElement is not set', () => {
      service.setHostElement(undefined);
      expect(service['getVisibleNodes']()).toEqual([]);
    });

    it('should return all nodes with tabindex attribute', () => {
      buildTree([createNode('A'), createNode('B'), createNode('C')]);
      expect(service['getVisibleNodes']().length).toBe(3);
    });
  });

  describe('getFocusableNodes:', () => {
    it('should include enabled nodes', () => {
      buildTree([createNode('A'), createNode('B')]);
      expect(service['getFocusableNodes']().length).toBe(2);
    });

    it('should exclude disabled nodes without subItems', () => {
      buildTree([createNode('A'), createNode('B', { disabled: true }), createNode('C')]);
      expect(service['getFocusableNodes']().length).toBe(2);
    });

    it('should include disabled nodes with subItems', () => {
      buildTree([createNode('A'), createNode('B', { disabled: true, hasSubItems: true }), createNode('C')]);
      expect(service['getFocusableNodes']().length).toBe(3);
    });
  });

  describe('focusFirst:', () => {
    it('should focus the first focusable node', () => {
      buildTree([createNode('A'), createNode('B')]);
      const nodes = getNodes();
      spyOn(nodes[0], 'focus');

      service.focusFirst();

      expect(nodes[0].focus).toHaveBeenCalled();
    });

    it('should skip disabled nodes without subItems', () => {
      buildTree([createNode('A', { disabled: true }), createNode('B')]);
      const nodes = getNodes();
      spyOn(nodes[0], 'focus');
      spyOn(nodes[1], 'focus');

      service.focusFirst();

      expect(nodes[0].focus).not.toHaveBeenCalled();
      expect(nodes[1].focus).toHaveBeenCalled();
    });
  });

  describe('focusLast:', () => {
    it('should focus the last focusable node', () => {
      buildTree([createNode('A'), createNode('B'), createNode('C')]);
      const nodes = getNodes();
      spyOn(nodes[2], 'focus');

      service.focusLast();

      expect(nodes[2].focus).toHaveBeenCalled();
    });

    it('should skip disabled nodes without subItems at end', () => {
      buildTree([createNode('A'), createNode('B'), createNode('C', { disabled: true })]);
      const nodes = getNodes();
      spyOn(nodes[1], 'focus');

      service.focusLast();

      expect(nodes[1].focus).toHaveBeenCalled();
    });
  });

  describe('focusNext:', () => {
    it('should focus the next node', () => {
      buildTree([createNode('A'), createNode('B'), createNode('C')]);
      const nodes = getNodes();
      spyOn(nodes[1], 'focus');

      service.focusNext(nodes[0]);

      expect(nodes[1].focus).toHaveBeenCalled();
    });

    it('should not move if already at last node', () => {
      buildTree([createNode('A'), createNode('B')]);
      const nodes = getNodes();
      spyOn(nodes[0], 'focus');

      service.focusNext(nodes[1]);

      expect(nodes[0].focus).not.toHaveBeenCalled();
    });
  });

  describe('focusPrevious:', () => {
    it('should focus the previous node', () => {
      buildTree([createNode('A'), createNode('B'), createNode('C')]);
      const nodes = getNodes();
      spyOn(nodes[1], 'focus');

      service.focusPrevious(nodes[2]);

      expect(nodes[1].focus).toHaveBeenCalled();
    });

    it('should not move if already at first node', () => {
      buildTree([createNode('A'), createNode('B')]);
      const nodes = getNodes();
      spyOn(nodes[1], 'focus');

      service.focusPrevious(nodes[0]);

      expect(nodes[1].focus).not.toHaveBeenCalled();
    });
  });

  describe('focusFirstChild:', () => {
    it('should delegate to focusNext', () => {
      buildTree([createNode('A'), createNode('B')]);
      const nodes = getNodes();
      spyOn(service, 'focusNext');

      service.focusFirstChild(nodes[0]);

      expect(service.focusNext).toHaveBeenCalledWith(nodes[0]);
    });
  });

  describe('focusParent:', () => {
    it('should focus the parent node', () => {
      const parentLi = createNode('Parent', { hasSubItems: true });
      const childLi = createNode('Child');

      const group = document.createElement('ul');
      group.classList.add('po-tree-view-item-group');
      group.appendChild(childLi);
      parentLi.appendChild(group);

      buildTree([parentLi]);

      const parentNode = getNodes()[0];
      const childNode = getNodes()[1];
      spyOn(parentNode, 'focus');

      service.focusParent(childNode);

      expect(parentNode.focus).toHaveBeenCalled();
    });

    it('should do nothing if no parent group exists', () => {
      buildTree([createNode('A')]);
      const nodes = getNodes();

      expect(() => service.focusParent(nodes[0])).not.toThrow();
    });

    it('should do nothing if currentLi is not found', () => {
      const detachedNode = document.createElement('div');
      expect(() => service.focusParent(detachedNode)).not.toThrow();
    });

    it('should do nothing if parentLi is not found', () => {
      // Create a node inside a group but without a parent li with [po-tree-view-item]
      const group = document.createElement('ul');
      group.classList.add('po-tree-view-item-group');
      const li = document.createElement('li');
      li.setAttribute('po-tree-view-item', '');
      const content = document.createElement('po-tree-view-item-content');
      const node = document.createElement('div');
      node.classList.add('po-tree-view-item-content-padding');
      content.appendChild(node);
      li.appendChild(content);
      group.appendChild(li);
      hostElement.appendChild(group);

      expect(() => service.focusParent(node)).not.toThrow();
    });
  });

  describe('hasParentNode:', () => {
    it('should return false for root level node', () => {
      buildTree([createNode('A')]);
      const nodes = getNodes();

      expect(service.hasParentNode(nodes[0])).toBe(false);
    });

    it('should return false if currentLi is not found', () => {
      const detachedNode = document.createElement('div');
      expect(service.hasParentNode(detachedNode)).toBe(false);
    });

    it('should return true for nested node', () => {
      const parentLi = createNode('Parent', { hasSubItems: true });
      const childLi = createNode('Child');

      const group = document.createElement('ul');
      group.classList.add('po-tree-view-item-group');
      group.appendChild(childLi);
      parentLi.appendChild(group);

      buildTree([parentLi]);

      const childNode = getNodes()[1];

      expect(service.hasParentNode(childNode)).toBe(true);
    });
  });

  describe('focusByCharacter:', () => {
    it('should focus the next node matching the character', () => {
      buildTree([createNode('Ana'), createNode('Bruno'), createNode('Carlos')]);
      const nodes = getNodes();
      spyOn(nodes[1], 'focus');

      service.focusByCharacter('b', nodes[0]);

      expect(nodes[1].focus).toHaveBeenCalled();
    });

    it('should be case-insensitive', () => {
      buildTree([createNode('Ana'), createNode('Bruno')]);
      const nodes = getNodes();
      spyOn(nodes[1], 'focus');

      service.focusByCharacter('B', nodes[0]);

      expect(nodes[1].focus).toHaveBeenCalled();
    });

    it('should wrap around cyclically', () => {
      buildTree([createNode('Ana'), createNode('Bruno'), createNode('Carlos')]);
      const nodes = getNodes();
      spyOn(nodes[0], 'focus');

      service.focusByCharacter('a', nodes[2]);

      expect(nodes[0].focus).toHaveBeenCalled();
    });

    it('should not focus if no match found', () => {
      buildTree([createNode('Ana'), createNode('Bruno')]);
      const nodes = getNodes();
      spyOn(nodes[0], 'focus');
      spyOn(nodes[1], 'focus');

      service.focusByCharacter('z', nodes[0]);

      expect(nodes[0].focus).not.toHaveBeenCalled();
      expect(nodes[1].focus).not.toHaveBeenCalled();
    });

    it('should skip disabled nodes without subItems', () => {
      buildTree([createNode('Ana'), createNode('André', { disabled: true }), createNode('Antonio')]);
      const nodes = getNodes();
      spyOn(nodes[2], 'focus');

      service.focusByCharacter('a', nodes[0]);

      expect(nodes[2].focus).toHaveBeenCalled();
    });

    it('should do nothing when there are no focusable nodes', () => {
      const detachedNode = document.createElement('div');
      expect(() => service.focusByCharacter('a', detachedNode)).not.toThrow();
    });

    it('should skip nodes with empty label', () => {
      const emptyLabelNode = createNode('');
      buildTree([createNode('Ana'), emptyLabelNode, createNode('Antonio')]);
      const nodes = getNodes();
      spyOn(nodes[2], 'focus');

      service.focusByCharacter('a', nodes[0]);

      expect(nodes[2].focus).toHaveBeenCalled();
    });
  });

  describe('focusLastOrFirst:', () => {
    it('should focus lastFocusedNode if it exists in DOM', () => {
      buildTree([createNode('A'), createNode('B')]);
      const nodes = getNodes();
      spyOn(nodes[1], 'focus');

      service.setLastFocusedNode(nodes[1]);
      service.focusLastOrFirst();

      expect(nodes[1].focus).toHaveBeenCalled();
    });

    it('should focus first if lastFocusedNode is not in DOM', () => {
      buildTree([createNode('A'), createNode('B')]);
      const nodes = getNodes();
      const detachedNode = document.createElement('div');
      spyOn(nodes[0], 'focus');

      service.setLastFocusedNode(detachedNode);
      service.focusLastOrFirst();

      expect(nodes[0].focus).toHaveBeenCalled();
    });

    it('should focus first if no lastFocusedNode set', () => {
      buildTree([createNode('A'), createNode('B')]);
      const nodes = getNodes();
      spyOn(nodes[0], 'focus');

      service.focusLastOrFirst();

      expect(nodes[0].focus).toHaveBeenCalled();
    });
  });

  describe('setLastFocusedNode:', () => {
    it('should store the node', () => {
      const node = document.createElement('div');
      service.setLastFocusedNode(node);
      expect(service['lastFocusedNode']).toBe(node);
    });
  });
});
