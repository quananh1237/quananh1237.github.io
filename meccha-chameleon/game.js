// ============================================
// MECCHA CHAMELEON - 3D Game Engine
// ============================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 8);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;

// ============================================
// LIGHTING
// ============================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 100;
scene.add(directionalLight);

// ============================================
// CHARACTER (White figure with rounded head, arms, legs)
// ============================================
class Character {
    constructor() {
        this.group = new THREE.Group();
        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, -0.15, 0); // gravity
        this.isJumping = false;
        this.speed = 0.2;
        this.jumpPower = 0.5;
        this.moveDirection = new THREE.Vector3(0, 0, 0);
        
        // Animation states
        this.walkingAnimationPhase = 0;
        this.isWalking = false;
        
        this.createBody();
        this.group.position.copy(this.position);
        scene.add(this.group);
    }

    createBody() {
        // Head (sphere)
        const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const whiteMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.8
        });
        this.head = new THREE.Mesh(headGeometry, whiteMaterial);
        this.head.position.y = 1.3;
        this.head.castShadow = true;
        this.head.receiveShadow = true;
        this.group.add(this.head);

        // Body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.8, 32);
        this.body = new THREE.Mesh(bodyGeometry, whiteMaterial);
        this.body.position.y = 0.6;
        this.body.castShadow = true;
        this.body.receiveShadow = true;
        this.group.add(this.body);

        // Left Arm (sphere with rounded end)
        const armGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        this.leftArm = new THREE.Mesh(armGeometry, whiteMaterial);
        this.leftArm.position.set(-0.6, 0.8, 0);
        this.leftArm.scale.set(0.7, 1.2, 0.7);
        this.leftArm.castShadow = true;
        this.leftArm.receiveShadow = true;
        this.group.add(this.leftArm);

        // Right Arm
        this.rightArm = new THREE.Mesh(armGeometry, whiteMaterial);
        this.rightArm.position.set(0.6, 0.8, 0);
        this.rightArm.scale.set(0.7, 1.2, 0.7);
        this.rightArm.castShadow = true;
        this.rightArm.receiveShadow = true;
        this.group.add(this.rightArm);

        // Left Leg (sphere with rounded end)
        const legGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        this.leftLeg = new THREE.Mesh(legGeometry, whiteMaterial);
        this.leftLeg.position.set(-0.25, 0.15, 0);
        this.leftLeg.scale.set(0.65, 1.3, 0.65);
        this.leftLeg.castShadow = true;
        this.leftLeg.receiveShadow = true;
        this.group.add(this.leftLeg);

        // Right Leg
        this.rightLeg = new THREE.Mesh(legGeometry, whiteMaterial);
        this.rightLeg.position.set(0.25, 0.15, 0);
        this.rightLeg.scale.set(0.65, 1.3, 0.65);
        this.rightLeg.castShadow = true;
        this.rightLeg.receiveShadow = true;
        this.group.add(this.rightLeg);

        // Store canvas texture for drawing
        this.canvasTexture = new THREE.CanvasTexture(createCharacterCanvas());
        this.drawTexture = this.canvasTexture;
        
        // Apply drawing texture to body
        this.head.material.map = this.drawTexture;
        this.body.material.map = this.drawTexture;
        this.leftArm.material.map = this.drawTexture;
        this.rightArm.material.map = this.drawTexture;
        this.leftLeg.material.map = this.drawTexture;
        this.rightLeg.material.map = this.drawTexture;
    }

    update(moveInput) {
        // Movement
        this.moveDirection.set(moveInput.x, 0, moveInput.y);
        if (this.moveDirection.length() > 0) {
            this.moveDirection.normalize().multiplyScalar(this.speed);
            this.isWalking = true;
        } else {
            this.isWalking = false;
        }

        this.velocity.x = this.moveDirection.x;
        this.velocity.z = this.moveDirection.z;
        this.velocity.add(this.acceleration);

        // Ground collision
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y = 0;
            this.isJumping = false;
        } else {
            this.isJumping = true;
        }

        this.position.add(this.velocity);
        this.group.position.copy(this.position);

        // Animation
        this.updateAnimation();

        // Camera follow
        const targetCameraPos = new THREE.Vector3(
            this.position.x,
            this.position.y + 3,
            this.position.z + 8
        );
        camera.position.lerp(targetCameraPos, 0.1);
        camera.lookAt(this.position.x, this.position.y + 1, this.position.z);
    }

    updateAnimation() {
        if (this.isWalking) {
            this.walkingAnimationPhase += 0.1;
            const legSwing = Math.sin(this.walkingAnimationPhase) * 0.3;
            const armSwing = Math.cos(this.walkingAnimationPhase) * 0.2;

            this.leftLeg.rotation.z = legSwing;
            this.rightLeg.rotation.z = -legSwing;
            this.leftArm.rotation.z = -armSwing;
            this.rightArm.rotation.z = armSwing;

            this.head.rotation.y = Math.sin(this.walkingAnimationPhase * 0.5) * 0.1;
        } else {
            // Idle animation
            this.leftLeg.rotation.z *= 0.9;
            this.rightLeg.rotation.z *= 0.9;
            this.leftArm.rotation.z *= 0.9;
            this.rightArm.rotation.z *= 0.9;
            this.head.rotation.y *= 0.9;
        }

        // Jump animation
        if (this.isJumping) {
            this.head.scale.y *= 0.95;
            this.body.scale.y *= 0.95;
        } else {
            this.head.scale.y += (1 - this.head.scale.y) * 0.1;
            this.body.scale.y += (1 - this.body.scale.y) * 0.1;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.velocity.y = this.jumpPower;
            this.isJumping = true;
        }
    }

    updateDrawingTexture(canvasElement) {
        this.drawTexture = new THREE.CanvasTexture(canvasElement);
        this.head.material.map = this.drawTexture;
        this.body.material.map = this.drawTexture;
        this.leftArm.material.map = this.drawTexture;
        this.rightArm.material.map = this.drawTexture;
        this.leftLeg.material.map = this.drawTexture;
        this.rightLeg.material.map = this.drawTexture;
    }
}

function createCharacterCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    return canvas;
}

// ============================================
// DETAILED MAP/ENVIRONMENT
// ============================================
function createEnvironment() {
    // Ground (grass with texture)
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const grassMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x34a853,
        roughness: 0.9,
        metalness: 0
    });
    const ground = new THREE.Mesh(groundGeometry, grassMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Trees
    createTree(-30, 0, -30);
    createTree(30, 0, -40);
    createTree(-40, 0, 30);
    createTree(40, 0, 40);
    createTree(0, 0, -50);

    // Rocks/Stones
    createRock(-15, 0, 10);
    createRock(20, 0, 15);
    createRock(-25, 0, -20);

    // Platforms for exploration
    createPlatform(0, 0.5, 30, 10, 1, 10);
    createPlatform(25, 1.5, 0, 8, 1, 8);
    createPlatform(-25, 1.5, 0, 8, 1, 8);

    // Building/House
    createBuilding(0, 0, -40);

    // Bridge/Path
    createBridge(-30, 0, 0, 40, 2);
}

function createTree(x, y, z) {
    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.8, 1, 5, 32);
    const brownMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.8 });
    const trunk = new THREE.Mesh(trunkGeometry, brownMaterial);
    trunk.position.set(x, y + 2.5, z);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);

    // Foliage (multiple spheres)
    for (let i = 0; i < 3; i++) {
        const foliageGeometry = new THREE.SphereGeometry(3 - i * 0.5, 16, 16);
        const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.7 });
        const foliage = new THREE.Mesh(foliageGeometry, greenMaterial);
        foliage.position.set(x, y + 6 + i * 1.5, z);
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        scene.add(foliage);
    }
}

function createRock(x, y, z) {
    const rockGeometry = new THREE.DodecahedronGeometry(1.5, 1);
    const stoneMaterial = new THREE.MeshStandardMaterial({ color: 0x8b8b8b, roughness: 0.9 });
    const rock = new THREE.Mesh(rockGeometry, stoneMaterial);
    rock.position.set(x, y + 1, z);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
}

function createPlatform(x, y, z, width, height, depth) {
    const platformGeometry = new THREE.BoxGeometry(width, height, depth);
    const platformMaterial = new THREE.MeshStandardMaterial({ color: 0xdaa520, roughness: 0.7 });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(x, y, z);
    platform.castShadow = true;
    platform.receiveShadow = true;
    scene.add(platform);
}

function createBuilding(x, y, z) {
    // Wall
    const wallGeometry = new THREE.BoxGeometry(8, 6, 8);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xd2691e, roughness: 0.8 });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(x, y + 3, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);

    // Roof (pyramid)
    const roofGeometry = new THREE.ConeGeometry(6, 3, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.8 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, y + 7.5, z);
    roof.castShadow = true;
    roof.receiveShadow = true;
    scene.add(roof);

    // Door
    const doorGeometry = new THREE.BoxGeometry(2, 3, 0.2);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.7 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(x, y + 1.5, z + 4.1);
    door.castShadow = true;
    door.receiveShadow = true;
    scene.add(door);
}

function createBridge(x, y, z, length, width) {
    const bridgeGeometry = new THREE.BoxGeometry(width, 0.5, length);
    const bridgeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 });
    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    bridge.position.set(x, y + 0.25, z);
    bridge.castShadow = true;
    bridge.receiveShadow = true;
    scene.add(bridge);

    // Railings
    for (let i = 0; i < 8; i++) {
        const railGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1, 16);
        const railMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
        const rail = new THREE.Mesh(railGeometry, railMaterial);
        rail.position.set(x - width/2 + 0.3, y + 0.8, z - length/2 + i * length/7);
        rail.castShadow = true;
        scene.add(rail);
    }
}

// ============================================
// CONTROLS & INPUT
// ============================================
const keys = {};
const moveInput = { x: 0, y: 0 };

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Joystick
const joystickContainer = document.getElementById('joystick');
const joystickThumb = document.getElementById('joystickThumb');
let joystickActive = false;
let joystickStartX = 0;
let joystickStartY = 0;

joystickContainer.addEventListener('pointerdown', (e) => {
    joystickActive = true;
    joystickStartX = e.clientX;
    joystickStartY = e.clientY;
    updateJoystick(e);
});

document.addEventListener('pointermove', (e) => {
    if (joystickActive) {
        updateJoystick(e);
    }
});

document.addEventListener('pointerup', () => {
    joystickActive = false;
    joystickThumb.style.transform = 'translate(-50%, -50%)';
    moveInput.x = 0;
    moveInput.y = 0;
});

function updateJoystick(e) {
    const rect = joystickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = rect.width / 2 - 30;
    
    const angle = Math.atan2(y, x);
    const clampedDistance = Math.min(distance, maxDistance);
    
    const thumbX = Math.cos(angle) * clampedDistance;
    const thumbY = Math.sin(angle) * clampedDistance;
    
    joystickThumb.style.transform = `translate(calc(-50% + ${thumbX}px), calc(-50% + ${thumbY}px))`;
    
    moveInput.x = thumbX / maxDistance;
    moveInput.y = thumbY / maxDistance;
}

// Jump Button
const jumpButton = document.getElementById('jumpButton');
jumpButton.addEventListener('pointerdown', () => {
    character.jump();
});

// ============================================
// PAINT SYSTEM
// ============================================
const paintButton = document.getElementById('paintButton');
const paintPanel = document.getElementById('paintPanel');
const paintCanvas = document.getElementById('paintCanvas');
const drawingCanvas = document.getElementById('drawingCanvas');
const clearButton = document.getElementById('clearButton');
const brushSizeInput = document.getElementById('brushSize');
const brushPreview = document.getElementById('brushPreview');
const colorPalette = document.getElementById('colorPalette');

let currentColor = '#000000';
let brushSize = 10;
let isDrawing = false;
let drawingContext = null;

// Color palette
const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00',
    '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff6600', '#ff0099', '#00ff99', '#9900ff',
    '#ffcc00', '#cc0000', '#00cc00', '#0099ff'
];

colors.forEach(color => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    colorOption.style.background = color;
    if (color === currentColor) colorOption.classList.add('selected');
    colorOption.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
        colorOption.classList.add('selected');
        currentColor = color;
    });
    colorPalette.appendChild(colorOption);
});

brushSizeInput.addEventListener('input', (e) => {
    brushSize = e.target.value;
    brushPreview.innerHTML = `<div class="brush-preview-dot" style="width: ${brushSize}px; height: ${brushSize}px;"></div>`;
});

paintButton.addEventListener('click', () => {
    paintPanel.classList.toggle('active');
    if (paintPanel.classList.contains('active')) {
        setupDrawingCanvas();
        paintCanvas.classList.add('active');
    } else {
        paintCanvas.classList.remove('active');
    }
});

clearButton.addEventListener('click', () => {
    if (drawingContext) {
        drawingContext.fillStyle = '#ffffff';
        drawingContext.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        character.updateDrawingTexture(drawingCanvas);
    }
});

function setupDrawingCanvas() {
    drawingCanvas.width = 512;
    drawingCanvas.height = 512;
    drawingContext = drawingCanvas.getContext('2d');
    
    // Copy current character drawing
    const charCanvas = character.drawTexture.image;
    if (charCanvas) {
        drawingContext.drawImage(charCanvas, 0, 0);
    } else {
        drawingContext.fillStyle = '#ffffff';
        drawingContext.fillRect(0, 0, 512, 512);
    }

    // Drawing events
    drawingCanvas.addEventListener('pointerdown', (e) => {
        isDrawing = true;
        const rect = drawingCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (drawingCanvas.width / rect.width);
        const y = (e.clientY - rect.top) * (drawingCanvas.height / rect.height);
        
        drawingContext.fillStyle = currentColor;
        drawingContext.beginPath();
        drawingContext.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        drawingContext.fill();
        
        character.updateDrawingTexture(drawingCanvas);
    });

    drawingCanvas.addEventListener('pointermove', (e) => {
        if (!isDrawing) return;
        
        const rect = drawingCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (drawingCanvas.width / rect.width);
        const y = (e.clientY - rect.top) * (drawingCanvas.height / rect.height);
        
        drawingContext.fillStyle = currentColor;
        drawingContext.beginPath();
        drawingContext.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        drawingContext.fill();
        
        character.updateDrawingTexture(drawingCanvas);
    });

    drawingCanvas.addEventListener('pointerup', () => {
        isDrawing = false;
    });

    drawingCanvas.addEventListener('pointerleave', () => {
        isDrawing = false;
    });
}

// Close paint panel on canvas background click
document.getElementById('paintCanvasBg').addEventListener('click', (e) => {
    if (e.target === document.getElementById('paintCanvasBg')) {
        paintPanel.classList.remove('active');
        paintCanvas.classList.remove('active');
    }
});

// ============================================
// MAIN GAME LOOP
// ============================================
const character = new Character();
createEnvironment();

function gameLoop() {
    requestAnimationFrame(gameLoop);

    // Update movement input from keyboard
    moveInput.x = 0;
    moveInput.y = 0;

    if (keys['w'] || keys['arrowup']) moveInput.y -= 1;
    if (keys['s'] || keys['arrowdown']) moveInput.y += 1;
    if (keys['a'] || keys['arrowleft']) moveInput.x -= 1;
    if (keys['d'] || keys['arrowright']) moveInput.x += 1;

    // Jump with spacebar
    if (keys[' '] && !character.isJumping) {
        character.jump();
        keys[' '] = false;
    }

    character.update(moveInput);
    renderer.render(scene, camera);
}

gameLoop();

// ============================================
// RESPONSIVE
// ============================================
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});
