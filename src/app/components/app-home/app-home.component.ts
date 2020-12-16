import { CommonService } from './../../services/common.service';
import { ApiService } from 'src/app/services/rest-api/api.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss'],
})
export class AppHomeComponent implements OnInit {
  HAH = 'HAH';
  DH = 'DH';
  PBH = 'PBH';
  OCH = 'OCH';
  activeModule = this.OCH; // Option Chain Tab
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.activeModule);
  }

  openModule(name): void {
    this.activeModule = name;
    this.titleService.setTitle(name);
  }
}
