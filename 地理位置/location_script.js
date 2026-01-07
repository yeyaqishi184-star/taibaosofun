window.onload = function() {
    // 初始校正
    setTimeout(realign, 300);
    
    const pendingMessage = localStorage.getItem('pendingToast');
    if (pendingMessage) {
        showLocationToast(pendingMessage);
        localStorage.removeItem('pendingToast');
    }
};

function realign() {
    if (typeof imageMapResize === 'function') {
        imageMapResize();
    }
}

function showTooltip(e, text) {
    const tooltip = document.getElementById('map-tooltip');
    if (!tooltip) return;
    tooltip.innerHTML = text;
    tooltip.style.display = 'block';
    // 使用 pageX/Y 確保跟隨滑鼠
    tooltip.style.left = (e.pageX + 15) + 'px';
    tooltip.style.top = (e.pageY + 15) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('map-tooltip');
    if (tooltip) tooltip.style.display = 'none';
}

/**
 * 徹底解決右偏位移的換圖邏輯
 */
function switchToTaibao() {
    const mapImg = document.getElementById('main-map');
    if (!mapImg) return;

    mapImg.style.opacity = '0';
    mapImg.src = '太保行政圖.png';
    mapImg.setAttribute('usemap', '#taibao-detail-map');

    mapImg.onload = function() {
        mapImg.style.opacity = '1';
        // 三階段強制校正，防止位移
        realign();              // 立即校正
        setTimeout(realign, 100); // 100ms 後校正
        setTimeout(realign, 400); // 400ms 後最終校正
    };
}

function goToAttraction(name, url) {
    localStorage.setItem('pendingToast', `${name}<br>跳轉成功`);
    window.location.href = url;
}

function showLocationToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerHTML = message;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }
}