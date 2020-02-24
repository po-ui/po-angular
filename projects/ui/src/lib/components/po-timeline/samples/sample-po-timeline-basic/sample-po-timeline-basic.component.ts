import { Component } from "@angular/core";
import { TimeLineCard } from '../../models/timeline-card.model';

@Component({
    selector: 'sample-po-timeline-basic',
    templateUrl: './sample-po-timeline-basic.component.html'
})
export class SamplePoTimelineBasicComponent { 
    
    timelineList: TimeLineCard[]  = [
        {
          title: "Primeiro",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.",
          side: "left",
          icon: "po-icon po-icon-bar-code",
          color: "po-color-secondary"
        },
        {
          title: "Segundo",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.",
          side: "right",
          icon: "po-icon po-icon-book",
          color: "po-color-primary"
        },
        {
          title: "Terceiro",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.",
          side: "left",
          icon: "po-icon po-icon-camera",
          color: "po-color-warning"
        },
        {
          title: "Quarto",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sapien mi, commodo sit amet purus at.",
          side: "right",
          icon: "po-icon po-icon-cart",
          color: "po-color-success"
        }
    ];

    onClickCard(event: TimeLineCard) {
        alert(JSON.stringify(event));
    }
}