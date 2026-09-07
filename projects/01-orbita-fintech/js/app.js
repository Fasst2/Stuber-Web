const menu=document.querySelector('.menu'),nav=document.querySelector('.nav nav');if(menu){menu.addEventListener('click',()=>nav?.classList.toggle('open'))}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));
