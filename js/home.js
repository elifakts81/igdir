
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
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
});
topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/*nüfus*/
const counters = document.querySelectorAll('.counter');

const startCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;

    const step = Math.ceil(target / 60);

    const update = () => {
        count += step;

        if (count < target) {
            counter.innerText = count.toLocaleString('tr-TR');
            requestAnimationFrame(update);
        } else {
            counter.innerText = target.toLocaleString('tr-TR');
        }
    };

    update();
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.5 
});

counters.forEach(counter => {
    counter.innerText = "0"; 
    observer.observe(counter);
});


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
            zaman: "M.Ö. 800'ler", 
            baslik: "Urartu Krallığı",
            detay: " Iğdır Ovası'ndaki ilk sulama kanalları ve yerleşimlerin temeli bu dönemde atıldı.",
        },
        { 
            zaman: "11. Yüzyıl", 
            baslik: "'Selçuklu ve Saltuklu Dönemi",
            detay: "1071 Malazgirt sonrası bölge Türk-İslam kültürüyle tanışmaya başladı."
        },
        { 
            zaman: "14. - 15. Yüzyıl", 
            baslik: "Karakoyunlu Devleti",
            detay: " Iğdır'ın simgesi olan meşhur koç başlı mezar taşları bu dönemden miras kalmıştır."
        },
        { 
            zaman: "16. Yüzyıl", 
            baslik: "Osmanlı İmparatorluğu",
            detay: " Kanuni Sultan Süleyman döneminde Osmanlı topraklarına katılan bölge, stratejik bir kale görevi gördü."
        },
        {
            zaman : "14 Kasım  1920",
            baslik : "Türkiye Cumhuriyeti",
            detay : "Kazım Karabekir komutasındaki ordularla özgürlüğüne kavuşan Iğdır, 'Güneşin Doğduğu Şehir' unvanını aldı."
        }
    ];

    ticker.innerHTML = "";

    newsData.forEach((item, index) => {
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


/*efsane ve halk muzıgı kısmı*/
const wrapper = document.querySelector(".culture-wrapper");
const cards = document.querySelectorAll(".culture-card");
const closeBtn = document.getElementById("closeBtn");

const title = document.getElementById("panelTitle");
const text = document.getElementById("panelText");
const img1 = document.getElementById("img1");
const img2 = document.getElementById("img2");

const data = {
    elsanatlari: {
        title: "Geleneksel El Sanatları",
        content: [
            "Kilim",
            "Keçe",
            "Kafkas Halıları",
            "Karabağ Kilimleri",   
        ],
        images: ["../gorseller/hali.png", "../gorseller/halı.png"]
    },

    turku: {
        title: "Türküler",
        content: [
            "Iğdır’ın türküleri kimi zaman bizlere sevdaları, kimi zaman kahramanlıkları kimi zaman ise yaşanılan döneme dair izleri sunmaktadır. İşte o türüklerden birkaçı:",
            "Al Alma Allanıpdı",
            "Aman Avcı Vurma Beni",
            "Asker Olup Vatana",
            "Ben Bir Avuç Darı Olup",
            "Durnam Gelir Katar Katar",
            "Gız Yağlığın Kim Apardı",
            "Iğdır’ın Al Alması",
            "Iğdır’ın Yolları Daşdı",
            "Mezarsannıh İbrahim’i N’eyledin",
            "Öldürdüler Bey Derviş’i",
            "Turnam Gider Olsan Bizim Ellere",
            "Üzerliyim Çaddasın",
        ],
        images: ["../gorseller/turkuler.jpg", "../gorseller/türküü.jpg"]
    },

    efsane: {
        title: "Efsaneler",
        content: [
            "Şahmaran Efsanesi:",
            "Iğdır’ın Melekli Kasabası Kültepe Deliktaş mevkiinde geçen Şahmaran efsanesi, yöre halkı arasında çok bilinir. Buna göre, yılanların şahı olan Şahmaran gözleri kilometrelerce uzağı görebilen ve üstün niteliklere sahip bir yaratık olarak tanımlanır. Hikâyeye göre genç bir delikanlı olan Atabey, bir gün Şahmaran tepe etrafında yürürken bir kuyuya düşer ve burada yılanlar tarafından Şahmaran’a götürülür. Şahmaran, Atabey’in cesur ve yakışıklı oluşuna hayran kalır ve onu affeder. Zamanla Atabey serbest bırakılmak ister, fakat Şahmaran başta bunu reddeder. Efsane, padişahın amansız hastalığı ve Şahmaran’ın bilgeliğini ve gücünü konu alan dramatik olaylarla devam eder, sonunda Atabey bir yandan Şahmaran’dan öğrendiklerini sahiplenerek insanlara fayda sağlar ",
            "Ağrı Dağı Efsanesi:",
            "Iğdır’ın en ünlü simgesi olan Ağrı Dağı, birçok efsaneye konu olmuştur. Bunlardan en meşhuru Nuh’un Gemisi efsanesidir. İncil, Tevrat, Kur’an ve Sümer destanı Gılgamış’ta geçen tufan sonrası Nuh’un gemisinin Ağrı Dağı’na oturduğu inanışı bu efsaneyi oluşturur. Ayrıca halk arasında dağla ilgili zulme ve kötülüğe karşı öfkelenmesi şeklinde anlatılan yerel efsaneler bulunmaktadır ",
            "Diğer Yerel Efsaneler:",
            "Karacaoğlan Efsanesi:",
            "Ünlü halk şairi Karacaoğlan’ın Iğdır’da yaşadığı dönemi konu alır ve söylenen hikâyeler yörenin edebi mirasını yansıtır.",
            "Asenevler Efsanesi:",
            "Yedi Kardeşler olarak bilinen efsanevi bir hikâyeyi içerir ve Asenevler köyü ile ilişkilendirilir.",
            "Cızırdaklı Efsanesi:",
            "Cızırdaklı köyünde dolaşan ve Büyük Ağrı çevresinde geçen efsaneleri kapsar.",
            
        ],
        images: ["../gorseller/sahmeran.jpg", "../gorseller/ag.jpg"]
    },

    halkoyunlari: {
        title: "Halk Oyunları ve Yöresel Kıyafetler",
        content: [
            "Iğdır’ın Yöresel Kıyafetleri çevre yöreler ile benzerlik göstermekte olup başlıca giyilen kıyafetler:",
            "kaftan",
            "şalvar", 
            "kemer", 
            "poplin gömlek", 
            "yün kalpak", 
            "deri çizmedir.",
            "Iğdır’ın halk oyunlarına bakıldığında ise:",
            "Maral Oyunu",
            "Gelin Havası",
            "Şeyh Şamil Oyunu",
            "Kıskanç",
            "Vağzalı",
            "Gazağı",
            "Tamara ' dır",
        ],
            images: ["../gorseller/kafkas.png", "../gorseller/oyun.png"]
    },
};

cards.forEach(card => {
    card.addEventListener("click", () => {
        cards.forEach(c => c.classList.remove("active-card"));
        card.classList.add("active-card");

    });

});

cards.forEach(card => {
    card.addEventListener("click", () => {
        const type = card.getAttribute("data-type");
        wrapper.classList.add("active");
        title.textContent = data[type].title;
        
        text.innerHTML = data[type].content
            .map(paragraf => {
                // Eğer metin iki nokta üst üste ile bitiyorsa veya başlık niteliğindeyse kalın yapalım
                if (paragraf.endsWith(":") || paragraf === "Geleneksel El Sanatları" || paragraf.includes("Efsanesi:")) {
                    return `<h4 style="margin-top: 12px; margin-bottom: 6px; font-weight: bold; color: #1a365d;">${paragraf}</h4>`;
                }
                // Normal maddelerin başına ok işareti ekleyelim
                return `<p style="margin-left: 15px; margin-bottom: 5px;">➤ ${paragraf}</p>`;
            })
            .join("");

        img1.style.display = "block";
        img2.style.display = "block";
        img1.src = data[type].images[0];
        img2.src = data[type].images[1];
    });
});

closeBtn.addEventListener("click", () => {
    wrapper.classList.remove("active");
});


/*galeri kısmı*/
document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides =
        carousel.querySelectorAll('.slide-item');
    const prevBtn =
        carousel.querySelector('.prev-btn');
    const nextBtn =
        carousel.querySelector('.next-btn');

    let currentIndex = 0;
    // ölçüler
    const slideWidth = 300;
    // aktif merkez
    function updateCarousel(){
    slides.forEach(slide => {
            slide.classList.remove('active');
        });
        slides[currentIndex]
            .classList.add('active');
        // ORTALAMA
        const offset =
            (-currentIndex * slideWidth)
            + (window.innerWidth / 2)
            - (slideWidth / 2);

        track.style.transform =
            `translateX(${offset}px)`;
    }
    // SAĞ
    nextBtn.addEventListener('click', () => {
        currentIndex++;
        // sonsuz döngü
        if(currentIndex >= slides.length){
            currentIndex = 0;
        }
        updateCarousel();
    });

    // SOL
    prevBtn.addEventListener('click', () => {
        currentIndex--;
        // sonsuz döngü
        if(currentIndex < 0){
         currentIndex = slides.length - 1;
        }
        updateCarousel();
    });

    updateCarousel();

});
/*bıtıs*/

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


// Sayfadaki tüm elementler tamamen yüklendikten sonra kodu çalıştırır
window.addEventListener('DOMContentLoaded', () => {
    window.onscroll = function() { updateProgressBar() };

    function updateProgressBar() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
        
        var bar = document.getElementById("progressBar");
        if (bar) {
            bar.style.width = scrolled + "%";
        }
    }
});