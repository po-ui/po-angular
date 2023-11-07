import { Component, OnInit } from '@angular/core';
import { SamplePoSearchFindPeopleService } from './sample-po-search-find-people.service';

@Component({
  selector: 'sample-po-search-find-people',
  templateUrl: './sample-po-search-find-people.component.html',
  styles: [
    `
      li {
        list-style: none;
        display: flex;
        align-itens: center;
      }
    `,
    `
      li div {
        width: 0.75em;
        height: 0.75em;
        border-radius: 50%;
        background-color: green;
        margin-left: 10px;
      }
    `
  ],
  providers: [SamplePoSearchFindPeopleService]
})
export class SamplePoSearchFindPeopleComponent implements OnInit {
  items: any;
  filterKeys: Array<string> = ['name', 'nickname', 'email'];
  peopleFiltered: Array<any> = [];

  constructor(private service: SamplePoSearchFindPeopleService) {}

  ngOnInit() {
    this.items = this.service.getItems();
  }

  filtered(event: Array<any>) {
    this.peopleFiltered = event;
    if (event.length === 4) {
      this.peopleFiltered = [];
    } else {
      try {
      } catch (error) {
        return undefined;
      }
    }
  }

  compareObjects(value: any) {
    return this.peopleFiltered.includes(value) ? true : false;
  }
}
