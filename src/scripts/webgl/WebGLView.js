import * as THREE from 'three';
import glslify from 'glslify';
import SimpleFPControls from './SimpleFPControls.js'

export default class WebGLView {

	constructor(app) {
		this.app = app;
		this.keyPress = {};
		this.camPosition = new THREE.Vector3(0.0, 0.0, 0.0);
	}
	
	init() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 100);
		this.camera.position.z = 0;
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.clock = new THREE.Clock();
		this.controls = new SimpleFPControls(this.camera);
  		this.scene.add(this.controls.getObject());
		const geometry = new THREE.SphereGeometry(1.0, 512, 256);
		const texture_hemisphere = new THREE.TextureLoader().load("/default.jpg");
		texture_hemisphere.needsUpdate = true;
		texture_hemisphere.minFilter = THREE.LinearFilter;
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				 "texture_hemisphere": { type: "t", value: texture_hemisphere },
				 "resolution": { type: "vec2", value: new THREE.Vector2() }
			},
			vertexShader: glslify(require('../../shaders/default.vert')),
			fragmentShader: glslify(require('../../shaders/default.frag'))
		});
		this.material.side = THREE.BackSide;
		this.object3D = new THREE.Mesh(geometry, this.material);
		this.scene.add(this.object3D);
	}
	
	updateTexture() {
		const image = document.getElementById("image");
		const texture_hemisphere = new THREE.Texture(image);
		texture_hemisphere.needsUpdate = true;
		texture_hemisphere.minFilter = THREE.LinearFilter;
		this.material.uniforms.texture_hemisphere.value = texture_hemisphere;
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
		this.material.uniforms.resolution.value.x = vw;
		this.material.uniforms.resolution.value.y = vh;
	}
	
	keyup(keyCode) {
		this.keyPress[keyCode] = false;
	}
	
	keydown(keyCode) {
		this.keyPress[keyCode] = true;
	}
	
}
