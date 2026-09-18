import './style.css';

const blockedConsoleMethods = ['debug', 'error', 'info', 'log', 'trace', 'warn'] as const;

for (const method of blockedConsoleMethods) {
  Object.defineProperty(console, method, {
    configurable: false,
    value: () => undefined,
    writable: false,
  });
}
Object.freeze(console);

function getRequiredElement<ElementType extends Element>(selector: string): ElementType {
  const element = document.querySelector<ElementType>(selector);
  if (element === null) throw new Error(`Missing element: ${selector}`);
  return element;
}

const gameStage = getRequiredElement<HTMLElement>('.game-stage');
const menuTitle = getRequiredElement<HTMLElement>('.menu-title');
const menuTitleHitbox = getRequiredElement<HTMLButtonElement>('.menu-title__hitbox');
const menuNav = getRequiredElement<HTMLElement>('.menu-nav');
const menuItems = menuNav.querySelectorAll<HTMLButtonElement>('.menu-nav__item');
const versionLabel = getRequiredElement<HTMLElement>('#app-version');
const backButton = getRequiredElement<HTMLButtonElement>('.settings-panel__back');
const settingsToggles = document.querySelectorAll<HTMLButtonElement>('.settings-panel__toggle');
versionLabel.textContent = `v${RAILMANIA_APP_VERSION}`;
versionLabel.setAttribute('aria-label', `Version ${RAILMANIA_APP_VERSION}`);

let isSettingsOpen = false;
const SETTINGS_CLASS = 'game-stage--settings';

function openSettings(): void {
  if (isSettingsOpen) return;
  isSettingsOpen = true;
  gameStage.classList.add(SETTINGS_CLASS);
}

function closeSettings(): void {
  if (!isSettingsOpen) return;
  isSettingsOpen = false;
  gameStage.classList.remove(SETTINGS_CLASS);
}

menuTitle.addEventListener('animationend', (event) => {
  if (event.animationName === 'title-drop' || event.animationName === 'title-appear') {
    menuTitle.classList.add('menu-title--settled');
    menuTitleHitbox.disabled = false;
    menuNav.classList.add('menu-nav--active');
  }

  if (
    event.animationName === 'title-click-bounce' ||
    event.animationName === 'title-click-bounce-reduced'
  ) {
    menuTitle.classList.remove('menu-title--clicked');
  }
});

menuTitleHitbox.addEventListener('click', () => {
  if (!menuTitle.classList.contains('menu-title--settled')) return;

  menuTitle.classList.remove('menu-title--clicked');
  void menuTitle.offsetWidth;
  menuTitle.classList.add('menu-title--clicked');
});

for (const item of menuItems) {
  item.addEventListener('click', () => {
    const action = item.dataset['action'];
    if (action === 'settings') {
      openSettings();
      return;
    }
    if (action === 'quit') window.close();
  });
}

backButton.addEventListener('click', () => {
  closeSettings();
});

for (const toggle of settingsToggles) {
  toggle.addEventListener('click', () => {
    const checked = toggle.getAttribute('aria-checked') === 'true';
    toggle.setAttribute('aria-checked', String(!checked));
  });
}
