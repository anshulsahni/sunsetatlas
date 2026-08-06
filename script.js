const facts = [
  "At its peak, the empire covered a quarter of Earth's land.",
  "In 1913, it ruled 412 million people — 23% of humanity.",
  "The sun never set on it. Literally — always daylight, somewhere.",
  "Its territory touched six continents and every ocean.",
  "Its story ran nearly 400 years, from 1607 to 1997.",
  "Over 60 nations have since won independence from it.",
];

const target = document.getElementById("typewriter-text");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TYPE_SPEED = 28;
const DELETE_SPEED = 14;
const HOLD_TIME = 2200;
const GAP_TIME = 400;

let factIndex = 0;

function typeFact(text, onDone) {
  let i = 0;
  (function step() {
    target.textContent = text.slice(0, i);
    if (i < text.length) {
      i += 1;
      setTimeout(step, TYPE_SPEED);
    } else {
      onDone();
    }
  })();
}

function deleteFact(text, onDone) {
  let i = text.length;
  (function step() {
    target.textContent = text.slice(0, i);
    if (i > 0) {
      i -= 1;
      setTimeout(step, DELETE_SPEED);
    } else {
      onDone();
    }
  })();
}

function runCycle() {
  const text = facts[factIndex];
  typeFact(text, () => {
    setTimeout(() => {
      deleteFact(text, () => {
        factIndex = (factIndex + 1) % facts.length;
        setTimeout(runCycle, GAP_TIME);
      });
    }, HOLD_TIME);
  });
}

if (prefersReducedMotion) {
  target.textContent = facts[0];
} else {
  runCycle();
}
