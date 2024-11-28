import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(5, 1, 0); // Posição inicial da câmera
camera.lookAt(0, 0, 0); // Foco inicial no centro da cena

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(ambientLight);

const marsTexture = new THREE.TextureLoader().load("assets/mars.jpg");

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: marsTexture })
);

scene.add(mars);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Define o alvo dos controles para Marte
controls.target.copy(mars.position);

const radius = 10; // Distância fixa da câmera ao objeto

controls.addEventListener("change", () => {
  // Calcula o ângulo atual da câmera em relação ao alvo
  const angle = Math.atan2(camera.position.z, camera.position.x);

  // Mantém a câmera em um círculo ao redor de Marte
  camera.position.x = Math.cos(angle) * radius;
  camera.position.z = Math.sin(angle) * radius;

  // Garante que a câmera continue olhando para Marte
  camera.lookAt(mars.position);
});

controls.enableDamping = true; // Movimento mais fluido
controls.dampingFactor = 0.1;
controls.enableZoom = false; // Desabilita o zoom para manter a distância fixa

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();
