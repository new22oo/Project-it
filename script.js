const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbxPgXB4whfE-P6kX3S0OZzaIHd3q6bavbAxr2pVc0-F5lWaxVrwp-kS6yCL-mmPzm1o4Q/exec";

document.addEventListener("DOMContentLoaded", function() {
    // ฟังก์ชัน Slider Priority
    const priorityInput = document.getElementById('priority');
    if (priorityInput) {
        priorityInput.addEventListener('input', () => {
            document.getElementById('priorityValue').textContent = priorityInput.value;
        });
    }

    // ฟังก์ชันส่งข้อมูล (หน้า index.html)
    const repairForm = document.getElementById('repairForm');
    if (repairForm) {
        repairForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            fetch(GOOGLE_SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data)
            }).then(() => {
                alert('บันทึกข้อมูลเรียบร้อย!');
                repairForm.reset();
            }).catch(err => alert('Error: ' + err));
        });
    }

    // ฟังก์ชันดึงข้อมูล (หน้า status.html และ dashboard.html)
    if (document.getElementById('statusList') || document.getElementById('stat-total')) {
        fetch(GOOGLE_SHEET_URL)
            .then(res => res.json())
            .then(data => {
                const statusList = document.getElementById('statusList');
                if (statusList) {
                    statusList.innerHTML = data.map(req => `
                        <tr>
                            <td>${req.computerType} (${req.serialNumber})</td>
                            <td>${req.date}</td>
                            <td><span class="badge">${req.status || 'รอรับเรื่อง'}</span></td>
                        </tr>`).join('');
                }
                if (document.getElementById('stat-total')) {
                    document.getElementById('stat-total').innerText = data.length;
                }
            });
    }
});