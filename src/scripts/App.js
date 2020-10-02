import styles from '../styles/main';
import WebGLView from './webgl/WebGLView';

export default class App {

	constructor() {
		this.el = document.querySelector('.container');
	}

	init() {
		this.webgl = new WebGLView(this);
		this.webgl.init();
		this.el.appendChild(this.webgl.renderer.domElement);
		this.addListeners();
		this.animate();
		this.resize();
	}

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);
		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
		window.addEventListener('keydown', this.keydown.bind(this));
		window.addEventListener('load', () => {
			document.querySelector('input[type="file"]').addEventListener('change', e => {
				if (e.target.files && e.target.files[0]) {
					const img = document.getElementById('image');
					img.src = URL.createObjectURL(e.target.files[0]); 
					img.onload = this.webgl.updateTexture.bind(this.webgl);
					console.log(img);
				}
			});
		});
	}
	
	animate() {
		this.webgl.renderer.setAnimationLoop(() => {
			this.update();
			this.draw();
		});
	}
	
	update() {
		if (this.webgl) this.webgl.update();
	}

	draw() {
		if (this.webgl) this.webgl.draw();
	}

	resize() {
		const vw = document.querySelector('.container').offsetWidth || window.innerWidth;
		const vh = document.querySelector('.container').offsetHeight || window.innerHeight;
		if (this.webgl) this.webgl.resize(vw, vh);
	}

	keyup(e) {
		if (this.webgl) this.webgl.keyup(e.keyCode);
	}
	
	keydown(e) {
		if (this.webgl) this.webgl.keydown(e.keyCode);
	}
	
}
