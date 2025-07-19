// Clean up leftover transition elements from previous page loads
function cleanupTransitionElements() {
  const leftovers = document.querySelectorAll(".transition-image, .transition-overlay");
  leftovers.forEach(el => el.remove());
}

document.addEventListener("DOMContentLoaded", () => {
  cleanupTransitionElements();

  const hamburger = document.querySelector('.hamburger-menu');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const sidebar = document.querySelector('.sidebar');

  if (hamburger && sidebar && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      sidebar.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
    });

    mobileOverlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      sidebar.classList.remove('open');
      mobileOverlay.classList.remove('open');
    });
  }

  const introVideo = document.getElementById("introVideo");
  const videoContainer = document.querySelector(".intro_video_container");

  if (introVideo && videoContainer && sidebar) {
    introVideo.addEventListener("ended", () => {
      videoContainer.style.opacity = "0";

      // This makes the sidebar appear after the video
      sidebar.style.opacity = "1";
      sidebar.style.pointerEvents = "auto";

      setTimeout(() => {
        videoContainer.style.display = "none";
      }, 500);
    });
  }

  const capsule = document.querySelector('.hover-capsule');
  const items = sidebar ? sidebar.querySelectorAll('ul li') : [];

  function updateCapsulePosition(element) {
    if (!capsule || !element || !sidebar) return;
    // On mobile/tablet, if the menu is closed, don't update capsule
    if (window.innerWidth <= 1024 && !sidebar.classList.contains('open')) {
        capsule.style.opacity = '0';
        return;
    }
    capsule.style.opacity = '1';

    const sidebarRect = sidebar.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    const top = elemRect.top - sidebarRect.top;
    const left = elemRect.left - sidebarRect.left;
    const width = elemRect.width;
    const height = elemRect.height;
    capsule.style.top = `${top}px`;
    capsule.style.left = `${left}px`;
    capsule.style.width = `${width}px`;
    capsule.style.height = `${height}px`;
  }

  // ✅ This section is updated for touch support
  if (items.length > 0) {
    let activeItem = sidebar.querySelector('ul li.active') || items[0];
    setTimeout(() => updateCapsulePosition(activeItem), 50);
    
    // A single function to handle the logic for setting the active item
    const setActiveItem = (item) => {
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        updateCapsulePosition(item);
    };

    items.forEach(item => {
      // Handles mouse hover on desktop
      item.addEventListener('mouseenter', () => {
        setActiveItem(item);
      });
      // Handles taps on touch devices and clicks on desktop
      item.addEventListener('click', () => {
        setActiveItem(item);
      });
    });

    // When mouse leaves the sidebar, the capsule should stay on the last active item
    sidebar.addEventListener('mouseleave', () => {
      let currentActive = sidebar.querySelector('ul li.active');
      updateCapsulePosition(currentActive);
    });
  }

  // Capsule realignment on resize / orientation
  window.addEventListener("resize", () => {
    const activeItem = sidebar.querySelector("ul li.active");
    updateCapsulePosition(activeItem);
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      const activeItem = sidebar.querySelector("ul li.active");
      updateCapsulePosition(activeItem);
    }, 300);
  });

  const elements = {
    Shree: { el: document.getElementById("Shree"), scale: 400 },
    Dhantha: { el: document.getElementById("Dhantha"), scale: 400 },
    Kalaagruha: { el: document.getElementById("Kalaagruha"), scale: 2500 },
    Eye: { el: document.getElementById("Eye"), scale: 200 }
  };

  function navigateWithTransition(targetURL, originElement, scaleValue) {
    const img = originElement.querySelector("img");
    if (!img) return;

    if (sidebar && sidebar.classList.contains('open')) {
      hamburger.classList.remove('active');
      sidebar.classList.remove('open');
      mobileOverlay.classList.remove('open');
    }

    const sidebarToHide = document.querySelector('.sidebar');
    if (sidebarToHide && window.innerWidth > 1024) {
      sidebarToHide.style.transition = 'none';
      sidebarToHide.style.opacity = '0';
      sidebarToHide.style.pointerEvents = 'none';
      setTimeout(() => {
        sidebarToHide.style.transition = 'opacity 1.5s ease-in-out, transform 0.4s ease-in-out';
      }, 50);
    }

    const rect = img.getBoundingClientRect();

    const overlay = document.createElement("div");
    overlay.classList.add("transition-overlay");
    Object.assign(overlay.style, {
      position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(20px)",
      opacity: "0", zIndex: "9998", transition: "opacity 0.5s ease-in-out",
      pointerEvents: "none"
    });
    document.body.appendChild(overlay);

    const clone = img.cloneNode(true);
    clone.classList.add("transition-image");
    Object.assign(clone.style, {
      position: "fixed", top: `${rect.top}px`, left: `${rect.left}px`,
      width: `${rect.width}px`, height: `${rect.height}px`,
      objectFit: "contain", zIndex: "9999", pointerEvents: "none",
      transition: "all 1.6s ease-in-out", transformOrigin: "center center",
    });
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
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => navigateWithTransition(`/${key}`, el, scale));
    }
  }
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    cleanupTransitionElements();

    const sidebar = document.querySelector('.sidebar');
    const videoContainer = document.querySelector(".intro_video_container");

    if (videoContainer) {
      videoContainer.style.display = 'none';
    }

    if (sidebar && window.innerWidth > 1024) {
      sidebar.style.transition = 'none';
      sidebar.style.opacity = '1';
      sidebar.style.pointerEvents = 'auto';
      setTimeout(() => {
        sidebar.style.transition = 'opacity 1.5s ease-in-out, transform 0.4s ease-in-out';
      }, 50);
    }
  }
});