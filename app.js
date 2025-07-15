function cleanupTransitionElements() {
  const leftovers = document.querySelectorAll(".transition-image, .transition-overlay");
  leftovers.forEach(el => el.remove());
}

document.addEventListener("DOMContentLoaded", () => {
  cleanupTransitionElements();

  const elements = {
    Shree: { el: document.getElementById("Shree"), scale: 100 },
    Dhantha: { el: document.getElementById("Dhantha"), scale: 200 },
    kalaagraha: { el: document.getElementById("kalaagraha"), scale: 900 },
    Eye: { el: document.getElementById("Eye"), scale: 200 }
  };

  function navigateWithTransition(targetURL, originElement, scaleValue) {
    const img = originElement.querySelector("img");
    const rect = img.getBoundingClientRect();

    const overlay = document.createElement("div");
    overlay.classList.add("transition-overlay");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    overlay.style.backdropFilter = "blur(20px)";
    overlay.style.opacity = "0";
    overlay.style.zIndex = "9998";
    overlay.style.transition = "opacity 0.5s ease-in-out";
    document.body.appendChild(overlay);

    const clone = img.cloneNode(true);
    clone.classList.add("transition-image");
    clone.style.position = "fixed";
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.objectFit = "contain";
    clone.style.zIndex = "9999";
    clone.style.pointerEvents = "none";
    clone.style.transition = "all 1.6s ease-in-out";

    document.body.appendChild(clone);

    void overlay.offsetWidth;
    void clone.offsetWidth;

    overlay.style.opacity = "1";

    clone.style.top = "50%";
    clone.style.left = "50%";
    clone.style.transform = `translate(-50%, -50%) scale(${scaleValue})`;

    setTimeout(() => {
      clone.style.opacity = "0";
      overlay.style.opacity = "0";
      window.location.href = targetURL;
    }, 900);
  }

  for (const [key, { el, scale }] of Object.entries(elements)) {
    el.addEventListener("click", () => navigateWithTransition(`/${key}`, el, scale));
  }
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    cleanupTransitionElements();
  }
});