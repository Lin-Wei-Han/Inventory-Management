const form = document.getElementById('inventoryForm');
const submitBtn = document.querySelector('.submit-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalText = submitBtn.textContent;
    submitBtn.textContent = '儲存中...';
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = '#6c757d';

    // 手動收集表單資料
    const jsonData = {
        品牌: document.getElementById('brandSelect').value,
        胎面寬: document.getElementById('widthSelect').value,
        扁平比: document.getElementById('ratioSelect').value,
        吋別: document.getElementById('sizeSelect').value,
        花紋: document.getElementById('patternInput').value.trim(),
        數量: document.getElementById('quantityInput').value.trim(),
        產地: document.getElementById('originSelect').value,
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
            form.reset();

            message.textContent = '庫存新增成功！';
            setTimeout(() => (message.textContent = ''), 3000);
        } else {
            message.style.color = '#ba5757';
            message.textContent = `錯誤：${result.message}`;
            setTimeout(() => (message.textContent = '', message.style.color = ''), 3000);

            //alert(`錯誤：${result.message}`);
        }
    } catch (error) {
        message.style.color = '#ba5757';
        message.textContent = `發送資料時發生錯誤：${error}`;
        console.error('發送資料時發生錯誤:', error);
        setTimeout(() => (message.textContent = '', message.style.color = ''), 3000);

        //alert('無法送出資料，請稍後再試！');
    } finally {

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';
    }
});
