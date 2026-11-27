"use strict";

/* 画面の枠（サイドパネル・メニュー・テーマ） */
(() => {
  const $ = (selector) => document.querySelector(selector);

  /* ---------- テーマ（ライト / ダーク / システム） ---------- */

  const THEME_KEY = "trendscan-theme"; // index.html の head のスクリプトも同じキーを読む
  const isTheme = (value) => value === "light" || value === "dark";
  const themeButtons = document.querySelectorAll(".menu-theme-option");

  function storedTheme() {
    try {
      const value = window.localStorage.getItem(THEME_KEY);
      return isTheme(value) ? value : null;
    } catch {
      return null;
    }
  }

  function themeChoice() {
    const applied = document.documentElement.dataset.theme;
    return storedTheme() ?? (isTheme(applied) ? applied : "system");
  }

  function renderThemeChoice() {
    const choice = themeChoice();
    themeButtons.forEach((button) => {
      button.setAttribute("aria-checked", String(button.dataset.themeValue === choice));
    });
  }

  function selectTheme(value) {
    if (isTheme(value)) document.documentElement.dataset.theme = value;
    else delete document.documentElement.dataset.theme;
    try {
      if (isTheme(value)) window.localStorage.setItem(THEME_KEY, value);
      else window.localStorage.removeItem(THEME_KEY);
    } catch {
      // 保存できない環境では、このページの間だけ有効
    }
    renderThemeChoice();
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => selectTheme(button.dataset.themeValue));
  });

  /* ---------- サイドパネル ---------- */

  // 1024px 以上は、開いた表示と細い帯を切り替える。1023px 以下は、本文の上に重ねて開く
  const wideQuery = window.matchMedia("(min-width: 1024px)");
  const sidebar = $(".app-sidebar");
  const railOpen = $(".app-rail-open");
  const closeButton = $("#sidebar-close");
  const openButton = $("#sidebar-open");
  const drawerOpener = $("#drawer-open");
  const scrim = $(".app-scrim");
  let open = true;
  let drawerOpen = false;

  function renderSidebar() {
    const wide = wideQuery.matches;
    if (wide) drawerOpen = false;
    const rail = wide && !open;
    sidebar.dataset.open = rail ? "false" : "true";
    sidebar.dataset.drawer = drawerOpen ? "open" : "closed";
    railOpen.hidden = !rail;
    closeButton.hidden = rail;
    openButton.hidden = !rail;
    scrim.hidden = !drawerOpen;
    drawerOpener.setAttribute("aria-expanded", String(drawerOpen));
  }

  function toggle(next) {
    open = next;
    renderSidebar();
    (open ? closeButton : openButton).focus();
  }

  function openDrawer() {
    drawerOpen = true;
    renderSidebar();
    closeButton.focus();
  }

  function closeDrawer(refocus) {
    drawerOpen = false;
    renderSidebar();
    if (refocus) drawerOpener.focus();
  }

  closeButton.addEventListener("click", () => {
    if (wideQuery.matches) toggle(false);
    else closeDrawer(true);
  });
  openButton.addEventListener("click", () => toggle(true));
  railOpen.addEventListener("click", () => toggle(true));
  drawerOpener.addEventListener("click", openDrawer);
  scrim.addEventListener("click", () => closeDrawer(true));
  sidebar.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !drawerOpen) return;
    if (event.target.closest('[role="menu"]')) return;
    event.preventDefault();
    closeDrawer(true);
  });
  // 重ねて開いたパネルで行き先を選んだら、閉じて本文へ移る
  document.querySelectorAll(".app-rail [data-section], .app-brand-link").forEach((item) => {
    item.addEventListener("click", () => {
      if (!drawerOpen) return;
      closeDrawer(false);
      $("#main").focus();
    });
  });
  wideQuery.addEventListener("change", renderSidebar);

  /* ---------- 左下のメニュー（テーマの切り替え） ---------- */

  const menuButton = $(".menu-button");
  const menu = $(".menu-popup");
  const menuItems = () => [...menu.querySelectorAll('[role^="menuitem"]')];

  function setMenu(next) {
    menu.hidden = !next;
    menuButton.setAttribute("aria-expanded", String(next));
    if (next) menuItems()[0]?.focus();
  }

  menuButton.addEventListener("click", () => setMenu(menu.hidden));
  document.addEventListener("mousedown", (event) => {
    if (menu.hidden) return;
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
  });
  menu.addEventListener("keydown", (event) => {
    const items = menuItems();
    const index = items.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      setMenu(false);
      menuButton.focus();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    } else if (event.key === "Tab") {
      setMenu(false);
    }
  });

  renderThemeChoice();
  renderSidebar();
})();
