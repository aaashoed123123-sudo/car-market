/* =========================================
   1. تهيئة الموقع والتحقق من الجلسة
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // إنشاء عنصر الإشعار في الصفحة تلقائياً
    createToastElement();

    // --- نظام الحماية ---
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isLoginPage = document.getElementById('loginForm');

    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'login.html';
        return;
    }

    checkUserSession();

    if (document.getElementById('carsContainer')) displayCars();
    if (document.getElementById('addCarForm')) document.getElementById('addCarForm').addEventListener('submit', addCar);
    
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }
});

/* =========================================
   نظام الإشعارات الجديد (Toast System) 🔔
   ========================================= */

// دالة لإنشاء عنصر الإشعار في HTML تلقائياً
function createToastElement() {
    if (!document.getElementById('customToast')) {
        const toastDiv = document.createElement('div');
        toastDiv.id = 'customToast';
        document.body.appendChild(toastDiv);
    }
}

// دالة إظهار الإشعار (بديلة للـ Alert)
// type = 'success' (نجاح) أو 'error' (خطأ)
function showToast(message, type) {
    const toast = document.getElementById("customToast");
    
    // تحديد الأيقونة واللون حسب النوع
    let icon = type === 'success' ? '✅' : '⛔';
    
    // تنظيف الكلاسات القديمة
    toast.className = ''; 
    
    // وضع النص والأيقونة
    toast.innerHTML = `<span>${icon}</span> ${message}`;
    
    // إضافة كلاس الظهور والنوع
    toast.classList.add('show', type);

    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(function(){ 
        toast.classList.remove('show');
    }, 3000);
}

/* =========================================
   2. نظام المصادقة (Auth System)
   ========================================= */

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUser').value;
    const pass = document.getElementById('regPass').value;

    const user = { username, pass };
    localStorage.setItem('siteUser', JSON.stringify(user));

    // استبدلنا alert بـ showToast
    showToast('تم إنشاء الحساب بنجاح! قم بالدخول الآن', 'success');
    
    // تأخير بسيط للانتقال للتبويب التالي
    setTimeout(() => showLogin(), 1500);
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    const savedUser = JSON.parse(localStorage.getItem('siteUser'));

    if (savedUser && savedUser.username === username && savedUser.pass === pass) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        
        showToast(`أهلاً بك يا ${username}! جاري الدخول...`, 'success');
        
        // تأخير بسيط قبل التحويل ليرى المستخدم الرسالة
        setTimeout(() => window.location.href = 'index.html', 1500);
    } else {
        showToast('اسم المستخدم أو كلمة المرور خطأ!', 'error');
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => window.location.href = 'login.html', 1000);
}

function checkUserSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const nav = document.querySelector('header nav');
    if (!nav) return;

    if (isLoggedIn === 'true') {
        const username = localStorage.getItem('currentUser');
        nav.innerHTML = `
            <span style="margin-left:15px; font-weight:bold; color:#2c3e50;">مرحباً، ${username} 👋</span>
            <a href="add-car.html" class="btn">بيع سيارتك ➕</a>
            <a href="#" onclick="logout()" style="color:#e74c3c; margin-right:10px;">خروج</a>
        `;
    }
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginBtn').classList.add('active');
    document.getElementById('registerBtn').classList.remove('active');
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginBtn').classList.remove('active');
    document.getElementById('registerBtn').classList.add('active');
}

/* =========================================
   3. إدارة البيانات (Data Handling)
   ========================================= */

function getCars() {
    const cars = localStorage.getItem('cars');
    if (cars) {
        return JSON.parse(cars);
    } else {
        return [
            { name: "تويوتا كامري 2022", price: 25000, phone: "966500000000", img: "https://via.placeholder.com/300x200?text=Camry", desc: "فل كامل، فتحة سقف، بحالة الوكالة" },
            { name: "هيونداي سوناتا 2021", price: 21000, phone: "966500000000", img: "https://via.placeholder.com/300x200?text=Sonata", desc: "نص فل، ماشي 30 ألف كم، لون أبيض" },
            { name: "مرسيدس C200 2018", price: 35000, phone: "966500000000", img: "https://via.placeholder.com/300x200?text=Mercedes", desc: "كت AMG، وارد الجفالي" },
            { name: "فورد موستنج 2019", price: 32000, phone: "966500000000", img: "https://via.placeholder.com/300x200?text=Mustang", desc: "GT، كشف، لون أحمر مميز" },
            { name: "شيفروليه تاهو 2020", price: 50000, phone: "966500000000", img: "https://via.placeholder.com/300x200?text=Tahoe", desc: "LTZ، دبل، مراتب جلد" },
        ];
    }
}

/* =========================================
   4. العرض والإضافة
   ========================================= */

function displayCars() {
    const container = document.getElementById('carsContainer');
    const cars = getCars();
    container.innerHTML = '';

    cars.forEach((car, index) => {
        const phoneNumber = car.phone || "966500000000";
        const card = `
            <div class="car-card reveal-item" style="transition-delay: ${index * 100}ms">
                <div class="img-wrapper">
                    <img src="${car.img}" alt="${car.name}" loading="lazy">
                </div>
                <div class="car-info">
                    <h3>${car.name}</h3>
                    <p class="price">${parseInt(car.price).toLocaleString()} $</p>
                    <p>${car.desc}</p>
                    <button class="contact-btn" onclick="openModal('${car.name}', '${car.price}', '${phoneNumber}')">
                        تواصل مع البائع 📞
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });

    setupScrollAnimation();
}

function addCar(e) {
    e.preventDefault(); 
    const name = document.getElementById('carName').value;
    const price = document.getElementById('carPrice').value;
    const phone = document.getElementById('carPhone').value;
    const desc = document.getElementById('carDesc').value;
    const imageInput = document.getElementById('carImage');
    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;
            const newCar = { name, price, phone, img: base64Image, desc };
            const cars = getCars();
            cars.push(newCar);
            
            try {
                localStorage.setItem('cars', JSON.stringify(cars));
                showToast('تمت إضافة السيارة بنجاح!', 'success'); // استخدام الإشعار هنا
                setTimeout(() => window.location.href = 'index.html', 1500);
            } catch (error) {
                showToast("عذراً، الصورة كبيرة جداً!", 'error');
            }
        };
        reader.readAsDataURL(file);
    }
}

function filterCars() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.car-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        if (title.includes(query)) card.style.display = 'flex';
        else card.style.display = 'none';
    });
}

/* =========================================
   5. التفاعلات (Modal + Animation)
   ========================================= */

let currentPhoneNumber = "";
function openModal(carName, carPrice, carPhone) {
    const modal = document.getElementById('contactModal');
    document.getElementById('modalCarInfo').innerText = `${carName} - السعر: ${parseInt(carPrice).toLocaleString()} $`;
    currentPhoneNumber = carPhone; 
    document.getElementById('whatsappBtn').href = `https://wa.me/${currentPhoneNumber}`;
    document.getElementById('callBtn').href = `tel:${currentPhoneNumber}`;
    modal.style.display = "block";
}

function copyPhoneNumber() {
    navigator.clipboard.writeText(currentPhoneNumber).then(() => {
        showToast('تم نسخ الرقم بنجاح!', 'success'); // إشعار عند النسخ أيضاً
    });
}

function closeModal() { document.getElementById('contactModal').style.display = "none"; }
window.onclick = function(event) { if (event.target == document.getElementById('contactModal')) closeModal(); }

function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-item').forEach(item => observer.observe(item));
}