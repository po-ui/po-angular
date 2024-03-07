import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  lookup;
  onSelect(event) {
    console.log(event, 'onSelect')
  }

  onUnselect (event){
    console.log(event, 'onUnselect')
  }

  onAllSelected(event){
    console.log(event, 'onAllSelected')
  }

  onAllUnselected(event){
    console.log(event, 'onAllUnselected')
  }

  showMoreEvent() {
    console.log("chamou showMoreEvent")
  }


}
