import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js'

const stats = new Stats();
document.body.append(stats.dom);

import {World} from './world';
import { createUI } from './ui';

const canvas = document.getElementById("canvas");
const sizes = {
	width : window.innerWidth,
	height : window.innerHeight
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias : true,
});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setClearColor(0x80a0e0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.75;

let aspect = sizes.width /sizes.height;
const camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );

camera.position.set(-32, 16,-32);
//scene.add( camera );
const controls = new OrbitControls( camera, canvas);
controls.target.set(16,0,16);
controls.update();


const scene = new THREE.Scene();
const world = new World({width : 32, height:16});
world.generate();
scene.add(world);


function setupLights() {
	const sun = new THREE.DirectionalLight( 0xffffff);
	sun.castShadow = true;
	sun.shadow.mapSize.width = 4096; // default
	sun.shadow.mapSize.height = 4096; // default
	sun.shadow.camera.near = 0.5; // default
	sun.shadow.camera.far = 500; // default
	
	sun.shadow.camera.left = -100; 
	sun.shadow.camera.right = 100; 
	sun.shadow.camera.top = 100; 
	sun.shadow.camera.bottom = -100; 
	
	sun.shadow.normalBias = 0.2; 
	sun.position.set(20,20,20);
	scene.add( sun );
	
	const shadowHelper = new THREE.CameraHelper( sun.shadow.camera );
	scene.add( shadowHelper );
	
	const helper = new THREE.DirectionalLightHelper( sun, 5 );
	scene.add( helper );

	const dLight2 = new THREE.DirectionalLight();
	dLight2.position.set(-1,1,-0.5);
	scene.add(dLight2);
	
	const light = new THREE.AmbientLight(); 
	light.intensity = 0.1;
	scene.add( light );
}

setupLights();


const geometry = new THREE.ConeGeometry( 1, 2, 8 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ffee } );
const cone = new THREE.Mesh( geometry, material );
cone.matAutoUpdate = false;
//cone.add(camera);
cone.add(new THREE.AxesHelper(3));
cone.position.set(0,20,0);
scene.add( cone );
console.log(cone.quaternion);



// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
const quat = new THREE.Quaternion();
const mat = new THREE.Matrix4();
const delta = 0.1; 

let intersectObject;
function animate(t) {
	requestAnimationFrame(animate)
	renderer.render( scene, camera );
	stats.update();

	raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObjects( scene );

	if(intersects.length > 0) {
		document.body.style.cursor = "pointer";
	} else {
		document.body.style.cursor = "default";
		intersectObject = "";
	}

	for ( let i = 0; i < intersects.length; i ++ ) {
		intersectObject = intersects[0].object.parent.name;
		console.log(intersectObject);
	}
}

createUI(world);
animate(0);


function onResize() {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	
	camera.aspect = sizes.width/sizes.height;
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	//renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
}
window.addEventListener("resize", onResize);


function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
} 
window.addEventListener("pointermove", onPointerMove);


window.addEventListener("keydown", (event)=> {
	let key = event.key;
	console.log('test');
	if (key == "w") {
		//camera.position.z -= 0.03;
		mat.makeRotationX(delta);
		quat.setFromRotationMatrix(mat);
		cone.quaternion.multiply(quat);
		//cone.matrix.multiply(mat);
	} else if (key == "s") {
		//camera.position.z += 0.03;
		mat.makeRotationX(-delta);
		quat.setFromRotationMatrix(mat);
		cone.quaternion.multiply(quat);
		//cone.matrix.multiply(mat);
	} else if (key == "a") {
		mat.makeRotationY(delta);
		quat.setFromRotationMatrix(mat);
		cone.quaternion.multiply(quat);
		//cone.matrix.multiply(mat);
	} else if (key == "d") {
		mat.makeRotationY(-delta);
		quat.setFromRotationMatrix(mat);
		cone.quaternion.multiply(quat);
		//cone.matrix.multiply(mat);
	} else if (key == 32) {
	}
}, false);