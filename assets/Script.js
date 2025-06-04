const imgContainer = document.getElementById("imgContainer");
const hero = document.querySelector(".hero");
const nav = document.querySelector("nav");
const navLinks = document.querySelectorAll(".nav-center a");
const navIcons = document.querySelectorAll(".nav-icons i");
const leftText = document.querySelector(".text-left");
const rightText = document.querySelector(".text-right");

let cumulativeDelta = 0;
const maxDelta = 1000;
const minScale = 1;
const maxScale = 1.7;
let zoomComplete = false;

// Apply zoom and update navbar
function applyZoom() {
  let scale = minScale + (maxScale - minScale) * (cumulativeDelta / maxDelta);
  scale = Math.min(Math.max(scale, minScale), maxScale);
  imgContainer.style.transform = `scale(${scale})`;

  const progress = Math.min(Math.max(cumulativeDelta / maxDelta, 0), 1);
  leftText.style.transform = `translateX(-${(1 - progress) * 100}%)`;
  rightText.style.transform = `translateX(${(1 - progress) * 100}%)`;
  leftText.style.opacity = progress;
  rightText.style.opacity = progress;

  if (scale >= maxScale) {
    if (!zoomComplete) {
      zoomComplete = true;
      hero.style.position = "relative";
      document.body.style.overflow = "auto";
      updateNavColors(); // Ensure nav color is updated immediately
    }
  } else if (scale <= minScale) {
    if (zoomComplete) {
      zoomComplete = false;
      hero.style.position = "fixed";
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      updateNavColors(); // Reset nav color immediately on reverse
    }
  }
}

// Update navbar link/icon colors\
const blackIcons = [
  "Media/blacksearch.png",
  "Media/blackuser.png",
  "Media/blackheart.png",
  "Media/blackbag.png",
];

const whiteIcons = [
  "Media/whitesearch.png",
  "Media/whiteuser.png",
  "Media/whiteheart.png",
  "Media/whitebag.png",
];

function updateNavColors() {
  const heroRect = imgContainer.getBoundingClientRect();
  const navRect = nav.getBoundingClientRect();
  const overlap = heroRect.bottom > navRect.top + navRect.height * 0.0001;

  const iconImages = document.querySelectorAll(".nav-icons img");
  const navLinks = document.querySelectorAll(".nav-center a");

  if (overlap && zoomComplete) {
    // Change icons to white
    iconImages.forEach((img, index) => {
      img.src = whiteIcons[index];
    });
    // Change nav link colors to white
    navLinks.forEach((link) => {
      link.style.color = "#fff";
    });
  } else {
    // Change icons to black
    iconImages.forEach((img, index) => {
      img.src = blackIcons[index];
    });
    // Change nav link colors to black
    navLinks.forEach((link) => {
      link.style.color = "#000";
    });
  }
}

// Wheel event handling for zoom
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

// Image stopper 1st section
applyZoom();
updateNavColors();

window.addEventListener("scroll", () => {
  const header = document.querySelector(".collection-header");
  const imageContainer = document.querySelector(".single-image-container");
  const scrollPosition = window.scrollY;
  const triggerPoint = imageContainer.offsetTop - window.innerHeight / 2;

  if (scrollPosition > triggerPoint) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
});

// Image stopper 2nd section

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const image = document.querySelector(".extarnal-image img");
  const section = document.querySelector(".extarnal-section");
  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;
  const scrollPosition = scrollTop - sectionTop;
  if (scrollPosition >= 0 && scrollPosition <= sectionHeight) {
    image.style.transform = `translateY(-${scrollPosition * 0.5}px)`;
  }
});
