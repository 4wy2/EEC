/* =========================
   Faculty Search (faculty.html)
   Depends on: facultyData (assets/js/faculty-data.js)
========================= */

(function(){
  if (typeof facultyData === "undefined") return;

  // تنظيف: حذف phone + jobTitle (مع إبقاء rank)
  const cleanedData = facultyData.map(({ phone, jobTitle, ...rest }) => rest);

  // Helpers
  const norm = (s) => (s ?? "").toString().trim().toLowerCase();
  const cleanEmail = (e) => (e ?? "").toString().trim().replace(/;+/g, "").toLowerCase();
  const displayNA = (v) => {
    const x = (v ?? "").toString().trim();
    if (!x || x.toLowerCase() === "na") return "NA";
    return x;
  };

  // DOM
  const qEl = document.getElementById("q");
  const rowsEl = document.getElementById("rows");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("count");
  const clearBtn = document.getElementById("clear");
  const toastEl = document.getElementById("toast");

  if (!qEl || !rowsEl || !totalEl || !countEl || !clearBtn || !toastEl) return;

  totalEl.textContent = cleanedData.length;

  let toastTimer = null;
  function showToast(msg = "تم النسخ"){
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1200);
  }

  async function copyText(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch(e){
      // fallback for older browsers / non-HTTPS
      try{
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      }catch(_){
        return false;
      }
    }
  }

  function render(list){
    countEl.textContent = list.length;
    rowsEl.innerHTML = "";

    if (!list.length){
      rowsEl.innerHTML = `
        <tr>
          <td colspan="3" class="px-4 py-4 text-sm text-white/60 text-right">لا توجد نتائج مطابقة.</td>
        </tr>`;
      return;
    }

    for (const p of list){
      const email = cleanEmail(p.email);
      const hasEmail = email && email !== "na";

      const emailCell = hasEmail
        ? `<button type="button" class="copy-email font-extrabold text-cyan-200 hover:text-cyan-100 underline-offset-4 hover:underline" data-email="${email}" title="اضغط لنسخ البريد">${email}</button>`
        : `<span class="text-white/55">NA</span>`;

      const tr = document.createElement("tr");
      tr.className = "hover:bg-white/[0.03] transition";
      tr.innerHTML = `
        <td class="px-4 py-4 text-sm text-right">
          <span class="inline-flex items-center gap-2">
            <span class="chip px-3 py-1 rounded-full text-[11px] font-black text-white/75">${displayNA(p.rank)}</span>
            <span class="font-extrabold text-white/90">${displayNA(p.name)}</span>
          </span>
        </td>
        <td class="px-4 py-4 text-sm text-right text-white/80">${displayNA(p.office)}</td>
        <td class="px-4 py-4 text-sm text-right">${emailCell}</td>
      `;
      rowsEl.appendChild(tr);
    }
  }

  function applyFilter(){
    const q = norm(qEl.value);
    const filtered = cleanedData.filter(p => !q || norm(p.name).includes(q));
    render(filtered);
  }

  // Event delegation for copy
  rowsEl.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-email");
    if (!btn) return;

    const email = (btn.dataset.email || "").trim();
    if (!email) return;

    const ok = await copyText(email);
    showToast(ok ? "تم النسخ" : "تعذر النسخ");
  });

  qEl.addEventListener("input", applyFilter);

  clearBtn.addEventListener("click", () => {
    qEl.value = "";
    applyFilter();
    qEl.focus();
  });

  // Initial render
  applyFilter();
})();
