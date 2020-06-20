class App {
	constructor() {
		const burgerButton = document.querySelector('.burger');
		const header = document.querySelector('.header');
		const navMenu = document.querySelector('.nav__menu');
		const body = document.body;
		const mq = window.matchMedia('(min-width: 1320px)');

		burgerButton.addEventListener('click', (e) => {
			const isAriaExpanded = e.target.getAttribute('aria-expanded') === 'true';
			e.target.setAttribute('aria-expanded', isAriaExpanded ? 'false' : 'true');
			body.classList.toggle('overflow--hidden');
			header.classList.toggle('nav--expanded');

			const handeEventListeners = (mq) => {
				if (mq.matches) {
					e.target.setAttribute('aria-expanded', 'false');
					body.classList.remove('overflow--hidden');
					header.classList.remove('nav--expanded');
				}
			};
			mq.addListener(handeEventListeners);
		});
	}
}

export default App;
