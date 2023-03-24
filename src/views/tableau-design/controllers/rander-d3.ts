import { d3RootJsonType } from '../types/type'

type vmType = {
  isShowTargetZone: boolean,
  svgD3Width: number,
  svgD3Height: number,
  selectedD3TableName: string,
  selectedD3TableId: number,
  initTargetZone(): void,
  delZoneDataTable(id: number): void,
  showConnectionDialog(leftTableId: number, rightTableId: number): void
}

function initD3(vm: vmType, d3RootJson: d3RootJsonType) {
  let d3: any = (<any>window).d3;
  // let d3RootJson = this.d3RootJson || {}
  vm.initTargetZone()
  if (!d3RootJson.name) return false
  let width = vm.svgD3Width, height = vm.svgD3Height;
  let boxWidth = 160, boxHeight = 30; // 矩形宽高
  let cluster = d3.layout.tree().size([width, height]);

  let diagonal = d3.svg.diagonal()
    .projection(function (d: any) {
      return [d.y, d.x];
    });

  let svg = d3.select(".content-target-zone").append("svg")
    .attr("width", width + boxWidth)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(20, 0)");
  let marginTop = 19;

  let nodes = cluster.nodes(d3RootJson);
  let links = cluster.links(nodes);
  let link = svg.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonal)
    .attr("style", function () {
      return "stroke: #ccc"
    });
  link.on('click', (e: any) => {
    console.log(e)
    vm.showConnectionDialog(e.source.id, e.target.id)
  })
  link.on('mouseover', function () {
    // @ts-ignore
    this.setAttribute('style', 'stroke-width: 5.5px; stroke: #409eff')
  })
  link.on('mouseout', function () {
    // @ts-ignore
    this.setAttribute('style', 'stroke-width: 1.5px')
  })

  let node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d: any) {
      return "translate(" + (d.y - 15) + "," + (d.x + -10) + ")";
    })
    .on('click', function (e: any) {
      // console.log(e, index)
      if (e.name) vm.selectedD3TableName = e.name || ''
      if (e.id) vm.selectedD3TableId = e.id || ''

      node[0].forEach((item: any) => {
        let rectEl = item.querySelector('rect')
        let textEl = item.querySelector('text')
        rectEl.setAttribute('style', 'fill: #f0f0f0')
        textEl.setAttribute('fill', '#000')
      })
      // @ts-ignore
      let nowRectEl = this.querySelector('rect')
      // @ts-ignore
      let nowTextEl = this.querySelector('text')
      nowRectEl.setAttribute('style', 'fill: #409eff')
      nowTextEl.setAttribute('fill', '#fff')
    })
    .on('dblclick', function (e: any) {
      let id = e.id
      vm.selectedD3TableName = ''
      vm.selectedD3TableId = 0
      // @ts-ignore
      let nowRectEl = this.querySelector('rect')
      // @ts-ignore
      let nowTextEl = this.querySelector('text')
      nowRectEl.setAttribute('style', 'fill: #f0f0f0')
      nowTextEl.setAttribute('fill', '#000')
      vm.delZoneDataTable(id)
      // console.log(id)
    })

  node.append("rect")
    .attr("width", boxWidth)
    .attr("height", boxHeight)
    .attr("x", 0)
    .attr("y", 0)
    .attr("style", "fill: #f0f0f0;");

  node.append("text")
    .attr("dx", function () {
      return 10;
    })
    .attr("dy", marginTop)
    .text(function (d: any) {
      let name = d.name || ''
      if (name.length >= 22) {
        name = name.slice(0, 22) + '...';
      }
      return name;
    });
  
  node.append('title')
    .text((d: any) => d.name)
}

export default initD3