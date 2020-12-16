import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/rest-api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title;
  constructor(public apiService: ApiService) {}

  ngOnInit() {}
}
