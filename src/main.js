import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(renderer.domElement);

//
// LIGHTING
//

const ambientLight =
  new THREE.AmbientLight(0xffffff, 2);

scene.add(ambientLight);

const keyLight =
  new THREE.DirectionalLight(0xffffff, 4);

keyLight.position.set(5, 5, 5);

scene.add(keyLight);

const rimLight =
  new THREE.DirectionalLight(0x77aaff, 4);

rimLight.position.set(-5, 3, -5);

scene.add(rimLight);

//
// GLOW MARKERS
//

const glowGeometry =
  new THREE.SphereGeometry(0.08, 32, 32);

const glowMaterial =
  new THREE.MeshBasicMaterial({
    color: "#7dd3fc"
  });

const marker1 =
  new THREE.Mesh(glowGeometry, glowMaterial);

const marker2 =
  new THREE.Mesh(glowGeometry, glowMaterial);

const marker3 =
  new THREE.Mesh(glowGeometry, glowMaterial);

marker1.position.set(-0.8, 0.8, 0.2);
marker2.position.set(0.8, 0.2, 0.5);
marker3.position.set(0, -0.8, 0.3);

scene.add(marker1);
scene.add(marker2);
scene.add(marker3);

marker1.visible = true;
marker2.visible = false;
marker3.visible = false;

//
// MODEL
//

let brain;

const loader =
  new GLTFLoader();

loader.load(
  "/BRAINVOCIE.glb",

  (gltf) => {

    brain = gltf.scene;

    brain.scale.set(
      1.2,
      1.2,
      1.2
    );

    brain.position.set(
      0,
      0,
      0
    );

    brain.traverse((child) => {

      if (child.isMesh) {

        child.material =
          new THREE.MeshPhysicalMaterial({

            color: "#5B8CFF",

            metalness: 0.7,

            roughness: 0.15,

            transmission: 0.1,

            clearcoat: 1,

            clearcoatRoughness: 0,

            emissive: "#3050ff",

            emissiveIntensity: 0.3

          });

      }

    });

    scene.add(brain);

  }
);

//
// ROTATION CONTROL
//

let targetRotation = 0;

window.addEventListener(
  "message",
  (event) => {

    const state =
      event.data.state;

    if (state === 1) {

      targetRotation = 0;

      marker1.visible = true;
      marker2.visible = false;
      marker3.visible = false;
    }

    if (state === 2) {

      targetRotation =
        Math.PI / 2;

      marker1.visible = false;
      marker2.visible = true;
      marker3.visible = false;
    }

    if (state === 3) {

      targetRotation =
        Math.PI;

      marker1.visible = false;
      marker2.visible = false;
      marker3.visible = true;
    }

  }
);

//
// ANIMATION
//

function animate() {

  requestAnimationFrame(
    animate
  );
let idleRotation = 0;
  if (brain) {

    // Floating motion
    brain.position.y =
      Math.sin(Date.now() * 0.001) * 0.12;

    // Slow continuous movement
    idleRotation += 0.002;

    // Smooth snap to target
    brain.rotation.y +=
      ((targetRotation + idleRotation) -
      brain.rotation.y) * 0.05;

}

  renderer.render(
    scene,
    camera
  );
}

animate();

//
// RESIZE
//

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);