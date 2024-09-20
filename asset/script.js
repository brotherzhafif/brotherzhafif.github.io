// Zoom effect
function zoom(element) 
{
	console.log("full size")
	element.classList.toggle("fullsize");
	element.classList.toggle("position-absolute");
}

// Image Looping
const totalImages = 13; // Number of images (e.g., 10 images)
const indicators = document.getElementById('carouselIndicators');
const carouselItems = document.getElementById('carouselItems');

for (let i = 1; i <= totalImages; i++) {
	// Image names using incremental naming (e.g., 1.png, 2.png, etc.)
	const lowResImg = `asset/img/low-res/certificate/${i}.png`;
	const highResImg = `asset/img/high-res/certificate/${i}.png`;

	// Add carousel indicators dynamically
	const indicator = `
		<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i - 1}" ${i === 1 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${i}"></button>
	`;
	indicators.innerHTML += indicator;

	// Add carousel items dynamically
	const item = `
		<div class="carousel-item ${i === 1 ? 'active' : ''}" data-bs-interval="2000">
			<div class="w-100 d-flex flex-column align-items-center">
				<div class="karosel d-flex flex-column align-items-center">
					<img src="${lowResImg}" class="position-absolute w-100 d-block opacity-25">
					<img src="${lowResImg}" class="position-absolute h-100 d-block p-3">
					<img onclick="zoom(this)" loading="lazy" src="${highResImg}" class="position-absolute h-100 d-block p-3">
				</div>
			</div>
		</div>
	`;
	carouselItems.innerHTML += item;
}

