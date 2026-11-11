import { AnimationCallbackEvent, Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'po-accordion-item-body',
  templateUrl: 'po-accordion-item-body.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class PoAccordionItemBodyComponent {
  @Input('p-expanded') expanded: boolean = false;

  animateEnter(event: AnimationCallbackEvent): void {
    this.animateHeight(event, '0px', `${(event.target as HTMLElement).scrollHeight}px`);
  }

  animateLeave(event: AnimationCallbackEvent): void {
    this.animateHeight(event, `${(event.target as HTMLElement).scrollHeight}px`, '0px');
  }

  private animateHeight(event: AnimationCallbackEvent, from: string, to: string): void {
    const element = event.target as HTMLElement;
    const previousOverflow = element.style.overflow;
    element.style.overflow = 'hidden';

    const animation = element.animate([{ height: from }, { height: to }], {
      duration: 200,
      easing: 'linear'
    });

    animation.onfinish = () => {
      element.style.overflow = previousOverflow;
      event.animationComplete();
    };
  }
}
