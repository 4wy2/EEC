import streamlit as st
import easyocr
import pandas as pd
import numpy as np
from PIL import Image

# إعدادات الصفحة
st.set_page_config(page_title="Engineering Schedule Extractor", layout="wide")
st.title("💡 مستخرج جدول الهندسة الذكي")

# تعريف الفترات بناءً على صورتك
PERIODS_MAP = {
    '54': '07:15-08:05', '86': '08:15-09:05', 
    '44': '09:15-10:05', '80': '10:15-11:05',
    '47': '12:15-13:05', '63': '13:15-14:05', 
    '52': '14:15-15:05', '51': '15:15-16:05'
}
DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']

uploaded_file = st.file_uploader("ارفع صورة الجدول (PNG/JPG)", type=['png', 'jpg', 'jpeg'])

if uploaded_file:
    img = Image.open(uploaded_file)
    st.image(img, caption='الجدول المرفوع', width=500)
    
    if st.button('ابدأ تحليل الجدول'):
        with st.spinner('جاري القراءة بذكاء... قد يستغرق دقيقة'):
            # استخدام EasyOCR للقراءة
            reader = easyocr.Reader(['en'])
            results = reader.readtext(np.array(img))
            
            # استخراج النصوص فقط
            detected_texts = [res[1] for res in results]
            
            # بناء جدول فارغ
            schedule_df = pd.DataFrame(index=PERIODS_MAP.keys(), columns=DAYS).fillna("-")
            
            # عرض البيانات المستخرجة (بشكل مبسط)
            st.subheader("البيانات المستخرجة:")
            st.write(", ".join(detected_texts))
            
            st.info("ملاحظة: يمكنك الآن نسخ هذه البيانات إلى كود HTML الخاص بك أو تعديلها.")
