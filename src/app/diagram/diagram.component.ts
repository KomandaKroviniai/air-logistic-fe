import {Component, OnInit} from '@angular/core';
// @ts-ignore
import * as d3 from 'd3';
import {DiagramService} from "../services/diagram.service";


@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {
  data: any[] = [];

  constructor(private diagramService: DiagramService) { }

  ngOnInit(): void {
    this.diagramService.loadData().subscribe(routesData => {
      this.data = [
        {label: routesData[0].status, value: routesData[0].statusCount},
        {label: routesData[1].status, value: routesData[1].statusCount},
        {label: routesData[2].status, value: routesData[2].statusCount}
      ];
      console.log(this.data);
      this.initializeDiagram(this.data);
    })
  }

  initializeDiagram(data: any[]) {
    const svg = d3.select('svg');

    const x = d3
      .scaleBand()
      .range([0, 400])
      .domain(data.map(d => d.label))
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .range([200, 0])
      .domain([0, d3.max(data, (d: { value: any; }) => d.value)]);

    svg.append('g')
      .attr('transform', 'translate(0,200)')
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(this.data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d: { label: any; }) => x(d.label))
      .attr('y', (d: { value: any; }) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d: { value: any; }) => 200 - y(d.value));

    this.addLabels(data, x);
  }

  addLabels(data: any[], x: any) {
    const svg = d3.select('svg');

    svg.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', (d: { label: any; }) => x(d.label) + x.bandwidth() / 2)
      .attr('y', 200)
      .attr('dy', '-0.5em')
      .style('fill', 'white')
      .text((d: { value: any; }) => d.value);
  }

}
