document.addEventListener('DOMContentLoaded', function() {
    let totalBudget = 0;
    // 陣列改為儲存物件，例如: { name: "故宮南院", price: 150 }
    let selectedRoute = []; 

    const priceItems = document.querySelectorAll('.price-item');
    const addButtons = document.querySelectorAll('.add-btn');
    const routeDisplay = document.getElementById('route-display');
    const totalDisplay = document.getElementById('total-price');
    const statusHint = document.getElementById('status-hint');
    const toast = document.getElementById('toast');

    // 1. 票價選取邏輯
    priceItems.forEach(item => {
        item.addEventListener('click', function() {
            const parent = this.closest('.price-options');
            const siblings = parent.querySelectorAll('.price-item');
            siblings.forEach(sib => sib.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. 加入行程邏輯
    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.attraction-card');
            const attractionName = card.getAttribute('data-name');
            const activePrice = card.querySelector('.price-item.active');

            if (!activePrice) {
                alert("請先點選票價種類");
                return;
            }

            const priceValue = parseInt(activePrice.getAttribute('data-price'));

            // 同時更新行程名稱與價格到陣列中
            selectedRoute.push({ name: attractionName, price: priceValue });
            totalBudget += priceValue;

            // 更新介面
            updateUI();

            // Toast 提示成功
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 2000);
        });
    });

    // 3. 清除全部邏輯
    document.getElementById('clear-all').addEventListener('click', function() {
        totalBudget = 0;
        selectedRoute = [];
        priceItems.forEach(item => item.classList.remove('active'));
        updateUI();
    });

    // 4. 更新介面函式 (動態產生可點擊刪除的標籤)
    // 4. 更新介面函式 (顯示名稱 + 價錢)
    function updateUI() {
        // 清空容器
        routeDisplay.innerHTML = ""; 

        if (selectedRoute.length > 0) {
            selectedRoute.forEach((item, index) => {
                const tag = document.createElement('span');
                tag.className = 'route-tag'; 
                
                // --- 這裡修改文字顯示格式 ---
                // 判斷價錢是否為 0，若是 0 則顯示 (免費)，否則顯示 (價錢)
                const priceText = item.price === 0 ? "免費" : item.price;
                tag.textContent = `${item.name}(${priceText})`;
                
                // 點擊標籤進行刪除
                tag.onclick = function() {
                    removeSingleItem(index);
                };
                
                routeDisplay.appendChild(tag);
            });
            statusHint.textContent = `已規劃行程，目前總費用：${totalBudget}元`;
        } else {
            routeDisplay.textContent = "無";
            statusHint.textContent = "請選擇要買的票價並加入行程，總行程：無，總費用：0元";
        }
        totalDisplay.textContent = totalBudget;
    }

    // 5. 刪除單一項目邏輯
    function removeSingleItem(index) {
        // 扣除該項目的價格
        totalBudget -= selectedRoute[index].price;
        // 從陣列中移除
        selectedRoute.splice(index, 1);
        // 重新繪製 UI
        updateUI();
    }
});