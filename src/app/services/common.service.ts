import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  public static truncNumber(inNumber): number {
    return Math.trunc(inNumber * 100) / 100;
  }
}
