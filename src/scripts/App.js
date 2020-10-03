import styles from '../styles/main';
import WebGLView from './webgl/WebGLView';

export default class App {

	constructor() {
		this.contexts = [];
		this.el = document.querySelector('.container');
	}

	init() {
		const webgl = new WebGLView(this, 0);
		webgl.init();
		this.contexts.push(webgl);
		this.el.appendChild(webgl.renderer.domElement);
		this.addListeners();
		this.animate();
		this.resize();
	}

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);
		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));
		window.addEventListener('keydown', this.keydown.bind(this));
		document.getElementById('input').addEventListener('change', e => {
			const file = e.target.files[0];
			const reader = new FileReader();
			reader.onloadend = () => {
				document.getElementById("image").src = reader.result;
				this.contexts.forEach(webgl => { webgl.updateTexture() });
			}
			if (file) reader.readAsDataURL(file);
		});
		document.getElementById('format').addEventListener('change', e => {
			this.contexts.forEach(webgl => {
				if (e.target[0].selected && webgl) webgl.updateImageFormat(0);
				if (e.target[1].selected && webgl) webgl.updateImageFormat(1);
			});
		});
	}
	
	animate() {
		this.update();
		this.draw();
		window.requestAnimationFrame(this.animate.bind(this));
	}
	
	update() {
		this.contexts.forEach(webgl => {
			if (webgl) webgl.update();
		});
	}

	draw() {
		this.contexts.forEach(webgl => {
			if (webgl) webgl.draw();
		});
	}

	resize() {
		const vw = window.innerWidth - 20;
		const vh = window.innerHeight - 50;
		this.contexts.forEach(webgl => {
			if (webgl) webgl.resize(vw, vh);
		});
	}

	keyup(e) {
		this.contexts.forEach(webgl => {
			if (webgl) webgl.keyup(e.keyCode);
		});
	}
	
	keydown(e) {
		this.contexts.forEach(webgl => {
			if (webgl) webgl.keydown(e.keyCode);
		});
	}
	
}
