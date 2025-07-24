document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("introVideo");
  const container = document.querySelector(".intro_video_container");
  const logoWrapper = document.querySelector(".logo_wrapper");

  // Create and append the gradient wipe overlay
  const overlay = document.createElement("div");
  overlay.classList.add("fade_wipe_overlay");
  container.appendChild(overlay);

  video.addEventListener("ended", () => {
    // Begin wipe and video fade
    overlay.classList.add("play-wipe");
    video.classList.add("fade-out-video");

    // Delay logo reveal for more cinematic feel
    setTimeout(() => {
      logoWrapper.classList.add("reveal");
    }, 1000); // starts 1s after video ends

    // Remove the video overlay completely after all animations
    setTimeout(() => {
      container.remove();
    }, 2000); // matches video fade/wipe duration
  });
});
