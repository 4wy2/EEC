import streamlit as st
import easyocr
import numpy as np
from PIL import Image
import json

st.set_page_config(layout="centered")
st.markdown("<style>#MainMenu, footer, header {visibility: hidden;} .stApp {background-color: transparent;}</style>", unsafe_allow_html=True)

st.write("### ⚡ بناء الجدول الفوري")
uploaded_file = st.file_uploader("", type=['png', 'jpg', 'jpeg'])

if uploaded_file:
    image = Image.open(uploaded_file)
    reader = easyocr.Reader(['en'])
    # استخراج النصوص مع إحداثياتها (bbox)
    results = reader.readtext(np.array(image))
    
    final_schedule = []
    # تعريف حدود الأعمدة التقريبية (بناءً على تصميم جدول الجامعة الرسمي)
    # الأحد: Sun, الاثنين: Mon... الخ
    days_mapping = {0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu"}
    valid_slots = ['44', '47', '51', '52', '54', '63', '80', '86']

    for i, (bbox, text, prob) in enumerate(results):
        # إذا وجدنا رقم فترة
        clean_text = "".join(filter(str.isdigit, text))
        if clean_text in valid_slots:
            x_center = (bbox[0][0] + bbox[1][0]) / 2
            
            # محاولة العثور على اسم المادة في نفس السطر (بالرجوع للخلف في النتائج)
            course_name = "Unknown"
            for k in range(i, 0, -1):
                if any(code in results[k][1].upper() for code in ['EE', 'MA', 'ESP', 'PHYS']):
                    course_name = results[k][1].upper()
                    break
            
            # تحديد اليوم بناءً على إحداثيات X (توزيع أعمدة الجدول)
            # هذه الحسبة موزونة لجدول الجامعة اللي في صورتك
            img_width = image.size[0]
            x_rel = x_center / img_width
            
            day_idx = 0
            if x_rel < 0.45: day_idx = 0 # Sun
            elif x_rel < 0.53: day_idx = 1 # Mon
            elif x_rel < 0.61: day_idx = 2 # Tue
            elif x_rel < 0.70: day_idx = 3 # Wed
            else: day_idx = 4 # Thu

            final_schedule.append({
                'day': day_idx,
                'slot': clean_text,
                'course': course_name
            })

    if final_schedule:
        js_payload = json.dumps({'type': 'DIRECT_BUILD', 'entries': final_schedule})
        st.components.v1.html(f"<script>window.parent.postMessage({js_payload}, '*');</script>", height=0)
        st.success(f"تم تحليل {len(final_schedule)} محاضرات بنجاح!")
