// reviews.js - Xử lý chức năng đánh giá sản phẩm

// Lưu trữ đánh giá vào localStorage
function saveReviews(reviews) {
    localStorage.setItem('productReviews', JSON.stringify(reviews));
}

// Lấy danh sách đánh giá từ localStorage
function getReviews() {
    const reviews = localStorage.getItem('productReviews');
    return reviews ? JSON.parse(reviews) : [];
}

// Hiển thị đánh giá lên trang
function displayReviews(productId) {
    const reviews = getReviews().filter(r => r.productId === productId);
    const reviewContainer = document.getElementById('reviews-container');
    
    if (reviews.length === 0) {
        reviewContainer.innerHTML = '<p>Chưa có đánh giá nào cho sản phẩm này.</p>';
        return;
    }
    
    let html = '';
    reviews.forEach(review => {
        html += `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.comment}</p>
                </div>
            </div>
        `;
    });
    
    reviewContainer.innerHTML = html;
}

// Thêm đánh giá mới
function addReview(productId, author, rating, comment) {
    const reviews = getReviews();
    const newReview = {
        id: Date.now(),
        productId,
        author,
        rating,
        comment,
        date: new Date().toISOString()
    };
    
    reviews.push(newReview);
    saveReviews(reviews);
    displayReviews(productId);
}

// Xử lý form đánh giá
function setupReviewForm(productId) {
    const form = document.getElementById('review-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const author = document.getElementById('review-author').value;
        const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
        const comment = document.getElementById('review-comment').value;
        
        if (!author || !rating || !comment) {
            alert('Vui lòng điền đầy đủ thông tin đánh giá');
            return;
        }
        
        addReview(productId, author, rating, comment);
        form.reset();
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');
    });
}

// Khởi tạo hệ thống đánh giá cho trang sản phẩm
function initReviewSystem(productId) {
    // Thêm form đánh giá nếu chưa có
    if (!document.getElementById('review-form')) {
        const reviewSection = document.createElement('section');
        reviewSection.className = 'product-reviews';
        reviewSection.innerHTML = `
            <h3>Đánh giá sản phẩm</h3>
            <div id="reviews-container"></div>
            <form id="review-form">
                <h4>Viết đánh giá của bạn</h4>
                <div class="form-group">
                    <label for="review-author">Tên của bạn:</label>
                    <input type="text" id="review-author" required>
                </div>
                <div class="form-group">
                    <label>Đánh giá:</label>
                    <div class="rating-input">
                        <input type="radio" id="star5" name="rating" value="5"><label for="star5">★</label>
                        <input type="radio" id="star4" name="rating" value="4"><label for="star4">★</label>
                        <input type="radio" id="star3" name="rating" value="3"><label for="star3">★</label>
                        <input type="radio" id="star2" name="rating" value="2"><label for="star2">★</label>
                        <input type="radio" id="star1" name="rating" value="1"><label for="star1">★</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="review-comment">Nhận xét:</label>
                    <textarea id="review-comment" rows="4" required></textarea>
                </div>
                <button type="submit">Gửi đánh giá</button>
            </form>
        `;
        
        document.querySelector('main').appendChild(reviewSection);
    }
    
    // Hiển thị đánh giá và thiết lập form
    displayReviews(productId);
    setupReviewForm(productId);
}

// Thêm CSS cho hệ thống đánh giá
function addReviewStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .product-reviews {
            margin-top: 2rem;
            padding: 1rem;
            border-top: 1px solid #eee;
        }
        
        .review-item {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: #f9f9f9;
            border-radius: 5px;
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            align-items: center;
        }
        
        .review-author {
            font-weight: bold;
        }
        
        .review-date {
            color: #666;
            font-size: 0.9rem;
        }
        
        .review-rating {
            color: #ffc107;
        }
        
        .rating-input {
            display: flex;
            direction: rtl;
        }
        
        .rating-input input {
            display: none;
        }
        
        .rating-input label {
            cursor: pointer;
            font-size: 1.5rem;
            color: #ddd;
        }
        
        .rating-input input:checked ~ label,
        .rating-input label:hover,
        .rating-input label:hover ~ label {
            color: #ffc107;
        }
    `;
    
    document.head.appendChild(style);
}

// Khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra nếu là trang sản phẩm thì khởi tạo hệ thống đánh giá
    if (window.location.pathname.includes('products.html')) {
        // Lấy productId từ URL hoặc tham số
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 'default';
        
        addReviewStyles();
        initReviewSystem(productId);
    }
});