import streamlit as st
import easyocr
import numpy as np
from PIL import Image
import json

# إعدادات الصفحة لتكون خفيفة ومناسبة للـ Iframe
st.set_page_config(layout="centered")

st.markdown("""
    <style>
    .stApp { background-color: transparent; }
    #MainMenu, footer, header {visibility: hidden;}
    </style>
""", unsafe_allow_dict=True)

st.write("### 📸 قارئ الجدول الذكي")
uploaded_file = st.file_uploader("ارفع صورة جدول الجامعة هنا", type=['png', 'jpg', 'jpeg'])

if uploaded_file:
    with st.spinner('جاري استخراج البيانات...'):
        image = Image.open(uploaded_file)
        reader = easyocr.Reader(['en'])
        results = reader.readtext(np.array(image))
        
        # قائمة الفترات التي يدعمها نظامك
        valid_slots = ['54', '86', '44', '80', '47', '63', '52', '51']
        found_slots = list(set([res[1] for res in results if res[1] in valid_slots]))
        
        if found_slots:
            st.success(f"تم اكتشاف الفترات: {', '.join(found_slots)}")
            
            # --- هذا هو الجزء السحري للربط التلقائي ---
            js_payload = json.dumps({'type': 'ocr_result', 'slots': found_slots})
            st.components.v1.html(f"""
                <script>
                    window.parent.postMessage({js_payload}, '*');
                </script>
            """, height=0)
        else:
            st.error("لم نتمكن من العثور على أرقام الفترات. تأكد من وضوح الصورة.")
