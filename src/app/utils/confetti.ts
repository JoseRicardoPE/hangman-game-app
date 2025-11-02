import confetti from 'canvas-confetti';

// 🎯 Efecto de victoria
export function triggerWinEffect() {
  const duration = 2 * 1000; // 2 segundos
  const end = Date.now() + duration;

  const colors = ['#00ffcc', '#ffcc00', '#ff66cc', '#33cc33', '#3399ff'];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}