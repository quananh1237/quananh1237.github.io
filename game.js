// Cảnh 3D
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Sân
const field = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 50),
  new THREE.MeshBasicMaterial({ color: 0x228B22 })
);
field.rotation.x = -Math.PI / 2;
scene.add(field);

// Bóng
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
ball.position.set(0, 0.5, 0);
scene.add(ball);

// Cầu thủ
const player = new THREE.Mesh(
  new THREE.CylinderGeometry(0.7, 0.7, 2, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
player.position.set(-10, 1, 0);
scene.add(player);

// Camera
camera.position.set(0, 30, 30);
camera.lookAt(0, 0, 0);

// Input phím
const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

// Di chuyển cầu thủ (phím + joystick)
function movePlayer() {
  const speed = 0.25;
  let moved = false;
  let vx = 0, vz = 0;

  // Phím
  if (keys['w']) vz -= 1;
  if (keys['s']) vz += 1;
  if (keys['a']) vx -= 1;
  if (keys['d']) vx += 1;

  // Joystick
  vx += joystickVector.x;
  vz += joystickVector.y;

  const len = Math.sqrt(vx * vx + vz * vz);
  if (len > 0) {
    vx /= len;
    vz /= len;
    player.position.x += vx * speed;
    player.position.z += vz * speed;
    moved = true;

    const angle = Math.atan2(vz, vx);
    player.rotation.y = -angle;
  }
}

// Sút bóng
function kickBall() {
  const dx = ball.position.x - player.position.x;
  const dz = ball.position.z - player.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  if (dist < 2) {
    const force = 1.5;
    ball.position.x += dx * force;
    ball.position.z += dz * force;
  }
}

// Game loop
function animate() {
  requestAnimationFrame(animate);
  movePlayer();

  if (keys['j']) kickBall(); // Sút
  if (keys['l']) kickBall(); // Tạt
  if (keys['m']) kickBall(); // Chuyền

  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
