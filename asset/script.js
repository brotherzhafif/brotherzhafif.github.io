// INISIALISASI SUPABASE (GANTI DENGAN URL & KEY MILIKMU!)
const SUPABASE_URL = 'https://cequvuujxqkzguvxbpzg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TbMXWbW5nhIyUU7QlIayIg_quPVpE3g';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Fungsi untuk menarik data Profile
// Fungsi untuk menarik data Profile & Mengontrol Full-Screen Loader
async function fetchProfileData() {
	const { data, error } = await supabaseClient
		.from('me')
		.select('*')
		.limit(1)
		.single(); // Mengambil 1 baris data saja

	const globalLoader = document.getElementById('global-loader');

	if (error) {
		console.error("Gagal mengambil data profil:", error);
		// Tetap hilangkan loader jika error agar web tidak freeze selamanya
		globalLoader.style.opacity = '0';
		setTimeout(() => globalLoader.classList.add('hidden'), 700);
		return;
	}

	if (data) {
		// Suntikkan data dari database ke HTML
		document.getElementById('profile-name').innerHTML = data.name;
		document.getElementById('profile-alias').innerText = data.alias;
		document.getElementById('profile-alias').title = data.alias;
		document.getElementById('profile-role').innerHTML = data.role;
		document.getElementById('profile-org').innerText = data.organization;
		document.getElementById('profile-org').title = data.organization;
		document.getElementById('profile-desc').innerHTML = data.description;

		// Logika Progressive Image untuk Profil
		const highResUrl = data.image_url;

		// Cek apakah data gambar profil valid dari Supabase Storage
		if (highResUrl && highResUrl.includes('supabase.co')) {
			const lastDotIndex = highResUrl.lastIndexOf('.');
			const lowResUrl = highResUrl.substring(0, lastDotIndex) + '-low.webp';

			const imgLow = document.getElementById('profile-img-low');
			const imgHigh = document.getElementById('profile-img-high');
			const favicon = document.getElementById('web-favicon');

			// --- BAGIAN PENTING: KONTROL FULL-SCREEN LOADER ---
			// Ketika gambar profil versi LOW-RES (yg ukurannya kecil banget) sudah dimuat,
			// barulah kita menghilangkan layar loading hitam. Web siap dilihat.
			imgLow.onload = () => {
				globalLoader.style.opacity = '0'; // Buat layar jadi transparan halus
				setTimeout(() => globalLoader.classList.add('hidden'), 700); // Setelah 0.7s, hapus elemennya total
			};

			// Beri perintah untuk memuat gambar
			imgLow.src = lowResUrl;
			imgHigh.src = highResUrl;
			favicon.href = highResUrl; // Gunakan foto profil juga sebagai ikon web (favicon)

		} else {
			// Jika belum ada foto di database/upload gagal, langsung buka loading screen agar web tidak freeze
			globalLoader.style.opacity = '0';
			setTimeout(() => globalLoader.classList.add('hidden'), 700);
		}
	}
}
// Jalankan fungsinya saat website dibuka
fetchProfileData();

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

// Variable global untuk GLightbox agar bisa di-reload
let customLightbox;

// Fungsi Mengambil Data Achievement
async function fetchAchievements() {
	const { data, error } = await supabaseClient
		.from('posts')
		.select('*')
		.eq('type', 'achievement')
		// Sortir: order_num kecil dulu (0=pinned), lalu created_at terbaru
		.order('order_num', { ascending: true })
		.order('created_at', { ascending: false });

	if (error) {
		console.error("Gagal mengambil data achievement:", error);
		return;
	}

	renderAchievements(data);
}

// Fungsi Render HTML
function renderAchievements(posts) {
	const highlightContainer = document.getElementById('achievement-highlight');
	const drawerContainer = document.getElementById('achievement-grid-all');
	const btnShowMore = document.getElementById('btn-show-more-achievements');

	highlightContainer.innerHTML = '';
	drawerContainer.innerHTML = '';

	if (!posts || posts.length === 0) {
		highlightContainer.innerHTML = '<p class="text-neutral-500 col-span-full text-center">Belum ada achievement.</p>';
		return;
	}

	posts.forEach((post, index) => {
		const isHighlight = index < 3;
		const images = post.images || [];
		if (images.length === 0) return;

		const highResUrl = images[0];

		// Membentuk URL Low-Res secara dinamis
		const lastDotIndex = highResUrl.lastIndexOf('.');
		const lowResUrl = highResUrl.substring(0, lastDotIndex) + '-low.webp';

		const hasMultiple = images.length > 1;
		const galleryId = `gallery-${post.id}`;

		let cardHTML = `
            <div data-aos="${isHighlight ? 'fade-up' : ''}" class="bg-[#11121a] shadow-2xl rounded-lg p-3 relative flex flex-col overflow-hidden group aspect-[4/3] w-full items-center justify-center border border-transparent hover:border-neutral-600 transition-colors">
                
                <p class="z-20 relative text-center text-[12px] sm:text-[14px] lg:text-base text-white drop-shadow-md bg-black/60 px-3 py-1 rounded mb-auto mt-2">${post.title}</p>
                
                <a href="${highResUrl}" class="glightbox absolute inset-0 z-10 flex justify-center items-center cursor-zoom-in bg-neutral-800 animate-pulse" data-gallery="${galleryId}" data-title="${post.title}">
                    
                    <img src="${lowResUrl}" class="absolute inset-0 w-full h-full object-contain p-2 blur-md transition-all duration-700 ease-in-out z-0 scale-110" alt="loading..." onload="this.parentElement.classList.remove('animate-pulse')">
                    
                    <img src="${highResUrl}" class="absolute inset-0 w-full h-full object-contain p-2 opacity-0 transition-opacity duration-700 ease-in-out z-10 group-hover:scale-105" alt="${post.title}" onload="this.classList.remove('opacity-0'); this.previousElementSibling.classList.add('opacity-0');">
                    
                </a>
        `;

		// Indikator Multiple Images
		if (hasMultiple) {
			cardHTML += `
                <div class="absolute bottom-3 right-3 z-20 bg-black/80 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none flex items-center gap-1 font-mono">
                    <i class="bi bi-images"></i> ${images.length}
                </div>
            `;
			// Trik GLightbox untuk multi-gambar (high-res semua)
			for (let i = 1; i < images.length; i++) {
				cardHTML += `<a href="${images[i]}" class="glightbox hidden" data-gallery="${galleryId}" data-title="${post.title} (${i + 1}/${images.length})"></a>`;
			}
		}

		cardHTML += `</div>`;

		if (isHighlight) {
			highlightContainer.innerHTML += cardHTML;
		} else {
			drawerContainer.innerHTML += cardHTML;
		}
	});

	// Munculkan tombol Show More kalau data lebih dari 3
	if (posts.length > 3) {
		btnShowMore.classList.remove('hidden');
	}

	// Inisialisasi GLightbox baru setelah HTML selesai dirender
	if (customLightbox) customLightbox.destroy(); // Hapus yang lama kalau ada
	customLightbox = GLightbox({
		selector: '.glightbox',
		touchNavigation: true,
		loop: true,
		zoomable: true
	});
}

// Fungsi Buka Tutup Laci
function toggleAchievementDrawer() {
	const drawer = document.getElementById('achievement-drawer');
	const btn = document.getElementById('btn-show-more-achievements');

	if (drawer.classList.contains('hidden')) {
		// Buka laci
		drawer.classList.remove('hidden');
		btn.innerHTML = 'Show Less <i class="bi bi-chevron-up ml-1"></i>';
	} else {
		// Tutup laci
		drawer.classList.add('hidden');
		btn.innerHTML = 'Show More <i class="bi bi-chevron-down ml-1"></i>';
		// Auto scroll layar balik ke atas Achievement biar gak tersesat
		document.getElementById('Achievement').scrollIntoView({ behavior: 'smooth' });
	}
}

// Panggil fungsinya
fetchAchievements();	