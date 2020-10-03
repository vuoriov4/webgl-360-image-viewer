import * as THREE from 'three';
import glslify from 'glslify';
import SimpleFPControls from './SimpleFPControls.js'
import EXRLoader from './EXRLoader.js'
export default class WebGLView {

	constructor(app, index) {
		this.app = app;
		this.index = index;
		this.keyPress = {};
		this.camPosition = new THREE.Vector3(0.0, 0.0, 0.0);
	}
	
	addView(color, position) {
		const geometry = new THREE.SphereGeometry(5.0, 16, 16);
		const material = new THREE.ShaderMaterial({
			uniforms: {
				 "color": { type: "t", value: color },
				 "resolution": { type: "vec2", value: new THREE.Vector2() },
				 "objectPosition": { type: "vec3", value: position },
				 "imageFormat": { type: "int", value: 0 }
			},
			vertexShader: glslify(require('../../shaders/default.vert')),
			fragmentShader: glslify(require('../../shaders/default.frag'))
		});
		material.side = THREE.BackSide;
		const object3D = new THREE.Mesh(geometry, material);
		object3D.position.x = position.x;
		object3D.position.y = position.y;
		object3D.position.z = position.z;
		this.scene.add(object3D);
		this.material = material;
		// const debugSphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 4, 4), new THREE.MeshBasicMaterial({"color": 0xff0000}));
		// debugSphere.position.x = position.x;
		// debugSphere.position.y = position.y;
		// debugSphere.position.z = position.z;
		// this.scene.add(debugSphere);
	}
	
	init() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 100);
		this.camera.position.z = 0;
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.clock = new THREE.Clock();
		this.controls = new SimpleFPControls(this.camera);
  		this.scene.add(this.controls.getObject());
		const image = document.getElementById("image");
		const color = new THREE.Texture(image);
		color.needsUpdate = true;
		color.minFilter = THREE.LinearFilter;
		color.magFilter = THREE.NearestFilter;
		this.addView(color, new THREE.Vector3(0, 0, 0));
	}
	
	updateTexture() {
		const image = document.getElementById("image");
		const color = new THREE.Texture(image);
		color.needsUpdate = true;
		color.minFilter = THREE.LinearFilter;
		color.magFilter = THREE.NearestFilter;
		this.material.uniforms.color.value = color;
	}
	
	updateImageFormat(format) {
		this.material.uniforms.imageFormat.value = format;
	}

	update() {
		const delta = this.clock.getDelta();
		this.controls.update(delta / 10.0);
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}

	resize(vw, vh) {
		if (!this.renderer) return;
		this.camera.aspect = vw / vh;
		this.camera.updateProjectionMatrix();
		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;
		this.fovWidth = this.fovHeight * this.camera.aspect;
		this.renderer.setSize(vw, vh);
		if (this.material) this.material.uniforms.resolution.value.x = vw;
		if (this.material) this.material.uniforms.resolution.value.y = vh;
	}
	
	keyup(keyCode) {
		this.keyPress[keyCode] = false;
	}
	
	keydown(keyCode) {
		this.keyPress[keyCode] = true;
	}
	
}
