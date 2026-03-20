const totalImages = 13; // Jumlah gambar sertifikat
const carouselItems = document.getElementById('carouselItems');

carouselItems.innerHTML = '';

// 1. Masukkan gambar dulu ke dalam HTML
for (let i = 1; i <= totalImages; i++) {
	const lowResImg = `asset/img/low-res/certificate/${i}.png`;
	const highResImg = `asset/img/high-res/certificate/${i}.png`;

	const item = `
        <div class="swiper-slide w-full h-full flex justify-center items-center relative overflow-hidden bg-[#1f202b] rounded-lg">
            
            <img src="${lowResImg}" class="absolute w-full h-full object-cover opacity-25 blur-sm" alt="Background">
            
            <a href="${highResImg}" class="glightbox z-10 h-full w-full flex justify-center items-center cursor-zoom-in" data-gallery="sertifikat">
                <img loading="lazy" src="${highResImg}" class="h-full object-contain p-3 transition-transform duration-300 hover:scale-105 drop-shadow-2xl" alt="Certificate ${i} High">
            </a>
            
        </div>
    `;

	carouselItems.innerHTML += item;
}

// 2. SETELAH gambar masuk, baru inisialisasi Swiper
// Ini yang membuat autoplay bisa membaca jumlah gambar dengan benar
const swiper = new Swiper(".mySwiper", {
	spaceBetween: 30,
	effect: "slide",
	loop: true, // Looping tanpa ujung

	// Konfigurasi Autoplay (Bisa diatur waktunya)
	autoplay: {
		delay: 3000, // 3000ms = auto scroll setiap 3 detik
		disableOnInteraction: false, // Autoplay TIDAK akan mati meskipun user habis memencet/geser manual
	},

	// Konfigurasi Indikator Kotak
	pagination: {
		el: ".swiper-pagination",
		clickable: true, // MEMBUAT INDIKATOR BISA DIKLIK MENUJU INDEX TERSEBUT
	},

	// Konfigurasi Panah
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
});

// 3. Terakhir inisialisasi fitur Zoom (GLightbox)
const lightbox = GLightbox({
	selector: '.glightbox',
	touchNavigation: true,
	loop: true,
	zoomable: true
});