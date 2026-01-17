import streamlit as st
import easyocr
import numpy as np
from PIL import Image
import json

st.set_page_config(layout="centered")
st.markdown("<style>#MainMenu, footer, header {visibility: hidden;} .stApp {background-color: transparent;}</style>", unsafe_allow_html=True)

st.write("### 📸 معالج الجداول المتعدد")
uploaded_file = st.file_uploader("", type=['png', 'jpg', 'jpeg'])

if uploaded_file:
    image = Image.open(uploaded_file)
    reader = easyocr.Reader(['en'])
    results = reader.readtext(np.array(image))
    
    # مصفوفة لتخزين كل المواد المكتشفة
    all_courses = []
    days_map = {'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4}
    valid_slots = ['44', '47', '51', '52', '54', '63', '80', '86']

    # منطق البحث المطور: نمر على النتائج ونبحث عن كود المادة (مثل EE 202)
    for i, (bbox, text, prob) in enumerate(results):
        upper_text = text.upper()
        # إذا وجدنا كود المادة، نبحث في نفس السطر عن الأيام والفترات
        if any(code in upper_text for code in ['EE', 'MA', 'ESP', 'PHYS']):
            course_name = upper_text
            # نبحث في النصوص التالية لهذا السطر عن الأيام والفترات
            for j in range(i+1, min(i+15, len(results))):
                sub_text = results[j][1].upper()
                # إذا وجدنا أرقام فترات
                found_slots = [s for s in valid_slots if s in sub_text]
                if found_slots:
                    # تقدير اليوم (هذا الجزء يحتاج دقة في الربط)
                    # سنرسل البيانات للموقع ليقوم هو بالفرز النهائي
                    all_courses.append({
                        'name': course_name,
                        'slots': found_slots
                    })

    if all_courses:
        js_payload = json.dumps({'type': 'ocr_full_schedule', 'data': all_courses})
        st.components.v1.html(f"<script>window.parent.postMessage({js_payload}, '*');</script>", height=0)
        st.success("✅ تم إرسال الجدول بالكامل!")
