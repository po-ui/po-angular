import { Injectable } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

@Injectable()
export class SamplePoTableTransportService {
  getColumns(): Array<PoTableColumn> {
    return [
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
          { value: 'delivered', color: 'color-11', label: 'Delivered' },
          { value: 'transport', color: 'color-08', label: 'Transport' },
          { value: 'production', color: 'color-01', label: 'Production' }
        ]
      }
    ];
  }

  getItems(): Array<any> {
    return [
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
      }
    ];
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
}
