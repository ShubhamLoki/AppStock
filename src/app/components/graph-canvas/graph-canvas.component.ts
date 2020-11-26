import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-graph-canvas',
  templateUrl: './graph-canvas.component.html',
  styleUrls: ['./graph-canvas.component.scss'],
})
export class GraphCanvasComponent implements OnInit {
  @Input() chartType = 'line';
  @Input() chartReady = true;
  @Input() datasets: Array<any> = [];
  @Input() labels: Array<any> = [];
  @Input() width = 100;

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
  ];
  public chartOptions: any = {
    responsive: true,
  };

  constructor() {}

  ngOnInit(): void {}

  public chartClicked(e: any): void {}
  public chartHovered(e: any): void {}
}
