import { NIFTY, BANKNIFTY } from './../../constants/common.constants';
import { CommonService } from './../../services/common.service';
import { ApiService } from 'src/app/services/rest-api/api.service';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
})
export class AppHomeComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {
  HAH = 'HAH';
  DH = 'DH';
  PBH = 'PBH';
  NOCH = 'NOCH';
  BNOCH = 'BNOCH';
  BOS = 'BOS';
  NIFTY = NIFTY;
  BANKNIFTY = BANKNIFTY;
  activeModule = this.NOCH; // Option Chain Tab
  public name = 'Shubham';
  version = '2.9';
  constructor(private titleService: Title) {}

  // LIFT CYCLE HOOKS
  ngOnChanges() {
    // console.log('1. OnChanges - Hook Called.');
  }

  ngOnInit(): void {
    // console.log('2. OnInit - Hook Called.');
    this.titleService.setTitle(this.activeModule);

    const arr = [2, 13, 10, 5, 4];
    const n = 19;
    this.findDemo(arr, n);
  }

  ngDoCheck() {
    // console.log('3. DoCheck - Hook Called after OnInit and on every change.');
  }

  ngAfterContentInit() {
    // console.log('4. AfterContentInit - Hook Called once after DoCheck.');
  }

  ngAfterContentChecked() {
    // console.log(
    //   '5. AfterContentChecked - Hook Called after AfterContentInit and on every DoCheck.'
    // );
  }

  ngAfterViewInit() {
    // console.log(
    //   '6. AfterViewInit - Hook Called once after AfterContentChecked.'
    // );
  }

  ngAfterViewChecked() {
    // console.log(
    //   '7. AfterViewChecked - Hook Called after AfterViewInit and on every AfterContentChecked.'
    // );
  }

  ngOnDestroy() {
    // console.log('8. OnDestroy - Hook Called once after AfterContentChecked.');
  }

  findDemo(arr: number[], n) {
    // arr.sort(function (a, b) {
    //   return a - b;
    // });
    // console.log(arr);
    let sum = 0;
    let mul = 1;
    let newArrayNums = [];
    let newArrayMul = [];
    let newArr = [];
    let maxMul = 0;

    for (let i = 0; i < arr.length - 2; i++) {
      for (let j = i + 0; j < arr.length - 1; j++) {
        for (let k = j + 0; k < arr.length; k++) {
          if (i != j && i != k && j != k) {
            sum = arr[i] + arr[j] + arr[k];
            mul = arr[i] * arr[j] * arr[k];
            if (sum == n) {
              maxMul = Math.max(maxMul, mul);
              if (maxMul == mul) {
                newArrayNums = [];
                newArrayNums.push(arr[i]);
                newArrayNums.push(arr[j]);
                newArrayNums.push(arr[k]);
              }
              // console.log(arr[i], arr[j], arr[k], sum, mul);
              // console.log(newArrayNums);
            }
          }
        }
      }
    }

    newArrayNums.sort(function (a, b) {
      return a - b;
    });
    return newArrayNums;
  }

  openModule(name): void {
    this.activeModule = name;
    this.titleService.setTitle(name);
  }
}
