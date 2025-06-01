let joystickVector = { x: 0, y: 0 };
const isTouch = 'ontouchstart' in window;

if (isTouch) {
  document.getElementById('joystick-zone').style.display = 'block';

  const base = document.getElementById('joystick-base');
  const stick = document.getElementById('joystick-stick');

  let dragging = false;

  base.addEventListener('touchstart', () => {
    dragging = true;
  });

  base.addEventListener('touchmove', e => {
    if (!dragging) return;
    const rect = base.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left - rect.width / 2;
    const y = touch.clientY - rect.top - rect.height / 2;
    const maxDist = rect.width / 2;

    const dist = Math.min(Math.sqrt(x * x + y * y), maxDist);
    const angle = Math.atan2(y, x);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    stick.style.left = `${dx + rect.width / 2 - 25}px`;
    stick.style.top = `${dy + rect.height / 2 - 25}px`;

    joystickVector = { x: dx / maxDist, y: dy / maxDist };
  });

  base.addEventListener('touchend', () => {
    dragging = false;
    joystickVector = { x: 0, y: 0 };
    stick.style.left = '35px';
    stick.style.top = '35px';
  });
}
