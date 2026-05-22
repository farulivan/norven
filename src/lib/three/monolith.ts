import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  MeshStandardMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  Group,
} from "three";
import { gsap } from "gsap";
import { DEFAULT_MONOLITH, type MonolithParams } from "./params";

export function init(
  canvas: HTMLCanvasElement,
  params?: Partial<MonolithParams>,
): { update(progress: number): void; resize(): void; destroy(): void } {
  const p: MonolithParams = { ...DEFAULT_MONOLITH, ...params };
  const { slabCount, heightUnit, taper, rotation, accentSlabs } = p;

  const distance = 6;
  let dirty = true;
  let resizeTimer: ReturnType<typeof setTimeout> | null = null;

  // Scene
  const scene = new Scene();

  // Camera
  const aspect = canvas.clientWidth / (canvas.clientHeight || 1);
  const camera = new PerspectiveCamera(35, aspect, 0.1, 100);
  camera.position.set(distance, 3, 0);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // Lighting
  const dirLight = new DirectionalLight(0xfff5e0, 1.2);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);
  const ambLight = new AmbientLight(0xb0a890, 0.45);
  scene.add(ambLight);

  // Slab group
  const group = new Group();

  for (let i = 0; i < slabCount; i++) {
    const scale = 1 - taper * (i / slabCount);
    const width = 2 * scale;
    const depth = 1.5 * scale;
    const height = heightUnit;
    const y = i * (heightUnit + 0.05);
    const isAccent = (accentSlabs as readonly number[]).includes(i);

    const geom = new BoxGeometry(width, height, depth);
    const mat = new MeshStandardMaterial({
      color: isAccent ? 0xb58a50 : 0x111110,
      flatShading: true,
      roughness: 0.65,
      metalness: isAccent ? 0.4 : 0.05,
    });
    const mesh = new Mesh(geom, mat);
    mesh.position.y = y;
    group.add(mesh);

    const edgesGeom = new EdgesGeometry(geom);
    const edgesMat = new LineBasicMaterial({
      color: 0xb58a50,
      transparent: true,
      opacity: 0.5,
    });
    const edges = new LineSegments(edgesGeom, edgesMat);
    edges.position.y = y;
    group.add(edges);
  }

  // Centre group vertically
  group.position.y = -(slabCount * (heightUnit + 0.05)) / 2 + heightUnit / 2;
  scene.add(group);

  // Render loop
  const tick = (): void => {
    if (dirty) {
      renderer.render(scene, camera);
      dirty = false;
    }
  };
  gsap.ticker.add(tick);

  // Initial render
  renderer.render(scene, camera);
  dirty = false;

  function update(progress: number): void {
    const angle = rotation + progress * Math.PI;
    camera.position.x = distance * Math.cos(angle);
    camera.position.z = distance * Math.sin(angle);
    camera.position.y = 3 + progress * 1.5;
    camera.lookAt(0, 0, 0);
    dirty = true;
  }

  function resize(): void {
    if (resizeTimer !== null) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeTimer = null;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / (h || 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      dirty = true;
    }, 100);
  }

  function destroy(): void {
    gsap.ticker.remove(tick);
    if (resizeTimer !== null) clearTimeout(resizeTimer);
    group.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      } else if (obj instanceof LineSegments) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    renderer.dispose();
  }

  return { update, resize, destroy };
}
