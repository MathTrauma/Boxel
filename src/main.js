import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js'

const canvas = document.getElementById("canvas");
const sizes = {
	width : window.innerWidth,
	height : window.innerHeight
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias : true,
});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.75;

//const camera = new THREE.PerspectiveCamera( 75, sizes.width/sizes.height, 0.1, 1000 );
let aspect = sizes.width /sizes.height;
const camera = new THREE.OrthographicCamera( 
	-aspect * 50, 
	aspect * 50,
	50,
	-50, 
	0.1, 1000 
);
camera.position.set( 20, 30, 20 );
//camera.left = -100;
//camera.bottom =-100;
scene.add( camera );
const controls = new OrbitControls( camera, canvas);
controls.update();

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
sun.position.set(10, 50, 0);
scene.add( sun );

const shadowHelper = new THREE.CameraHelper( sun.shadow.camera );
scene.add( shadowHelper );

const helper = new THREE.DirectionalLightHelper( sun, 5 );
scene.add( helper );

const light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
scene.add( light );



const geometry = new THREE.ConeGeometry( 1, 2, 8 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cone = new THREE.Mesh( geometry, material );
cone.matAutoUpdate = false;
//cone.add(camera);
cone.add(new THREE.AxesHelper(3));
cone.position.set(0,10,0);
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

	raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObjects( scene );

	if(intersects.length > 0) {
		document.body.style.cursor = "pointer";
	} else {
		document.body.style.cursor = "default";
		intersectObject = "";
	}

	for ( let i = 0; i < intersects.length; i ++ ) {
		//intersects[ i ].object.material.color.set( 0xff0000 );
		console.log(intersects);
		//console.log(intersects[0].object.parent.name);
		intersectObject = intersects[0].object.parent.name;
	}
}
 
animate(0);


function onPointerMove( event ) {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
} 


function onResize() {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	
	aspect = sizes.width/sizes.height;
	camera.left = -aspect * 50, 
	camera.right = aspect * 50,
	camera.top = 50,
	camera.bottom = -50, 
	camera.updateProjectionMatrix();

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
}


window.addEventListener("resize", onResize);
//window.addEventListener("click", onClick);

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