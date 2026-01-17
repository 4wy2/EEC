import streamlit as st
import easyocr
import numpy as np
from PIL import Image
import json

# إعداد الصفحة لتكون نظيفة داخل موقعك
st.set_page_config(layout="centered")

# تنسيق الواجهة وإخفاء القوائم الجانبية
st.markdown("""
    <style>
    .stApp { background-color: #f8fafc; }
    #MainMenu, footer, header {visibility: hidden;}
    .stFileUploader {padding-top: 0;}
    </style>
""", unsafe_allow_html=True)

st.write("### 📸 قارئ الجدول الذكي")
uploaded_file = st.file_uploader("ارفع صورة الجدول لاستخراج الفترات", type=['png', 'jpg', 'jpeg'])

if uploaded_file:
    with st.spinner('جاري تحليل الصورة...'):
        image = Image.open(uploaded_file)
        # تحميل القارئ (يدعم الإنجليزية لجدول الجامعة)
        reader = easyocr.Reader(['en'])
        results = reader.readtext(np.array(image))
        
        # الفترات المستهدفة في نظامك
        valid_slots = ['54', '86', '44', '80', '47', '63', '52', '51']
        found_slots = list(set([res[1] for res in results if res[1] in valid_slots]))
        
        if found_slots:
            st.success(f"✅ تم اكتشاف الفترات: {', '.join(found_slots)}")
            
            # إرسال البيانات إلى موقعك (الـ Parent) تلقائياً
            js_payload = json.dumps({'type': 'ocr_result', 'slots': found_slots})
            st.components.v1.html(f"""
                <script>
                    window.parent.postMessage({js_payload}, '*');
                </script>
            """, height=0)
        else:
            st.warning("⚠️ لم يتم العثور على أرقام فترات واضحة.")
