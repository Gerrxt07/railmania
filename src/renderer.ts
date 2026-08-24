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
  if (element === null) throw new Error(`Missing startup element: ${selector}`);
  return element;
}

const startup = getRequiredElement<HTMLElement>('.startup');
const startupLogo = getRequiredElement<HTMLImageElement>('#startup-logo');
const startupStatus = getRequiredElement<HTMLElement>('#startup-status');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const statusSteps = [
  { delay: 1_300, text: 'Checking timetable' },
  { delay: 2_350, text: 'Preparing rolling stock' },
  { delay: 3_350, text: 'Setting routes' },
  { delay: 4_250, text: 'Ready for departure' },
] as const;

function startSequence(): void {
  document.body.classList.add('startup-running');

  if (reducedMotion) {
    startupStatus.textContent = 'Ready for departure';
    window.setTimeout(() => document.body.classList.add('startup-complete'), 250);
    window.setTimeout(() => { startup.hidden = true; }, 700);
    return;
  }

  for (const step of statusSteps) {
    window.setTimeout(() => { startupStatus.textContent = step.text; }, step.delay);
  }

  window.setTimeout(() => document.body.classList.add('startup-complete'), 5_100);
  window.setTimeout(() => { startup.hidden = true; }, 5_900);
}

void startupLogo.decode().catch(() => undefined).then(startSequence);
