// 使用 LIFF 初始化
let user_id;

document.addEventListener('DOMContentLoaded', function () {
    const message = document.getElementById('message');
    liff
        .init({
            liffId: '2006689406-z9kX7DDm', // 請確認此 LIFF ID 是否正確
        })
        .then(() => {
            // 獲取用戶資料
            getUserProfile();
        })
        .catch((err) => {
            // 初始化失敗的處理
            message.textContent = `LIFF initialization failed: ${err.message}`;
            setTimeout(() => liff.closeWindow(), 3000);
        });
});

// 獲取用戶資料
function getUserProfile() {
    liff
        .getProfile()
        .then((profile) => {
            message.textContent = `Success to Login`;
            setTimeout(() => (message.textContent = ''), 3000);
            user_id = profile.userId;
        })
        .catch((err) => {
            message.textContent = `Failed to get user profile: ${err.message}`;
            //setTimeout(() => liff.closeWindow(), 3000);
        });
}

// 新增庫存

const form = document.getElementById('inventoryForm');
const submitBtn = document.querySelector('.submit-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!user_id) {
        alert('User ID 尚未載入，請稍後再試！');
        return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = '儲存中...';
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = '#6c757d';

    const width = document.getElementById('widthSelect').value;
    const ratio = document.getElementById('ratioSelect').value;
    const size = document.getElementById('sizeSelect').value;
    const pattern = document.getElementById('patternSelect').value;

    // 手動收集表單資料
    const jsonData = {
        mode: 'plus',
        user_id: user_id,
        //action: '進貨',
        品牌: document.getElementById('brandSelect').value,
        規格: `${width}/${ratio} ${size}`, //胎面寬/扁平比 吋別
        胎面寬: width,
        扁平比: ratio,
        吋別: size,
        花紋: pattern,
        數量: document.getElementById('quantityInput').value.trim(),
        週期年份: document.getElementById('yearSelect').value,
        產地: document.getElementById('originSelect').value,
        備註: document.getElementById('descriptionInput').value.trim(),
    };

    const message = document.getElementById('message');

    try {
        const response_stock = await fetch(
            'https://script.google.com/macros/s/AKfycbxCG8IWdEuEPNT0I-g1AMAil1Vh9vXl9rvgjPevCU2KQbZZInylkVRNK7VhcLBIOQt7/exec',
            {
                method: 'POST',
                body: JSON.stringify(jsonData)
            }
        )
        const result_stock = await response_stock.json();

        if (result_stock.status === 'success') {
            form.reset();

            message.textContent = '庫存新增成功！';
            setTimeout(() => (message.textContent = ''), 3000);
        } else {
            message.style.color = '#ba5757';
            message.textContent = `錯誤：${response_stock.message}`;
            setTimeout(() => (message.textContent = '', message.style.color = ''), 3000);
        }
    } catch (error) {
        message.style.color = '#ba5757';
        message.textContent = `總庫存更新發生錯誤：${error}`;
        setTimeout(() => (message.textContent = '', message.style.color = ''), 3000);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';
    }
});

function setLoadingState(isLoading) {
    const selects = document.querySelectorAll('.input-group');
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');

    if (isLoading) {
        // 為選單添加 loading 效果
        selects.forEach(group => {
            const select = group.querySelector('select');
            select.parentElement.classList.add('loading-select');
        });

        // 為輸入框添加 loading 效果
        inputs.forEach(input => {
            input.parentElement.classList.add('loading-input');
        });

        // 禁用所有表單元素
        document.querySelectorAll('select, input, button').forEach(element => {
            element.disabled = true;
        });
    } else {
        // 移除 loading 效果
        selects.forEach(group => {
            const select = group.querySelector('select');
            select.parentElement.classList.remove('loading-select');
        });

        inputs.forEach(input => {
            input.parentElement.classList.remove('loading-input');
        });

        // 啟用所有表單元素（包含 .add-btn）
        document.querySelectorAll('select, input, button').forEach(element => {
            element.disabled = false;
        });
    }
}
