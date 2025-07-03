// cart.js
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.querySelector('.cart-items');
    const customerInfo = document.getElementById('customerInfo');
    const proceedBtn = document.getElementById('proceed-checkout');
    const completeBtn = document.getElementById('complete-checkout');
    let appliedCoupon = null;
    let subtotal = 0;
    
    // Hiển thị giỏ hàng
    function displayCart() {
        cartItems.innerHTML = '';
        subtotal = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Giỏ hàng của bạn đang trống.</p>';
            updateSummary();
            proceedBtn.classList.add('hidden');
            return;
        }
        
        cart.forEach(item => {
            const itemTotal = (item.discount || item.price) * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>Giá: ${(item.discount || item.price).toLocaleString()} VND</p>
                    <div class="quantity">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <p>Tổng: ${itemTotal.toLocaleString()} VND</p>
                    <button class="remove-btn" onclick="removeItem(${item.id})">Xóa</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        updateSummary();
        proceedBtn.classList.remove('hidden');
    }
    
    // Cập nhật tổng kết đơn hàng
    function updateSummary() {
        document.getElementById('subtotal-amount').textContent = subtotal.toLocaleString() + ' VND';
        
        let discountAmount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percentage') {
                discountAmount = subtotal * appliedCoupon.value / 100;
            } else {
                discountAmount = appliedCoupon.value;
            }
        }
        
        document.getElementById('discount-amount').textContent = discountAmount.toLocaleString() + ' VND';
        const total = subtotal - discountAmount;
        document.getElementById('total-amount').textContent = total.toLocaleString() + ' VND';
    }
    
    // Xử lý mã giảm giá
    document.getElementById('apply-coupon').addEventListener('click', applyCoupon);

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        if (confirm('Bạn cần đăng nhập để thanh toán. Đến trang đăng nhập?')) {
            window.location.href = 'login.html?redirect=cart.html';
        }
        return;
    }
    
    // Click vào mã giảm giá có sẵn
    document.querySelectorAll('#coupon-list li').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('coupon-code').value = this.dataset.code;
            applyCoupon();
        });
    });
    
    function applyCoupon() {
        const couponCode = document.getElementById('coupon-code').value.trim();
        const couponMessage = document.getElementById('coupon-message');
        
        if (!couponCode) {
            couponMessage.innerHTML = '<p class="error-message">Vui lòng nhập mã giảm giá</p>';
            return;
        }
        
        // Kiểm tra mã giảm giá (trong thực tế nên gọi API hoặc kiểm tra từ server)
        const validCoupons = {
            'YUUMI10': { type: 'percentage', value: 10 },
            'PETLOVER15': { type: 'percentage', value: 15 },
            'FREESHIP': { type: 'fixed', value: 50000 }
        };
        
        if (validCoupons[couponCode]) {
            appliedCoupon = validCoupons[couponCode];
            couponMessage.innerHTML = `<p class="success-message">Áp dụng mã giảm giá thành công!</p>`;
            updateSummary();
        } else {
            couponMessage.innerHTML = '<p class="error-message">Mã giảm giá không hợp lệ</p>';
            appliedCoupon = null;
            updateSummary();
        }
    }
    
    // Tiến hành thanh toán
    proceedBtn.addEventListener('click', () => {
        customerInfo.classList.remove('hidden');
        proceedBtn.classList.add('hidden');
        completeBtn.classList.remove('hidden');
    });
    
    // Hoàn tất đơn hàng
    completeBtn.addEventListener('click', () => {
        const form = document.getElementById('customer-form');
        const fullname = document.getElementById('fullname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;
        
        // Validate form
        if (!fullname || !phone || !address || !paymentMethod) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        
        // Tạo đơn hàng
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            customer: { fullname, phone, address },
            paymentMethod,
            items: [...cart],
            subtotal,
            discount: appliedCoupon ? {
                code: document.getElementById('coupon-code').value,
                amount: document.getElementById('discount-amount').textContent
            } : null,
            total: document.getElementById('total-amount').textContent,
            status: 'pending'
        };
        
        // Lưu đơn hàng (trong thực tế nên gửi lên server)
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Xóa giỏ hàng
        localStorage.removeItem('cart');
        
        // Chuyển hướng đến trang cảm ơn hoặc trang chủ
        alert(`Đơn hàng #${order.id} đã được đặt thành công! Cảm ơn bạn đã mua hàng.`);
        window.location.href = 'index.html';
    });
    
    // Hiển thị giỏ hàng khi trang được tải
    displayCart();
});

// Cập nhật số lượng
function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload();
    }
}

// Xóa sản phẩm
function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
}