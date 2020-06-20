class Slider {
    constructor() {

        const footerSocialLinks = document.querySelector('.footer__socialmedia--container')
        const stickyBar = document.querySelector('.sticky-bar')

        const isInViewport = (element) => {
            const distance = element.getBoundingClientRect();
            return (
                distance.top >= 0 &&
                distance.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            );
        };

        
        if (stickyBar) {
            window.addEventListener('scroll', () => (isInViewport(footerSocialLinks)) ? stickyBar.style.opacity = '0' : stickyBar.style.opacity = '1')
        }

        if (stickyBar) {
            window.addEventListener('load', () => (isInViewport(footerSocialLinks)) ? stickyBar.style.opacity = '0' : stickyBar.style.opacity = '1')
        }
    }
}

export default Slider
