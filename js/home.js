
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
    listeleYorumlar();
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
    listeleYorumlar();
}

// 2. Yorumları Ekranda Gösterme Fonksiyonu
function listeleYorumlar() {
    const list = document.getElementById('commentList');
    if(!list) return; // Eğer HTML'de commentList yoksa hata verme

    const yorumlar = JSON.parse(localStorage.getItem('tumYorumlar')) || [];
    
    list.innerHTML = yorumlar.map((y, index) => `
        <div class="comment-item" style="border-bottom: 1px solid #eee; padding: 10px; margin-bottom: 10px;">
            <div style="display:flex; justify-content: space-between;">
                <strong>👤 ${y.isim}</strong>
                <small style="color: gray;">${y.tarih || ''}</small>
            </div>
            <p style="margin: 8px 0;">${y.mesaj}</p>
            <div class="comment-actions">
                <button onclick="etkilesimYap(${index}, 'like')" style="cursor:pointer; border:none; background:none;">👍 ${y.likes || 0}</button>
                <button onclick="etkilesimYap(${index}, 'dislike')" style="cursor:pointer; border:none; background:none;">👎 ${y.dislikes || 0}</button>
            </div>
        </div>
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
    listeleYorumlar();
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




/*ilce kısmı*/
const districtData = {
    aralik: { 
        title: "Aralık", 
        text: "Üç ülkeye sınırı olan tek ilçedir. Meteor Çukuru burada yer alır. \n (Nüfus: 18.477 | Rakım: 825m)" 
    },
    karakoyunlu: { 
        title: "Karakoyunlu", 
        text: "Koç Başlı Mezarları ile ünlüdür. \n (Nüfus: 12.614 | Rakım: 847m)" 
    },
    tuzluca: { 
        title: "Tuzluca", 
        text: "Tuz Mağaraları ve sağlık turizmi merkezidir. \n (Nüfus: 21.525 | Rakım: 1.104m)" 
    },
    merkez: { 
        title: "Merkez", 
        text: "Iğdır'ın kalbi ve ekonomik merkezidir. \n (Nüfus: 152.455 | Rakım: 860m)" 
    }
};

document.querySelectorAll('.district-path').forEach(path => {
    path.addEventListener('mouseenter', function() {
        const id = this.id;
        
        // 1. Bilgi kutusunu güncelle
        document.getElementById('info-title').innerText = districtData[id].title;
        document.getElementById('info-text').innerText = districtData[id].text;
        
        // 2. Sağdaki listede ilgili ismi vurgula
        document.querySelectorAll('.district-list li').forEach(li => li.classList.remove('active-list-item'));
        document.getElementById('list-' + id).classList.add('active-list-item');
    });
});

// JS içindeki güncelleme (daha şık dursun dersen):
document.getElementById('info-text').innerHTML = districtData[id].text;