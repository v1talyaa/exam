document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  if (window.CHINA_DATA) {
    const grid = document.getElementById("kpi-grid");
    if (grid) {
      grid.innerHTML = window.CHINA_DATA.kpis.map(k => `
        <article class="card kpi">
          <div>
            <span class="card-kicker">${k.label}</span>
            <div class="kpi-value">${k.value}</div>
            <div class="kpi-label">Орієнтир: ${k.threshold}</div>
          </div>
          <div>
            <span class="status ${k.className}">${k.status}</span>
            <div class="kpi-label" style="margin-top:.55rem">${k.trend}</div>
          </div>
        </article>`).join("");
    }
    const table = document.getElementById("summary-table");
    if (table) {
      table.innerHTML = window.CHINA_DATA.summary.map(r => `<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("");
    }
  }
});
