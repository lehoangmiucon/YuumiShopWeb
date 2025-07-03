
// Sample data for pets
const pets = [
    {
        id: 1,
        name: "Mèo Anh lông ngắn",
        type: "cat",
        price: 5000000,
        image: "images/cats/MeoALN.jpg",
        rating: 4.5
    },

    {
        id: 2,
        name: "Chó Poodle",
        type: "dog",
        price: 7000000,
        image: "images/dogs/ChoPoodle.jpg",
        rating: 5
    },

    {
        id: 3,
        name: "Chó Alaska",
        type: "dog",
        price: 9000000,
        image: "images/dogs/ChoAlaska.jpg",
        rating: 5
    },

    {
        id: 4,
        name: "Mèo Ba Tư",
        type: "cat",
        price: 15000000,
        image: "images/cats/MeoBaTu.jpg",
        rating: 5
    },

    {
        id: 5,
        name: "Chó Shiba Inu",
        type: "dog",
        price: 12000000,
        image: "images/dogs/ChoShiba.jpg",
        rating: 4
    },

    {
        id: 6,
        name: "Chó Pug",
        type: "dog",
        price: 7000000,
        image: "images/dogs/ChoPug.jpg",
        rating: 4
    },
    // Add more pets as needed
];

// Sample reviews
const reviews = [
    {
        id: 1,
        name: "Nguyễn Ngọc Nhi",
        rating: 5,
        comment: "Thú cưng rất đẹp và khỏe mạnh, shop tư vấn nhiệt tình!"
    },
    {
        id: 2,
        name: "Trần Thị Huyền Trân",
        rating: 4,
        comment: "Giao hàng nhanh, mèo con rất dễ thương"
    }
];



// Display featured pets
function displayPets() {
    const petGrid = document.querySelector('.pet-grid');
    
    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        
        petCard.innerHTML = `
            <img src="${pet.image}" alt="${pet.name}">
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p>Giá: <span class="price">${pet.price.toLocaleString()} VND</span></p>
                <div class="rating">
                    ${'★'.repeat(Math.floor(pet.rating))}${'☆'.repeat(5 - Math.floor(pet.rating))}
                </div>
                <button onclick="addToCart(${pet.id})">Thêm vào giỏ</button>
            </div>
        `;
        
        petGrid.appendChild(petCard);
    });
}

// Display reviews
function displayReviews() {
    const reviewList = document.querySelector('.review-list');
    reviewList.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        // Format ngày tháng
        const reviewDate = review.date ? new Date(review.date) : new Date();
        const dateString = reviewDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <h4>${review.name}</h4>
                <div class="review-meta">
                    <div class="rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                    <span class="review-date">${dateString}</span>
                </div>
            </div>
            <p class="review-content">${review.comment}</p>
        `;
        
        reviewList.appendChild(reviewItem);
    });
}

// Add to cart function
function addToCart(petId) {
    const pet = pets.find(p => p.id === petId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === petId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...pet, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm ${pet.name} vào giỏ hàng!`);
}

// Hàm xử lý khi click nút "Viết Đánh Giá"
document.getElementById('add-review')?.addEventListener('click', function() {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    // Kiểm tra đăng nhập
    if (!currentUser) {
        if (confirm('Bạn cần đăng nhập để đánh giá. Chuyển đến trang đăng nhập?')) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        }
        return;
    }
    
    // Lấy thông tin user
    const user = JSON.parse(localStorage.getItem(currentUser));
    const userName = user?.name || 'Khách';
    
    // Bước 1: Nhập số sao
    const ratingInput = prompt(`Xin chào ${userName}!\nVui lòng chọn số sao (1-5):`);
    if (!ratingInput) return; // Nếu người dùng hủy
    
    const rating = Math.min(5, Math.max(1, parseInt(ratingInput) || 3));
    
    // Bước 2: Nhập nội dung
    const comment = prompt(`Đánh giá của bạn (${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}):\nVui lòng nhập nội dung đánh giá:`);
    if (!comment) return; // Nếu người dùng hủy
    
    // Thêm đánh giá mới
    const newReview = {
        id: Date.now(),
        name: userName,
        rating: rating,
        comment: comment,
        date: new Date().toISOString()
    };
    
    // Lưu vào mảng reviews và hiển thị
    reviews.push(newReview);
    saveReviewsToLocalStorage(); // Hàm lưu vào localStorage
    displayReviews();
    
    alert('Cảm ơn bạn đã đánh giá sản phẩm!');
});

// Hàm lưu đánh giá vào localStorage
function saveReviewsToLocalStorage() {
    localStorage.setItem('productReviews', JSON.stringify(reviews));
}

// Hàm load đánh giá từ localStorage
function loadReviewsFromLocalStorage() {
    const savedReviews = localStorage.getItem('productReviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    }
}

// Khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    loadReviewsFromLocalStorage();
    displayReviews();
});


// Thêm vào main.js
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const accountLink = document.getElementById('accountLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (currentUser) {
        // Đã đăng nhập
        document.querySelector('.account-dropdown a').innerHTML = `<i class="fas fa-user"></i> ${JSON.parse(localStorage.getItem(currentUser)).name}`;
        accountLink.style.display = 'block';
        logoutLink.style.display = 'block';
        document.querySelector('.dropdown-content a[href="login.html"]').style.display = 'none';
        document.querySelector('.dropdown-content a[href="register.html"]').style.display = 'none';
    } else {
        // Chưa đăng nhập
        accountLink.style.display = 'none';
        logoutLink.style.display = 'none';
        document.querySelector('.dropdown-content a[href="login.html"]').style.display = 'block';
        document.querySelector('.dropdown-content a[href="register.html"]').style.display = 'block';
    }
}

// Xử lý đăng xuất
document.getElementById('logoutLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    checkLoginStatus();
    window.location.href = 'index.html';
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayPets();
    displayReviews();
});

function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    const accountLink = document.getElementById('accountLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (currentUser) {
        // Đã đăng nhập
        const user = JSON.parse(localStorage.getItem(currentUser));
        if (user) {
            document.querySelector('.account-dropdown a').innerHTML = `<i class="fas fa-user"></i> ${user.name}`;
            accountLink.style.display = 'block';
            logoutLink.style.display = 'block';
            document.querySelector('.dropdown-content a[href="login.html"]').style.display = 'none';
            document.querySelector('.dropdown-content a[href="register.html"]').style.display = 'none';
        }
    } else {
        // Chưa đăng nhập
        accountLink.style.display = 'none';
        logoutLink.style.display = 'none';
        document.querySelector('.dropdown-content a[href="login.html"]').style.display = 'block';
        document.querySelector('.dropdown-content a[href="register.html"]').style.display = 'block';
    }
}

// Xử lý đăng xuất
document.getElementById('logoutLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("isLoggedIn");
    checkLoginStatus();
    window.location.href = 'index.html';
});

