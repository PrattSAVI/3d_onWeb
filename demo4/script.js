import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Clock,
    Matrix4,
    Euler,
    Color,
    AmbientLight
} from 'three';

import { Loader3DTiles } from 'three-loader-3dtiles'
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

// Set up the three.js scene
const canvasParent = document.querySelector('.canvas-parent')
const captionElement = document.querySelector('.caption')

const scene = new Scene()
scene.background = new Color(0xff0000);

const camera = new PerspectiveCamera(60, canvasParent.clientWidth / canvasParent.clientHeight, 0.001, 100000)
const renderer = new WebGLRenderer({ antialias: true })

renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight)
    //renderer.outputEncoding = sRGBEncoding
canvasParent.appendChild(renderer.domElement)
camera.position.set(0, 0, 200);


// controls - Orbit
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

const clock = new Clock()
let tilesRuntime

// Import 3D Tiles
let my_url = "assets/tileset_2/tileset.json";

Loader3DTiles.load({
    url: my_url,
    renderer: renderer,
    options: {
        initialTransform: new Matrix4()
            .makeRotationFromEuler(new Euler(0, Math.PI / 2, 0))
            .setPosition(0, 0, 0)
    }
}).then(result => {
    const { model, runtime } = result
    tilesRuntime = runtime
    console.log(model['children'])
    scene.add(model)
})

// -------- Lights
var light = new AmbientLight(0xffffff);
light.intensity = 1;
scene.add(light);

// Render loop
function render(t) {
    window.requestAnimationFrame(render)
    const dt = clock.getDelta()
    if (tilesRuntime) {
        tilesRuntime.update(dt, renderer, camera)
    }
    //controls.update(t)
    renderer.render(scene, camera)
}

// Handle window resize events
window.addEventListener('resize', () => {
    camera.aspect = canvasParent.clientWidth / canvasParent.clientHeight
    camera.updateProjectionMatrix();
    renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight)
})

render()