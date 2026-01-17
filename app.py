import streamlit as st
import easyocr
import numpy as np
from PIL import Image
import json
import re

st.set_page_config(layout="centered")
st.markdown("<style>#MainMenu, footer, header {visibility: hidden;} .stApp {background-color: #f8fafc;}</style>", unsafe_allow_html=True)

st.write("### 🚀 معالج الجدول الفوري")
uploaded_file = st.file_uploader("ارفع الجدول ليتم بناؤه فوراً", type=['png', 'jpg', 'jpeg'])

if uploaded_file:
    with st.spinner('جاري تحليل الصورة...'):
        image = Image.open(uploaded_file)
        reader = easyocr.Reader(['en'])
        results = reader.readtext(np.array(image))
        
        valid_slots = ['54', '86', '44', '80', '47', '63', '52', '51']
        found_slots = list(set([res[1] for res in results if res[1] in valid_slots]))
        
        course_name = "مادة مستخرجة"
        for (_, text, _) in results:
            if re.search(r'[A-Z]{2,}\s?\d{3}', text.upper()):
                course_name = text.upper()
                break
        
        if found_slots:
            js_payload = json.dumps({
                'type': 'ocr_result', 
                'slots': found_slots, 
                'course': course_name,
                'auto_save': True 
            })
            # هذا هو السطر الوحيد الذي يحتوي على جافاسكريبت داخل بايثون (كـ نص)
            st.components.v1.html(f"<script>window.parent.postMessage({js_payload}, '*');</script>", height=0)
            st.success("✅ تم إرسال البيانات للموقع!")
