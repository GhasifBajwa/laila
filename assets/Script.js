document.addEventListener("DOMContentLoaded", function () {
  const imgContainer = document.getElementById("imgContainer");
  const hero = document.querySelector(".hero");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll(".nav-center a");
  const navIcons = document.querySelectorAll(".nav-icons i");
  const leftText = document.querySelector(".text-left");
  const rightText = document.querySelector(".text-right");

  if (!imgContainer || !hero || !nav) return;

  let cumulativeDelta = 0;
  const maxDelta = 1000;
  const minScale = 1;
  const maxScale = 1.7;
  let zoomComplete = false;

  const blackIcons = window.themeIcons?.black || [];
  const whiteIcons = window.themeIcons?.white || [];

  function applyZoom() {
    let scale = minScale + (maxScale - minScale) * (cumulativeDelta / maxDelta);
    scale = Math.min(Math.max(scale, minScale), maxScale);
    imgContainer.style.transform = `scale(${scale})`;

    const progress = Math.min(Math.max(cumulativeDelta / maxDelta, 0), 1);
    if (leftText && rightText) {
      leftText.style.transform = `translateX(-${(1 - progress) * 100}%)`;
      rightText.style.transform = `translateX(${(1 - progress) * 100}%)`;
      leftText.style.opacity = progress;
      rightText.style.opacity = progress;
    }

    if (scale >= maxScale) {
      if (!zoomComplete) {
        zoomComplete = true;
        hero.style.position = "relative";
        document.body.style.overflow = "auto";
        updateNavColors();
      }
    } else if (scale <= minScale) {
      if (zoomComplete) {
        zoomComplete = false;
        hero.style.position = "fixed";
        document.body.style.overflow = "hidden";
        window.scrollTo(0, 0);
        updateNavColors();
      }
    }
  }

  function updateNavColors() {
    const heroRect = imgContainer.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const overlap = heroRect.bottom > navRect.top + navRect.height * 0.0001;

    const iconImages = document.querySelectorAll(".nav-icons img");
    const navLinks = document.querySelectorAll(".nav-center a");

    if (overlap && zoomComplete) {
      iconImages.forEach((img, index) => {
        if (whiteIcons[index]) img.src = whiteIcons[index];
      });
      navLinks.forEach((link) => {
        link.style.color = "#fff";
      });
    } else {
      iconImages.forEach((img, index) => {
        if (blackIcons[index]) img.src = blackIcons[index];
      });
      navLinks.forEach((link) => {
        link.style.color = "#000";
      });
    }
  }

  window.addEventListener(
    "wheel",
    (e) => {
      const delta = e.deltaY;
      const scrollingUp = delta < 0;
      const atTop = window.scrollY === 0;

      if (!zoomComplete || (zoomComplete && atTop && scrollingUp)) {
        e.preventDefault();
        cumulativeDelta += delta;
        cumulativeDelta = Math.min(Math.max(cumulativeDelta, 0), maxDelta);
        applyZoom();
      }
    },
    { passive: false }
  );

  window.addEventListener("scroll", updateNavColors);

  applyZoom();
  updateNavColors();

  // First Scroll Section
  const header = document.querySelector(".collection-header");
  const imageContainer = document.querySelector(".single-image-container");
  if (header && imageContainer) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      const triggerPoint = imageContainer.offsetTop - window.innerHeight / 2;
      if (scrollPosition > triggerPoint) {
        header.classList.add("active");
      } else {
        header.classList.remove("active");
      }
    });
  }

  // Second Scroll Section
  const extImage = document.querySelector(".extarnal-image img");
  const extSection = document.querySelector(".extarnal-section");
  if (extImage && extSection) {
    window.addEventListener("scroll", () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const sectionTop = extSection.offsetTop;
      const sectionHeight = extSection.offsetHeight;
      const scrollPosition = scrollTop - sectionTop;
      if (scrollPosition >= 0 && scrollPosition <= sectionHeight) {
        extImage.style.transform = `translateY(-${scrollPosition * 0.5}px)`;
      }
    });
  }
});
