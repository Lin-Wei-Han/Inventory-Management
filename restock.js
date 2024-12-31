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

// 新增出貨

const submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', async function () {
    if (!user_id) {
        alert('User ID 尚未載入，請稍後再試！');
        return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = '儲存中...';
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = '#6c757d';


    // 手動收集表單資料
    const jsonData = {
        mode: 'plus',
        user_id: user_id,
        action: '進貨',
        品牌: document.getElementById('brand').textContent.trim(),
        規格: document.getElementById('format').textContent.trim(), //胎面寬/扁平比 吋別 花紋
        胎面寬: document.getElementById('width').textContent.trim(),
        扁平比: document.getElementById('ratio').textContent.trim(),
        吋別: document.getElementById('size').textContent.trim(),
        花紋: document.getElementById('pattern').textContent.trim(),
        數量: document.getElementById('quantityInput').value.trim(),
        週期年份: document.getElementById('yearInput').value.trim(),
        產地: document.getElementById('origin').textContent.trim(),
        備註: document.getElementById('descriptionInput').value.trim(),
    };

    console.log('JSON Data:', jsonData); // 確認 JSON 資料

    const message = document.getElementById('message');

    try {
        const response = await fetch(
            'https://script.google.com/macros/s/AKfycbyUYdczYqNhyeYqLHhq1epvFtrgk4BKGXt2C7BPxH8_N4OHMhzUcbjpIpxSzcIioola/exec',
            {
                method: 'POST',
                body: JSON.stringify(jsonData)
            }
        );

        const result = await response.json();
        if (result.status === 'success') {
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

                    message.textContent = '進貨紀錄新增成功！';
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
            }
        } else {
            message.style.color = '#ba5757';
            message.textContent = `錯誤：${result.message}`;
            setTimeout(() => (message.textContent = '', message.style.color = ''), 3000);

            //alert(`錯誤：${result.message}`);
        }
    } catch (error) {
        message.style.color = '#ba5757';
        message.textContent = `發送資料時發生錯誤：${error}`;
        setTimeout(() => (message.textContent = '', message.style.color = ''), 3000);

        //alert('無法送出資料，請稍後再試！');
    } finally {

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';
    }
});

