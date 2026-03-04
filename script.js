// ==========================
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ==========================
let cart = [];
let isLoggedIn = false;
let userDiscount = 0;
let totalRevenue = 0;
let ordersCount = 0;

// ==========================
// АНИМАЦИЯ ПОЯВЛЕНИЯ
// ==========================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('show');
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// ==========================
// НАВИГАЦИЯ
// ==========================
function showSection(id) {
    document.getElementById('main-content').style.display = (id==='main-content')?'block':'none';
    document.getElementById('account-section').style.display = (id==='account-section')?'block':'none';
}
function handleAccountClick() { isLoggedIn?showSection('account-section'):openModal('auth-modal'); }
function toggleMenu() { document.querySelector('.main-nav').classList.toggle('show'); }

// ==========================
// МОДАЛКИ
// ==========================
function openModal(id) { document.getElementById(id).style.display='flex'; }
function closeModal(id) { document.getElementById(id).style.display='none'; }
function closeAuth() { closeModal('auth-modal'); }

// ==========================
// РЕГИСТРАЦИЯ
// ==========================
function register() {
    const fn = document.getElementById('reg-fname').value;
    if(!fn) return alert("Введите имя");
    document.getElementById('user-full-name').innerText = fn;
    document.getElementById('user-initials').innerText = fn[0].toUpperCase();
    isLoggedIn = true;
    if(fn.toLowerCase()==='admin') document.getElementById('admin-panel').style.display='block';
    closeAuth(); showSection('account-section');
}
function logout() { location.reload(); }

// ==========================
// КОРЗИНА
// ==========================
function toggleCart() { const m=document.getElementById('cart-modal'); m.style.display=(m.style.display==='flex')?'none':'flex'; }
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
        const card = btn.closest('.card');
        cart.push({ name: card.getAttribute('data-name'), price: parseInt(card.getAttribute('data-price')) });
        updateCartUI(); btn.innerText="ДОБАВЛЕНО"; setTimeout(()=>btn.innerText="В КОРЗИНУ",1000);
    });
});
function updateCartUI() {
    const list=document.getElementById('cart-items'); let sum=0; list.innerHTML='';
    cart.forEach(item=>{ let p=item.price*(1-userDiscount/100); sum+=p;
        list.innerHTML+=`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #222"><span>${item.name}</span><span>${p.toLocaleString()} ₽</span></div>`;
    });
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('total-price').innerText = sum.toLocaleString();
}
function completeOrder() {
    if(cart.length===0) return alert("Корзина пуста");
    let sum=parseInt(document.getElementById('total-price').innerText.replace(/\s/g,''));
    totalRevenue+=sum; ordersCount++;
    if(document.getElementById('stat-revenue')) {
        document.getElementById('stat-revenue').innerText=totalRevenue.toLocaleString();
        document.getElementById('stat-orders').innerText=ordersCount;
    }
    alert("Заказ оформлен!"); cart=[]; updateCartUI(); toggleCart();
}

// ==========================
// ПРИВИЛЕГИИ
// ==========================
function buyPrivilege(rank, disc, price){
    if(confirm(`Активировать ${rank} за ${price} ₽?`)){
        userDiscount=disc;
        document.getElementById('current-rank').innerText=rank;
        document.getElementById('current-discount').innerText=disc+"%";
        updateCartUI();
    }
}
function adminResetStats(){ totalRevenue=0; ordersCount=0; document.getElementById('stat-revenue').innerText="0"; document.getElementById('stat-orders').innerText="0"; }
function goToContacts(e){
    if(document.getElementById('contacts-anchor')){ e.preventDefault(); document.getElementById('contacts-anchor').scrollIntoView({behavior:'smooth'}); }
}