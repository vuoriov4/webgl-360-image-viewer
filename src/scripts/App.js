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
		//this.el.appendChild(webgl.renderer.domElement);
		const effects = [
			Trixie.effects.colorBalance({r: 1.0, g: 1.0, b: 0.9}),
			Trixie.effects.convolve({kernel: [1/9.0, 1/9.0, 1/9.0, 1/9.0, 1/9.0, 1/9.0, 1/9.0, 1/9.0, 1/9.0]}),
			Trixie.effects.erode({element: [0, 1, 0, 1, 1, 1, 0, 1, 0]}),
			Trixie.effects.dilate({element: [0, 1, 0, 1, 1, 1, 0, 1, 0]}),
			Trixie.effects.convolve({kernel: [0, -0.25, 0, -0.25, 2.0, -0.25, 0, -0.25, 0]})
		];
		this.txCanvas = document.createElement('canvas');
		this.txCanvas.id = "tx-canvas";
		this.tx = new Trixie({
			input: webgl.renderer.domElement,
			effects: effects,
			output: this.txCanvas
		});
		this.el.appendChild(this.txCanvas);
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
		if (this.tx && this.tx.gl) {
			this.tx.gl.bindTexture(this.tx.gl.TEXTURE_2D, this.tx.originalTexture);
			this.tx.gl.texImage2D(this.tx.gl.TEXTURE_2D, 0, this.tx.gl.RGBA, this.tx.gl.RGBA, this.tx.gl.UNSIGNED_BYTE, this.contexts[0].renderer.domElement);
		}
		if (this.tx) this.tx.render();
	}

	resize() {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		this.contexts.forEach(webgl => {
			if (webgl) webgl.resize(vw, vh);
		});
		if (this.txCanvas) {
			this.txCanvas.width = vw;
			this.txCanvas.height = vh;
		}
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
