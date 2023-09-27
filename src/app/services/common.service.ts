import { EXPIRT_DATES } from './../constants/common.constants';
import { Injectable } from '@angular/core';
import { from, interval, Observable, of, Subject } from 'rxjs';
import { map, multicast } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  public static truncNumber(inNumber): number {
    return Math.trunc(inNumber * 100) / 100;
  }

  public observerCheck(): void {
    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(10000);

    // Subscribe to begin publishing values
    secondsCounter.subscribe((n) =>
      console.log(`It's been ${n}0 seconds since subscribing!`)
    );
  }

  public mapObj(): void {
    const nums = of(1, 2, 3);

    const squareValues = map((val: number) => val * val);
    const squaredNums = squareValues(nums);

    squaredNums.subscribe((x) => console.log(x));
  }

  public subjectObservable(): void {
    let a = 2437;
    let b = 857;

    let x = a;
    let y = b;

    while (x != y) {
      if (x > y) {
        x = x - y;
      } else if (x < y) {
        y = y - x;
      }
    }
    console.log(x);

    // const subject = new Subject<number>();

    // subject.subscribe((value) => console.log(`Observer 1 : ${value}`));
    // subject.subscribe((value) => console.log(`Observer 2 : ${value}`));

    // // subject.next(1);
    // // subject.next(2);

    // const newObser = from([1, 2, 3]);

    // newObser.subscribe(subject); // With the approach, we essentially just converted a unicast Observable execution to multicast
  }

  public multicastOperatorRx() {
    // const ObInterval = interval(1000);

    // const source = ObInterval.

    // const source = from('Shubham');

    // const subject = new Subject();

    // const multicasted = source.pipe(multicast(subject));

    // multicasted.subscribe();
    // multicasted.subscribe();

    // multicasted.p();
    // source.next();

    const input =
      'milkshakepizzachickenfriescokeburgerpizzasandwichmilkshakepizza';
    const menuArray = [
      'Burger',
      'Fries',
      'Chicken',
      'Pizza',
      'Sandwich',
      'Onionrings',
      'Milkshake',
      'Cake',
    ];
    const orderArray = [];
    menuArray.forEach((menu) => {
      const res = input.split(menu.toLowerCase());
      console.log(res);
      for (let ind = 0; ind < res.length - 1; ind++) {
        orderArray.push(menu);
      }
    });
    console.log(orderArray.join(' '));
  }

  // calculateCount(menu: string, input: string) {
  // }

  /**
   * getExpiryDate
   */
  public getExpiryDate(): string {
    let expDate = '';
    EXPIRT_DATES.forEach((date: string) => {
      const currDate = new Date(date);
      const today = new Date();
      console.log(currDate, today);
      console.log(date);
      if (expDate === '' && currDate >= today) {
        expDate = date;
      }
    });
    console.log(expDate);
    return expDate;
  }

  public setOptionInSession(value) {
    sessionStorage.setItem('optionListNifty', JSON.stringify(value));
  }

  public getOptionFromSession() {
    const optionMap = sessionStorage.getItem('optionListNifty');
    let arr = [];
    console.log(optionMap);
    if (optionMap) arr = Object.entries(optionMap);
    return new Map<string, any>(arr);
  }
}

// SELECT topt.strike_price as strike_price,
// topt.option_str as option_str,
// max(topt.changein_open_interest) as changein_open_interest
// FROM tbl_option topt where
// topt.creation_date_time >= (select DATE_FORMAT(max(tofin.creation_date_time), '%Y-%m-%d') from tbl_option_feed tofin)
// AND topt.underlying = ?1
// GROUP BY topt.strike_price, topt.option_str ;
