import * as THREE from "three";

export function initScene(container: HTMLElement) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, 0.04);

  const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 1.4, 3.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x03050b, 1);
  container.appendChild(renderer.domElement);

  const light = new THREE.PointLight(0xffad7b, 1.6, 8);
  light.position.set(0, 2.2, 0);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x3c5070, 0.4));

  const floorGeo = new THREE.PlaneGeometry(20, 20, 32, 32);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0e1624,
    roughness: 0.9,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const runeGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 24);
  const runeMat = new THREE.MeshStandardMaterial({ color: 0xffc494, emissive: 0x141010, roughness: 0.4 });
  const positions = [
    [-1.2, 0.125, -1],
    [1.2, 0.125, -1],
    [-1.2, 0.125, 1],
    [1.2, 0.125, 1],
  ];
  positions.forEach(([x, y, z]) => {
    const m = new THREE.Mesh(runeGeo, runeMat);
    m.position.set(x, y, z);
    scene.add(m);
  });

  const clock = new THREE.Clock();
  let rafId: number;
  const onResize = () => {
    const { clientWidth, clientHeight } = container;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
  };
  window.addEventListener("resize", onResize);

  const animate = () => {
    const t = clock.getElapsedTime();
    light.intensity = 1.3 + Math.sin(t * 1.5) * 0.2;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  };
  animate();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}

export function disposeScene(container: HTMLElement) {
  // noop; cleanup handled by returned disposer
}
