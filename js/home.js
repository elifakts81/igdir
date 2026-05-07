
//hava durumu
const apiKey = "6a6ba08349eb9b5361221b01cbe8401d"; 
const city = "Iğdır";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`;

async function getWeather() {
  try {
        const response = await fetch(url);
        const data = await response.json();
        document.getElementById('temp').innerText = Math.round(data.main.temp) + "°C";

        const icon = data.weather[0].icon;
        const desc = data.weather[0].description;
        
        document.getElementById('description').innerHTML = `
            | ${desc} 
            <img src="https://openweathermap.org/img/wn/${icon}.png" 
                 style="vertical-align: middle; width: 30px;">`;
                 
    } catch (error) {
        console.log("Hava durumu yüklenemedi", error);
        document.getElementById('temp').innerText = "Hata!";
    }
}
getWeather();

//namaz vakitleri
async function getNamazVakitleri() {
    const city = "Iğdır";
    const country = "Turkey";
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=13`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const timings = data.data.timings;
        document.getElementById('imsak').innerText = timings.Fajr;
        document.getElementById('gunes').innerText = timings.Sunrise;
        document.getElementById('ogle').innerText = timings.Dhuhr;
        document.getElementById('ikindi').innerText = timings.Asr;
        document.getElementById('aksam').innerText = timings.Maghrib;
        document.getElementById('yatsi').innerText = timings.Isha;

    } catch (error) {
        console.log("Namaz vakitleri alınamadı:", error);
    }
}
getNamazVakitleri();

// Yukarı kaydırma butonu
const mybutton = document.getElementById("backToTop");


window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}


function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Yumuşak kayma efekti
    });
}

//nüfus sayımı
const counters = document.querySelectorAll('.counter');
const speed = 200; 

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target'); 
        const count = +counter.innerText.replace(/\./g, '');
        const inc = target / speed;

        if (count < target) {
        
            counter.innerText = Math.ceil(count + inc).toLocaleString('tr-TR');
            setTimeout(updateCount, 1);
        } else {
        
            counter.innerText = target.toLocaleString('tr-TR');
        }
    };

    updateCount();
});
// Sayfa yüklendiğinde yorumları otomatik listele
document.addEventListener('DOMContentLoaded', function() {
    listeleYorumlarKullanici();
    listeleYorumlarAdmin();
});

// 1. Yeni Yorum Ekleme Fonksiyonu
function yorumEkle() {
    const input = document.getElementById('commentInput');
    const yorumText = input.value;
    
    // Kullanıcı giriş yapmışsa ismini al, yapmamışsa "Anonim" yaz
    const kullanici = localStorage.getItem('username') || "Anonim";

    if (yorumText.trim() === "") {
        alert("Lütfen boş bir yorum göndermeyin!");
        return;
    }

    // Mevcut yorumları LocalStorage'dan çek
    let yorumlar = JSON.parse(localStorage.getItem('tumYorumlar')) || [];
    
    // Yeni yorum objesini oluştur (Beğeni sayıları 0'dan başlar)
    const yeniYorum = {
        isim: kullanici,
        mesaj: yorumText,
        likes: 0,
        dislikes: 0,
        tarih: new Date().toLocaleString('tr-TR') // Ne zaman yazıldığını da ekleyelim
    };
    
    yorumlar.push(yeniYorum);
    
    // Güncel listeyi kaydet ve ekrana bas
    localStorage.setItem('tumYorumlar', JSON.stringify(yorumlar));
    input.value = ""; 
   listeleYorumlarKullanici();
}

// 2a. Kullanıcı Sayfası İçin Listeleme (Sil butonu YOK)
function listeleYorumlarKullanici() {
    const list = document.getElementById('commentList');
    if (!list) return;

    const yorumlar = JSON.parse(localStorage.getItem('tumYorumlar')) || [];
    
    list.innerHTML = yorumlar.map((y, index) => `
        <div class="comment-item">
            <div style="display:flex; justify-content: space-between;">
                <strong>👤 ${y.isim}</strong>
                <small style="color: gray;">${y.tarih || ''}</small>
            </div>
            <p style="margin: 8px 0;">${y.mesaj}</p>
            <div class="comment-actions">
                <button onclick="etkilesimYap(${index}, 'like')">👍 ${y.likes || 0}</button>
                <button onclick="etkilesimYap(${index}, 'dislike')">👎 ${y.dislikes || 0}</button>
            </div>
        </div>
    `).join('');
}

// 2b. Admin Paneli İçin Listeleme (Sil butonu VAR)
// home.js içindeki fonksiyonu şuna güncelle:
function listeleYorumlarAdmin() {
    const list = document.getElementById('adminCommentList');
    if (!list) return;

    const yorumlar = JSON.parse(localStorage.getItem('tumYorumlar')) || [];
    
    // innerHTML içeriğini tablo satırlarına (tr) dönüştürüyoruz
    list.innerHTML = yorumlar.map((y, index) => `
        <tr>
            <td><strong>👤 ${y.isim}</strong></td>
            <td>${y.mesaj}</td>
            <td><small>${y.tarih || ''}</small></td>
            <td>
                <button onclick="yorumuSil(${index})" class="btn-sil">Kalıcı Sil</button>
            </td>
        </tr>
    `).join('');
}

// 3. Beğenme ve Beğenmeme Fonksiyonu
function etkilesimYap(index, tip) {
    let yorumlar = JSON.parse(localStorage.getItem('tumYorumlar')) || [];
    
    if (tip === 'like') {
        yorumlar[index].likes = (yorumlar[index].likes || 0) + 1;
    } else if (tip === 'dislike') {
        yorumlar[index].dislikes = (yorumlar[index].dislikes || 0) + 1;
    }
    
    // Veriyi güncelle ve sayfayı yenilemeden listeyi tazele
    localStorage.setItem('tumYorumlar', JSON.stringify(yorumlar));
   listeleYorumlarKullanici();
}
// 4. Admin Yorum Silme Fonksiyonu
function yorumuSil(index) {
    if (confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
        // 1. Mevcut yorumları çek
        let yorumlar = JSON.parse(localStorage.getItem('tumYorumlar')) || [];
        
        // 2. Belirlenen index'teki yorumu diziden çıkar
        yorumlar.splice(index, 1);
        
        // 3. Güncel listeyi tekrar kaydet
        localStorage.setItem('tumYorumlar', JSON.stringify(yorumlar));
        
        // 4. Ekranı yenile
        listeleYorumlar();
        listeleYorumlarAdmin();
    }
}

/*haberlerin gelecegi fonksiyon*/
async function getZigzagNews() {
    const ticker = document.getElementById('zigzagTicker');
    
    // Elindeki gerçek ve güncel verilerle burayı güncelliyoruz
    const newsData = [
        { 
            zaman: "Eylül 2025", 
            baslik: "Doğu Anadolu'nun İlk Biyolojik Çeşitlilik Merkezi",
            detay: "Iğdır Üniversitesi bünyesinde kurulan merkez, bölgedeki endemik bitki türlerini ve yaban hayatını koruma altına aldı.",
        },
        { 
            zaman: "Haziran 2025", 
            baslik: "'Tek Millet İki Devlet' Karayolu Projesi",
            detay: "Iğdır ile Nahçıvan arasındaki ulaşımı kolaylaştıracak yeni modernize edilmiş karayolu projesinde sona yaklaşıldı."
        },
        { 
            zaman: "Haziran 2024", 
            baslik: "Iğdır Kayısısı Avrupa Birliği Yolunda",
            detay: "Iğdır’ın meşhur sofralık kayısısı için yapılan coğrafi işaret tescil çalışmaları, Avrupa Birliği standartlarına taşındı."
        },
        { 
            zaman: "Temmuz 2024", 
            baslik: "Tuzluca Tuz Mağaraları'nda Uluslararası Konser",
            detay: "Binlerce yıllık tuz mağaralarının akustiğinde gerçekleştirilen senfoni konseri, yerli ve yabancı turistlerden yoğun ilgi gördü."
        }
    ];

    ticker.innerHTML = "";

    newsData.forEach((item, index) => {
        // Çizimindeki gibi bir aşağı bir yukarı yapmak için mod kullanıyoruz
        const positionClass = (index % 2 === 0) ? "down" : "up";

        const html = `
            <div class="news-item-z ${positionClass}">
                <div class="news-content">
                    <p class="news-time">${item.zaman}</p>
                    <h4 class="news-title">${item.baslik}</h4>
                    <p class="news-detail" style="font-size: 0.8rem; opacity: 0.8;">${item.detay}</p>
                </div>
            </div>
        `;
        ticker.innerHTML += html;
    });
}

document.addEventListener('DOMContentLoaded', getZigzagNews);

document.addEventListener('DOMContentLoaded', getZigzagNews);
// Modal penceresini açar
function modalAc() {
    document.getElementById('loginModal').style.display = 'flex';
}

// Modal penceresini kapatır
function modalKapat() {
    document.getElementById('loginModal').style.display = 'none';
}

// Giriş bilgilerini kontrol eden ana fonksiyon
function sorgulaVeGirisYap() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // YÖNETİCİ KONTROLÜ
    if (user === "admin" && pass === "1234") {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('aktifKullanici', 'Yönetici');
        alert("Yönetici girişi başarılı! Panale gidiyorsunuz...");
        window.location.href = "admin.html"; // Seni admin sayfasına uçurur
    } 
    // NORMAL KULLANICI KONTROLÜ
    else if (user.trim() !== "") {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('aktifKullanici', user);
        alert("Hoş geldin, " + user);
        modalKapat();
        location.reload(); // Sayfayı yenile ki sistem seni tanısın
    } else {
        alert("Lütfen bir kullanıcı adı girin!");
    }
}
// Giriş ve Kayıt alanları arasında geçiş yapar
function alanDegistir(hedef) {
    if(hedef === 'register') {
        document.getElementById('loginArea').style.display = 'none';
        document.getElementById('registerArea').style.display = 'block';
    } else {
        document.getElementById('loginArea').style.display = 'block';
        document.getElementById('registerArea').style.display = 'none';
    }
}

// Yeni Kullanıcı Kaydetme
function kayitOl() {
    const user = document.getElementById('regUser').value;
    const pass = document.getElementById('regPass').value;

    if (user === "" || pass === "") {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    let kullanicilar = JSON.parse(localStorage.getItem('kullanicilar')) || [];
    
    // Aynı isimde kullanıcı var mı kontrolü
    if (kullanicilar.find(u => u.username === user)) {
        alert("Bu kullanıcı adı zaten alınmış!");
        return;
    }

    kullanicilar.push({ username: user, password: pass, role: 'user' });
    localStorage.setItem('kullanicilar', JSON.stringify(kullanicilar));
    
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    alanDegistir('login');
}

// Giriş Yapma
function girisYap() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    // Önce Admin mi diye bak
    if (user === "admin" && pass === "1234") {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('aktifKullanici', 'Yönetici');
        window.location.href = "admin.html";
        return;
    }

    // Kayıtlı kullanıcıları kontrol et
    let kullanicilar = JSON.parse(localStorage.getItem('kullanicilar')) || [];
    const bulunan = kullanicilar.find(u => u.username === user && u.password === pass);

    if (bulunan) {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('aktifKullanici', user);
        alert("Hoş geldin, " + user);
        location.reload();
    } else {
        alert("Kullanıcı adı veya şifre hatalı!");
    }
}
// Hata mesajını şık bir şekilde gösteren yardımcı fonksiyon
function hataGoster(mesaj) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.innerText = mesaj;
    errorDiv.style.display = 'block';

    // 3 saniye sonra mesajın kendi kendine kaybolmasını istersen:
    /*
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
    */
}

function girisYap() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem('userRole', 'admin');
        window.location.href = "admin.html";
        return;
    }

    let kullanicilar = JSON.parse(localStorage.getItem('kullanicilar')) || [];
    const bulunan = kullanicilar.find(u => u.username === user && u.password === pass);

    if (bulunan) {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('aktifKullanici', user);
        window.location.reload(); 
    } else {
        // İŞTE BURADA: Standart alert yerine bizim şık kutuyu çağırıyoruz
        hataGoster("Kullanıcı adı veya şifre hatalı!");
    }
}

