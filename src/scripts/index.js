import ready from 'domready';
import AsyncPreloader from 'async-preloader';

// import App from './App';
import { fetchJSON } from './utils/fetch.utils';

const preload = () => {
	const pApp = import(/* webpackChunkName: 'app' */ './App');
	const pProgress = [pApp];
	let loadedCount = 0;
	let progress = 0;
	Promise.all(
		pProgress.map(p => {
			p.then(() => {
				loadedCount++;
				progress = loadedCount / pProgress.length;
				// console.log(progress);
			});
			return p;
		})
	)
	.then(([app]) => {
		window.app = new app.default();
		window.app.init();
	})
	.catch((e) => {
		console.log('preload', e);
	});
}

ready(() => {
	preload();
});
