'use strict';

const menuNav = document.querySelector('.menu');
const menuBtn = document.querySelector('.menu-btn');
const menuLinks = document.querySelectorAll('.menu-item');


function menuBtnToggle() {
    if (menuBtn.classList.contains('fa-bars')) {
        menuBtn.classList.remove('fa-bars');
        menuBtn.classList.add('fa-xmark');
    } else {
        menuBtn.classList.remove('fa-xmark');
        menuBtn.classList.add('fa-bars');
    }
};
menuBtn.addEventListener('click', () => {
    menuNav.classList.toggle('active');
    menuBtnToggle();
});

menuLinks.forEach(menuLink => {
    menuLink.addEventListener('click', () => {
        menuNav.classList.remove('active');
        menuBtnToggle();
    });
});

const body = document.querySelector('body');
const header = document.querySelector('.header-top')

body.addEventListener('scroll', () => {
    header.classList.add('.header-top--fixed:before');
})


// TEST ZONE

const outBtn = document.querySelector('.out-btn');
outBtn.addEventListener('click', ()=>{
    alert('SHOW ME THE MONEY !');
})


    





