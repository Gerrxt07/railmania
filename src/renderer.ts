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

const menuTitle = getRequiredElement<HTMLButtonElement>('.menu-title');
const versionLabel = getRequiredElement<HTMLElement>('#app-version');
versionLabel.textContent = `v${RAILMANIA_APP_VERSION}`;
versionLabel.setAttribute('aria-label', `Version ${RAILMANIA_APP_VERSION}`);

menuTitle.addEventListener('animationend', (event) => {
  if (event.animationName === 'title-drop' || event.animationName === 'title-appear') {
    menuTitle.classList.add('menu-title--settled');
    menuTitle.disabled = false;
  }

  if (
    event.animationName === 'title-click-bounce' ||
    event.animationName === 'title-click-bounce-reduced'
  ) {
    menuTitle.classList.remove('menu-title--clicked');
  }
});

menuTitle.addEventListener('click', () => {
  if (!menuTitle.classList.contains('menu-title--settled')) return;

  menuTitle.classList.remove('menu-title--clicked');
  void menuTitle.offsetWidth;
  menuTitle.classList.add('menu-title--clicked');
});
