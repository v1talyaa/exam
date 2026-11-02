(function () {
  const NS = "http://www.w3.org/2000/svg";
  const fmt = n => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 }).format(n);
  function el(name, attrs = {}) {
    const node = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k, v));
    return node;
  }
  function draw(container, spec) {
    const W = 620, H = 275, pad = {l:46,r:16,t:16,b:34};
    const all = spec.series.flatMap(s => s.values);
    let min = Math.min(...all), max = Math.max(...all);
    const span = Math.max(max-min, 0.001);
    min -= span * .14; max += span * .14;
    const x = i => pad.l + i * ((W-pad.l-pad.r)/(spec.years.length-1));
    const y = v => pad.t + (max-v)/(max-min) * (H-pad.t-pad.b);
    const svg = el("svg", {viewBox:`0 0 ${W} ${H}`, role:"img", "aria-label":"Лінійний графік"});
    for (let i=0;i<5;i++) {
      const yy = pad.t + i*((H-pad.t-pad.b)/4);
      svg.appendChild(el("line", {x1:pad.l,y1:yy,x2:W-pad.r,y2:yy,class:"grid-line"}));
      const val = max - i*((max-min)/4);
      const t = el("text", {x:pad.l-8,y:yy+4,"text-anchor":"end",class:"axis-text"});
      t.textContent=fmt(val); svg.appendChild(t);
    }
    const tickStep = spec.years.length > 8 ? 2 : 1;
    spec.years.forEach((yr,i)=>{
      if (i%tickStep===0 || i===spec.years.length-1) {
        const t=el("text", {x:x(i),y:H-10,"text-anchor":"middle",class:"axis-text"});
        t.textContent=yr; svg.appendChild(t);
      }
    });
    spec.series.forEach(series=>{
      const points = series.values.map((v,i)=>`${x(i)},${y(v)}`).join(" ");
      svg.appendChild(el("polyline", {points,class:"line",stroke:series.color}));
      series.values.forEach((v,i)=>{
        const c=el("circle", {cx:x(i),cy:y(v),r:4,class:"point",fill:series.color});
        const title=el("title"); title.textContent=`${spec.years[i]}: ${fmt(v)}${spec.suffix || ""}`; c.appendChild(title); svg.appendChild(c);
      });
    });
    container.appendChild(svg);
    const legend=document.createElement("div"); legend.className="chart-legend";
    spec.series.forEach(s=>{
      const item=document.createElement("span"); item.className="legend-item";
      item.innerHTML=`<span class="legend-dot" style="background:${s.color}"></span>${s.name}`;
      legend.appendChild(item);
    });
    container.appendChild(legend);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll("[data-chart]").forEach(node=>{
      const key=node.dataset.chart;
      if (window.CHINA_DATA?.charts?.[key]) draw(node, window.CHINA_DATA.charts[key]);
    });
  });
})();
