"use strict";
const icon = document.querySelector('.fa-circle-up');
addEventListener('scroll', (e) => {
    if (window.scrollY > window.innerHeight * 0.5) {
        icon.style.display = 'block';
    }
    else {
        icon.style.display = 'none';
    }
});
