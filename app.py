window.addEventListener('message', function(event) {
    if (event.data.type === 'ocr_result') {
        const { slots, course, auto_save } = event.data;
        
        // 1. وضع اسم المادة في الخانة
        document.getElementById("courseName").value = course;
        
        // 2. اختيار يوم الأحد كافتراضي (أو يمكنك تطويره لاحقاً)
        let dayIdx = 0; 
        if (!currentSelectedDays.has(dayIdx)) {
            currentSelectedDays.set(dayIdx, new Set());
        }
        
        // 3. إضافة الفترات
        slots.forEach(id => currentSelectedDays.get(dayIdx).add(id));

        // 4. الحفظ التلقائي إذا طلب البايثون ذلك
        if (auto_save) {
            setTimeout(() => {
                saveEntry(); // استدعاء دالة الحفظ التي برمجناها سابقاً
            }, 500); // تأخير بسيط لضمان تحديث الواجهة
        }
    }
});
