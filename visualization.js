import define1 from "./Navio.js";

function _1(md){return(
md`md\`# D3 Network Visualization\``
)}

function _selectedPapers(navio,papers){return(
navio(papers)
)}

function _3(network,d3,width,height,opacity,size,color,forceBoundary,drag,invalidation)
{
  const nodes = network.nodes.map(d => ({...d})),
    links = network.links.map(l => ({
      source: l.source.id, 
      target: l.target.id, 
      value: l.value
    }));
  

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  const lines = svg
    .selectAll("line")
    .data(links)
    .join("line")
    .style("stroke", "#333")
    .attr("stroke-opacity", l => opacity(l.value));
  
  const text = svg
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("fill", "#333")
    .style("font-size", d => size(d.value) + "pt ")
    .style("fill", d => color(d.cluster))
    .text(d => d.id);

  const ticked = () => {
    lines
      .attr("x1", l => l.source.x)
      .attr("y1", l => l.source.y)
      .attr("x2", l => l.target.x)
      .attr("y2", l => l.target.y);
    
    text.attr("x", d => d.x).attr("y", d => d.y);
  };
  
  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("boundary", forceBoundary(3, 3, width, height))
    .on("tick", ticked);
  
  text.call(drag(simulation));
  invalidation.then(()=> simulation.stop());
  
  return svg.node();
}


function _drag(d3){return(
simulation => {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
)}

function _color(d3){return(
d3.scaleOrdinal(d3.schemeCategory10)
)}

function _opacity(d3,network){return(
d3
  .scaleLinear()
  .domain(d3.extent(network.links, d => d.value))
  .range([0.1, 1])
)}

function _size(d3,network){return(
d3
  .scaleLinear()
  .domain(d3.extent(network.nodes, d => d.value))
  .range([10, 24])
)}

function _8(opacity,network){return(
opacity(network.links[4].value)
)}

function _9(opacity){return(
opacity.domain()
)}

function _height(){return(
500
)}

function _network(papers,getKey,findOrAdd,netClustering)
{
  const dLinks = new Map();
  const jeffreyHeerPapers = papers.filter(paper => 
    paper.AuthorNames.toLowerCase().includes('jeffrey heer')
  );
  console.log(jeffreyHeerPapers)
  for (let paper of jeffreyHeerPapers) {
    let authornames = paper.AuthorNames.split(";")
    for (let i = 0; i < authornames.length; i++) {
      for (let j = i + 1; j < authornames.length; j++) {
        const key = getKey(
          authornames[i],
          authornames[j]
        );
        if (!dLinks.has(key)) dLinks.set(key, 0);

        dLinks.set(key, dLinks.get(key) + 1);
      }
    }
  }

  const dNodes = new Map();
  let links = [];
  for (let [l, v] of dLinks) {
    //if (v < minLinkValue) continue;
    
    const [source, target] = l.split("~");

    const s = findOrAdd(dNodes, source);
    const t = findOrAdd(dNodes, target);

    dNodes.set(source, ((s.value += 1), s));
    dNodes.set(target, ((t.value += 1), t));    
    links.push({ source: s, target: t, value: v });
  }

  const network = { nodes: Array.from(dNodes.values()), links };
  netClustering.cluster(network.nodes, network.links);
  // return dNodes;
  return network;
}


function _style(html){return(
html`<style>svg text { font-family: sons-serif; text-anchor: middle; cursor: pointer } `
)}

function _findOrAdd(){return(
(dNodes, n) => {
  if (!dNodes.has(n)) dNodes.set(n, { id: n, value: 0 });
  return dNodes.get(n);
}
)}

function _getKey(){return(
(a, b) => (a >= b ? `${a}~${b}` : `${b}~${a}`)
)}

function _papers(FileAttachment){return(
FileAttachment("IEEE VIS papers 1990-2023 - Main dataset.json").json()
)}

function _d3(require){return(
require("d3@6")
)}

function _forceBoundary(require){return(
require("d3-force-boundary")
)}

function _netClustering(require){return(
require("netclustering")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["IEEE VIS papers 1990-2023 - Main dataset.json", {url: new URL("./files\IEEE VIS dataset.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof selectedPapers")).define("viewof selectedPapers", ["navio","papers"], _selectedPapers);
  main.variable(observer("selectedPapers")).define("selectedPapers", ["Generators", "viewof selectedPapers"], (G, _) => G.input(_));
  main.variable(observer()).define(["network","d3","width","height","opacity","size","color","forceBoundary","drag","invalidation"], _3);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("opacity")).define("opacity", ["d3","network"], _opacity);
  main.variable(observer("size")).define("size", ["d3","network"], _size);
  main.variable(observer()).define(["opacity","network"], _8);
  main.variable(observer()).define(["opacity"], _9);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("network")).define("network", ["papers","getKey","findOrAdd","netClustering"], _network);
  main.variable(observer("style")).define("style", ["html"], _style);
  main.variable(observer("findOrAdd")).define("findOrAdd", _findOrAdd);
  main.variable(observer("getKey")).define("getKey", _getKey);
  main.variable(observer("papers")).define("papers", ["FileAttachment"], _papers);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("navio", child1);
  main.variable(observer("forceBoundary")).define("forceBoundary", ["require"], _forceBoundary);
  main.variable(observer("netClustering")).define("netClustering", ["require"], _netClustering);
  return main;
}
