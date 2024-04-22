import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'egyCurrency',
  standalone: true
})
export class EgyCurrencyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return 'Egp '+value+ '.00' ;
  }

}
