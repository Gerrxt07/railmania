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

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const gameStage = getRequiredElement<HTMLElement>('.game-stage');
const menuTitle = getRequiredElement<HTMLElement>('.menu-title');
const menuTitleHitbox = getRequiredElement<HTMLButtonElement>('.menu-title__hitbox');
const menuNav = getRequiredElement<HTMLElement>('.menu-nav');
const menuItems = Array.from(menuNav.querySelectorAll<HTMLButtonElement>('.menu-nav__item'));
const menuFooter = getRequiredElement<HTMLElement>('.menu-footer');
const settingsPanel = getRequiredElement<HTMLElement>('.settings-panel');
const versionLabel = getRequiredElement<HTMLElement>('#app-version');
const backButton = getRequiredElement<HTMLButtonElement>('.settings-panel__back');
const settingsToggles = document.querySelectorAll<HTMLButtonElement>('.settings-panel__toggle');
versionLabel.textContent = `v${RAILMANIA_APP_VERSION}`;
versionLabel.setAttribute('aria-label', `Version ${RAILMANIA_APP_VERSION}`);

let isSettingsOpen = false;
let isTransitioning = false;
const SETTINGS_CLASS = 'game-stage--settings';
const SETTLED_CLASS = 'menu-nav__item--settled';

function openSettings(): void {
  if (isSettingsOpen || isTransitioning) return;
  isTransitioning = true;
  isSettingsOpen = true;

  const exitDuration = reducedMotion ? 150 : 280;
  const exitStagger = reducedMotion ? 0 : 50;
  const exitEasing = 'cubic-bezier(0.55, 0, 0.9, 0.42)';
  const exitKeyframes = [
    { opacity: 1, transform: 'translateX(0) translateY(0)' },
    { opacity: 0, transform: 'translateX(-80px) translateY(10px)' },
  ];

  const animations: Animation[] = [];

  for (const [i, item] of menuItems.entries()) {
    animations.push(item.animate(exitKeyframes, {
      duration: exitDuration,
      easing: exitEasing,
      fill: 'forwards',
      delay: i * exitStagger,
    }));
  }

  const titleAnim = menuTitle.animate([
    { transform: 'translate(-50%, 0)' },
    { transform: 'translate(-50%, -6vh) scale(0.55)' },
  ], {
    duration: reducedMotion ? 200 : 500,
    easing: 'cubic-bezier(0.22, 0.72, 0.24, 1)',
    fill: 'forwards',
  });
  animations.push(titleAnim);

  const footerAnim = menuFooter.animate([
    { opacity: 1 },
    { opacity: 0 },
  ], {
    duration: reducedMotion ? 120 : 250,
    easing: 'ease',
    fill: 'forwards',
  });
  animations.push(footerAnim);

  const lastExitEnd = Math.max(...animations.map((a) => {
    const timing = a.effect?.getTiming() as OptionalEffectTiming;
    return ((timing?.delay as number) ?? 0) + ((timing?.duration as number) ?? 0);
  }));

  void Promise.all(animations.map((a) => a.finished)).then(() => {
    gameStage.classList.add(SETTINGS_CLASS);

    settingsPanel.animate([
      { opacity: 0, transform: 'translate(calc(-50% + 120px), 0)' },
      { opacity: 1, transform: 'translate(-50%, 0)' },
    ], {
      duration: reducedMotion ? 150 : 400,
      easing: 'cubic-bezier(0.22, 0.72, 0.24, 1)',
      fill: 'forwards',
    });

    backButton.style.opacity = '0';
    Array.from(settingsPanel.querySelectorAll<HTMLElement>(
      '.settings-panel__heading, .settings-panel__group',
    )).forEach((el, i) => {
      const anim = el.animate([
        { opacity: 0, transform: 'translateX(30px)' },
        { opacity: 1, transform: 'translateX(0)' },
      ], {
        duration: reducedMotion ? 120 : 320,
        easing: 'cubic-bezier(0.22, 0.72, 0.24, 1)',
        fill: 'forwards',
        delay: reducedMotion ? 0 : 60 + i * 50,
      });
      if (i === 0) {
        void anim.finished.then(() => {
          backButton.style.opacity = '';
        });
      }
    });

    void new Promise((resolve) => setTimeout(resolve, lastExitEnd + 200)).then(() => {
      isTransitioning = false;
    });
  });
}

function closeSettings(): void {
  if (!isSettingsOpen || isTransitioning) return;
  isTransitioning = true;

  const contentEls = Array.from(settingsPanel.querySelectorAll<HTMLElement>(
    '.settings-panel__heading, .settings-panel__group',
  ));
  const exitAnims: Animation[] = [];

  for (const [i, el] of contentEls.entries()) {
    exitAnims.push(el.animate([
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: 'translateX(30px)' },
    ], {
      duration: reducedMotion ? 100 : 220,
      easing: 'cubic-bezier(0.55, 0, 0.9, 0.42)',
      fill: 'forwards',
      delay: reducedMotion ? 0 : (contentEls.length - 1 - i) * 30,
    }));
  }

  exitAnims.push(settingsPanel.animate([
    { opacity: 1, transform: 'translate(-50%, 0)' },
    { opacity: 0, transform: 'translate(calc(-50% + 120px), 0)' },
  ], {
    duration: reducedMotion ? 120 : 320,
    easing: 'cubic-bezier(0.55, 0, 0.9, 0.42)',
    fill: 'forwards',
  }));

  void Promise.all(exitAnims.map((a) => a.finished)).then(() => {
    gameStage.classList.remove(SETTINGS_CLASS);
    isSettingsOpen = false;

    const enterDuration = reducedMotion ? 150 : 320;
    const enterStagger = reducedMotion ? 0 : 60;
    const enterEasing = 'cubic-bezier(0.22, 0.72, 0.24, 1)';
    const enterKeyframes = [
      { opacity: 0, transform: 'translateX(-80px) translateY(10px)' },
      { opacity: 1, transform: 'translateX(0) translateY(0)' },
    ];

    const animations: Animation[] = [];

    for (const [i, item] of menuItems.entries()) {
      animations.push(item.animate(enterKeyframes, {
        duration: enterDuration,
        easing: enterEasing,
        fill: 'forwards',
        delay: i * enterStagger,
      }));
    }

    animations.push(menuTitle.animate([
      { transform: 'translate(-50%, -6vh) scale(0.55)' },
      { transform: 'translate(-50%, 0)' },
    ], {
      duration: reducedMotion ? 200 : 450,
      easing: 'cubic-bezier(0.22, 0.72, 0.24, 1)',
      fill: 'forwards',
    }));

    animations.push(menuFooter.animate([
      { opacity: 0 },
      { opacity: 1 },
    ], {
      duration: reducedMotion ? 120 : 300,
      easing: 'ease',
      fill: 'forwards',
    }));

    void Promise.all(animations.map((a) => a.finished)).then(() => {
      isTransitioning = false;
    });
  });
}

menuTitle.addEventListener('animationend', (event) => {
  if (event.animationName === 'title-drop' || event.animationName === 'title-appear') {
    menuTitle.classList.add('menu-title--settled');
    menuTitleHitbox.disabled = false;
    menuNav.classList.add('menu-nav--active');

    for (const item of menuItems) {
      item.classList.add(SETTLED_CLASS);
    }
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
