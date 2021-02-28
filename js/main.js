import * as THREE from "https://threejs.org/build/three.module.js";
import { LineGeometry } from "https://threejs.org/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "https://threejs.org/examples/jsm/lines/LineMaterial.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "https://threejs.org/examples/jsm/lines/Line2.js";

window.addEventListener("load", main, false);

function main(evt) {
  window.removeEventListener(evt.type, main, false);

  const canvasDiv = document.getElementById("canvasDiv");
  const resetButton = document.getElementById("resetButton");

  let width = Math.min(window.innerWidth, window.innerHeight) / 1.6;
  let height = Math.min(window.innerWidth, window.innerHeight) / 1.6;
  let renderer;
  let scene;
  let camera;
  let orbitControls;
  const MAX_GEN_POINTS = 20000;
  let positions = [];
  let colors = [];
  let color = new THREE.Color();
  let n = 0;
  let i = 0;

  const dt = 0.01;
  const a = 0.1;
  const b = 0.1;
  const c = 14;
  let x = 1;
  let y = 1;
  let z = 0;

  function setup() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(width / height);
    renderer.setClearColor(0x000000, 0.0);
    canvasDiv.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(7, -145, 80);
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.minDistance = 10;
    orbitControls.maxDistance = 500;
    orbitControls.saveState();

    window.addEventListener("resize", () => {
      width = Math.min(window.innerWidth, window.innerHeight) / 1.6;
      height = Math.min(window.innerWidth, window.innerHeight) / 1.6;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resetButton.addEventListener("click", reset);
  }

  function animate() {
    if (i < MAX_GEN_POINTS) {
      for (let I = 0; I < 5; I++) {
        update();
      }
    }
    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);
    const matLine = new LineMaterial({
      linewidth: 3,
      vertexColors: true,
    });
    scene.clear();
    scene.add(new Line2(geometry, matLine));
    orbitControls.update();
    renderer.setClearColor(0x000000, 0);
    renderer.setViewport(0, 0, width, height);
    matLine.resolution.set(width, height);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  function update() {
    const dx = -y - z;
    const dy = x + a * y;
    const dz = b + z * (x - c);
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    positions.push(x, y, z);
    color.setHSL(n, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
    if ((n += 0.0002) > 1) n = 0;
    i++;
  }

  function reset() {
    n = 0;
    i = 0;
    x = 1;
    y = 1;
    z = 0;
    positions = [];
    colors = [];
    orbitControls.reset();
  }

  setup();
  animate();
}
