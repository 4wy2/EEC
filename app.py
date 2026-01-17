import streamlit as st
import easyocr
import numpy as np
from PIL import Image
import json

st.set_page_config(layout="centered")

# كود CSS لإخفاء عناصر ستريم ليت غير الضرورية لتبدو كأنها جزء من موقعك
st.markdown("""
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .stApp {background-color: transparent;}
    </style>
""", unsafe_allow_dict=True)

uploaded_file = st.file_uploader("ارفع صورة الجدول هنا", type=['png', 'jpg', 'jpeg'])

if uploaded_file:
    image = Image.open(uploaded_file)
    reader = easyocr.Reader(['en'])
    results = reader.readtext(np.array(image))
    
    # فلترة النتائج للحصول على الفترات فقط
    valid_slots = ['54', '86', '44', '80', '47', '63', '52', '51']
    found_slots = list(set([res[1] for res in results if res[1] in valid_slots]))
    
    if found_slots:
        # إرسال البيانات لموقعك الأساسي عبر جافاسكريبت
        js_code = f"""
            <script>
                window.parent.postMessage({{
                    'type': 'ocr_result',
                    'slots': {json.dumps(found_slots)}
                }}, '*');
            </script>
        """
        st.components.v1.html(js_code, height=0)
        st.success(f"تم التعرف على {len(found_slots)} فترات بنجاح!")
