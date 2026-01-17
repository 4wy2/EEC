import streamlit as st
import easyocr
import numpy as np
from PIL import Image
import json
import re

st.set_page_config(layout="centered")
st.markdown("<style>#MainMenu, footer, header {visibility: hidden;} .stApp {background-color: transparent;}</style>", unsafe_allow_html=True)

st.write("### ⚡ معالج الجداول الهندسية")
uploaded_file = st.file_uploader("", type=['png', 'jpg', 'jpeg'])

if uploaded_file:
    image = Image.open(uploaded_file)
    reader = easyocr.Reader(['en'])
    # قراءة الصورة وتحويلها لنص مرتب
    results = reader.readtext(np.array(image), detail=0)
    full_text = " ".join(results)
    
    # قائمة الفترات المعتمدة في موقعك
    valid_slots = ['44', '47', '51', '52', '54', '63', '80', '86']
    
    # استخراج المواد (مثل EE 202, MA 203)
    course_pattern = r'([A-Z]{2,}\s?\d{3})'
    courses_found = re.findall(course_pattern, full_text)
    
    # بناء بيانات الجدول
    final_data = []
    
    # منطق البحث: لكل مادة وجدناها، نبحث عن الفترات التي تليها
    text_blocks = " ".join(results)
    for course in set(courses_found):
        # نبحث عن النص الذي يلي اسم المادة مباشرة
        start_index = text_blocks.find(course)
        sub_text = text_blocks[start_index:start_index+150] # نأخذ مساحة كافية بعد المادة
        
        # استخراج أي رقم فترة موجود في هذا النطاق
        slots_in_subtext = [s for s in valid_slots if s in sub_text]
        
        if slots_in_subtext:
            final_data.append({
                'course': course,
                'slots': list(set(slots_in_subtext))
            })

    if final_data:
        js_payload = json.dumps({'type': 'FINAL_SYNC', 'data': final_data})
        st.components.v1.html(f"<script>window.parent.postMessage({js_payload}, '*');</script>", height=0)
        st.success(f"تم استخراج {len(final_data)} مواد بنجاح!")
    else:
        st.error("لم يتم التعرف على البيانات. تأكد أن الصورة واضحة وتحتوي على رموز المواد (مثل EE).")
