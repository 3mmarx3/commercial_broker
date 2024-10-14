const HSThemeAppearance = {
  init() {
    const defaultTheme = "default";
    let theme = localStorage.getItem("hs_theme") || defaultTheme;

    if (document.querySelector("html").classList.contains("dark")) return;
    this.setAppearance(theme);
  },
  _resetStylesOnLoad() {
    const $resetStyles = document.createElement("style");
    $resetStyles.innerText = `*{transition: unset !important;}`;
    $resetStyles.setAttribute("data-hs-appearance-onload-styles", "");
    document.head.appendChild($resetStyles);
    return $resetStyles;
  },
  setAppearance(theme, saveInStore = true, dispatchEvent = true) {
    const $resetStylesEl = this._resetStylesOnLoad();

    if (saveInStore) {
      localStorage.setItem("hs_theme", theme);
    }

    if (theme === "auto") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "default";
    }

    document.querySelector("html").classList.remove("dark");
    document.querySelector("html").classList.remove("default");
    document.querySelector("html").classList.remove("auto");

    document.querySelector("html").classList.add(this.getOriginalAppearance());

    setTimeout(() => {
      $resetStylesEl.remove();
    });

    if (dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent("on-hs-appearance-change", { detail: theme })
      );
    }
  },
  getAppearance() {
    let theme = this.getOriginalAppearance();
    if (theme === "auto") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "default";
    }
    return theme;
  },
  getOriginalAppearance() {
    const defaultTheme = "default";
    return localStorage.getItem("hs_theme") || defaultTheme;
  },
};
HSThemeAppearance.init();

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (HSThemeAppearance.getOriginalAppearance() === "auto") {
      HSThemeAppearance.setAppearance("auto", false);
    }
  });

window.addEventListener("load", () => {
  const $clickableThemes = document.querySelectorAll(
    "[data-hs-theme-click-value]"
  );
  const $switchableThemes = document.querySelectorAll("[data-hs-theme-switch]");

  $clickableThemes.forEach(($item) => {
    $item.addEventListener("click", () =>
      HSThemeAppearance.setAppearance(
        $item.getAttribute("data-hs-theme-click-value"),
        true,
        $item
      )
    );
  });

  $switchableThemes.forEach(($item) => {
    $item.addEventListener("change", (e) => {
      HSThemeAppearance.setAppearance(e.target.checked ? "dark" : "default");
    });

    $item.checked = HSThemeAppearance.getAppearance() === "dark";
  });

  window.addEventListener("on-hs-appearance-change", (e) => {
    $switchableThemes.forEach(($item) => {
      $item.checked = e.detail === "dark";
    });
  });
});

//

document.querySelectorAll(".hs-accordion-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    // Toggle the active class on the button
    button.classList.toggle("active");

    // Get the associated content div
    const accordionContent = button.nextElementSibling;

    // Toggle visibility
    if (accordionContent.classList.contains("hidden")) {
      accordionContent.classList.remove("hidden");
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px"; // Set max height to scroll height
    } else {
      accordionContent.classList.add("hidden");
      accordionContent.style.maxHeight = null; // Reset max height
    }
  });
});

//

function changeLanguage(lang) {
  document
    .querySelectorAll("[data-" + lang + "]")
    .forEach((el) => (el.innerText = el.getAttribute("data-" + lang)));

  // تغيير اتجاه النص بناءً على اللغة
  document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  localStorage.setItem("language", lang);
}

window.onload = () => changeLanguage(localStorage.getItem("language") || "en");

//

function toggleNavbar() {
  const navbar = document.getElementById("navbar-collapse-with-animation");
  navbar.classList.toggle("hidden");
}
