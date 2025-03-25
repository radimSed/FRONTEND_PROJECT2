const icon = document.querySelector('.fa-circle-up') as HTMLAnchorElement;

addEventListener('scroll', (e) => {
    if(window.scrollY > window.innerHeight * 0.5){
        icon.style.display = 'block';
    }else{
        icon.style.display = 'none';
    }
});
