
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