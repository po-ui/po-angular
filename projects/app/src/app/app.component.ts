import { Component, OnInit } from '@angular/core';
import { PoI18nService, PoLanguage } from '../../../ui/src/lib';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  columnsTableShowMore = [{ property: 'id' }, { property: 'name' }];

  constructor(private poI18nService: PoI18nService) {
    this.changeLanguage({ language: 'en' });
  }

  ngOnInit() {
    // this.makeItem();
  }

  items = [
    {
      code: 1200,
      product: 'Rice',
      customer: 'Angeloni',
      quantity: 3,
      icms: 1500,
      exit_forecast: this.generateRandomDate(),
      time_since_purchase: this.generateRandomTime(),
      status: 'delivered',
      license_plate: 'MDJD9191',
      batch_product: 18041822,
      driver: 'José Oliveira'
    },
    {
      code: 1355,
      product: 'Margarine',
      customer: 'Giassi',
      quantity: 1,
      icms: 50,
      exit_forecast: this.generateRandomDate(),
      time_since_purchase: this.generateRandomTime(),
      status: 'transport',
      license_plate: 'XXA5454',
      batch_product: 18041821,
      driver: 'Francisco Pereira'
    },
    {
      code: 1496,
      product: 'Wheat flour',
      customer: 'Walmart',
      quantity: 5,
      icms: 2045,
      exit_forecast: this.generateRandomDate(),
      time_since_purchase: this.generateRandomTime(),
      status: 'transport',
      license_plate: 'QEW5779',
      batch_product: 18041820,
      driver: 'Pedro da Costa'
    },
    {
      code: 1712,
      product: 'Milk',
      customer: 'Carrefour',
      quantity: 10,
      icms: 15005,
      exit_forecast: this.generateRandomDate(),
      time_since_purchase: this.generateRandomTime(),
      status: 'production',
      license_plate: 'WWW1247',
      batch_product: 18041819,
      driver: 'João da Silva'
    },
    {
      code: 1881,
      product: 'Oil',
      customer: 'Carrefour',
      quantity: 1,
      icms: 1110,
      exit_forecast: this.generateRandomDate(),
      time_since_purchase: this.generateRandomTime(),
      status: 'production',
      license_plate: 'XXI2312',
      batch_product: 18041825,
      driver: 'Antonio Lima'
    },
    {
      code: 1551,
      product: 'Cream cheese',
      customer: 'Barbosa',
      quantity: 15,
      icms: 1119,
      exit_forecast: this.generateRandomDate(),
      time_since_purchase: this.generateRandomTime(),
      status: 'stock',
      license_plate: 'XXI2359',
      batch_product: 18041888,
      driver: 'Vitoria Felix'
    }
  ];

  columns = [
    { property: 'code', type: 'number', width: '8%' },
    { property: 'product' },
    { property: 'customer' },
    { property: 'exit_forecast', label: 'Exit forecast', type: 'dateTime' },
    { property: 'time_since_purchase', label: 'Time since purchase', type: 'time', visible: false },
    { property: 'quantity', label: 'Quantity (Tons)', type: 'number', width: '15%', visible: false },
    { property: 'icms', label: 'ICMS', type: 'number', format: '1.2-5', visible: false },
    {
      property: 'status',
      type: 'label',
      width: '8%',
      labels: [
        { value: 'delivered', color: 'blue', label: 'Delivered' },
        { value: 'transport', label: 'Transport' },
        { value: 'production', color: ' #745678', label: 'Production' },
        { value: 'stock', color: 'rgb(201, 53, 125)', label: 'Stock', icon: 'po-icon-stock' }
      ]
    }
  ];

  dataSource = [
    { id: 1, name: 'Angular', price: '45.00' },
    { id: 2, name: 'React Js', price: '30.00' },
    { id: 3, name: 'Vue Js', price: '20.00' }
  ];

  columns2 = ['name', 'age', 'email'];
  rows2 = [
    { name: 'John Doe', age: 30, email: 'john.doe@example.com' },
    { name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
    { name: 'Bob Johnson', age: 40, email: 'bob.johnson@example.com' }
  ];

  timePeriods = ['AAAAAAAA', 'XXXXXXXXX', 'ZZZZZZZZZ'];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  changeLanguage(lang: PoLanguage) {
    // this.poI18nService.setLanguage(lang.language,false);
    // console.log(lang.language); //en
    // console.log(localStorage.getItem("PO_DEFAULT_LANGUAGE")); //en
    // console.log(this.poI18nService.getLanguage()); //undefined
  }

  teste() {
    console.log(this.poI18nService.getLanguage());
  }

  itemsdois = [
    { value: 'I can be dragged', disabled: false },
    { value: 'I cannot be dragged', disabled: true },
    { value: 'I can also be dragged', disabled: false }
  ];

  dropdois(event: CdkDragDrop<string[]>) {
    console.log(this.itemsdois[event.previousIndex]);
    console.log(this.itemsdois[event.currentIndex]);
    if (!this.itemsdois[event.currentIndex].disabled) {
      moveItemInArray(this.itemsdois, event.previousIndex, event.currentIndex);
    } else {
      const targetIndex = event.previousIndex < event.currentIndex ? event.previousIndex : event.previousIndex - 1;
      moveItemInArray(this.itemsdois, event.previousIndex, targetIndex);
    }
  }

  private generateRandomDate() {
    const hour = Math.floor(Math.random() * 20);
    const minutes = Math.floor(Math.random() * 59);
    const seconds = Math.floor(Math.random() * 59);

    return new Date(2018, 10, 23, hour, minutes, seconds);
  }

  private generateRandomTime() {
    const minutes = Math.floor(Math.random() * 59);
    const seconds = Math.floor(Math.random() * 59);

    const minutesValid = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
    const secondsValid = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

    return `00:${minutesValid}:${secondsValid}`;
  }

  itensdoisMil: any[] = [{ table: `PO Table`, angular: `PO-UI ` }];
  makeItem() {
    const x = [...this.itensdoisMil];
    for (let i = 0; i < 20000; i++) {
      x.push([{ table: `PO Table`, angular: `PO-UI` }]);
    }

    this.itensdoisMil = [...x];
  }

  exportToPdf() {}

  public jspdf(): void {
    let DATA: any = document.getElementById('teste-table');
    console.log(DATA);
    html2canvas(DATA).then(canvas => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jspdf('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });
  }
}
