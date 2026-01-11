// widget.js - Floating button injected into all pages
(function () {
  const btn = document.createElement("a");
  btn.href = "https://wa.me/9665XXXXXXXX";      // عدّل الرابط
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.setAttribute("aria-label", "تواصل معنا");

  // Tailwind classes (مثل تصميمك)
  btn.className =
    "fixed left-5 top-20 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-xl " +
    "bg-blue-600 hover:brightness-110 transition";

  // FontAwesome icon
  btn.innerHTML = '<i class="fa-solid fa-comment-dots text-white text-xl" aria-hidden="true"></i>';

  document.body.appendChild(btn);
})();
