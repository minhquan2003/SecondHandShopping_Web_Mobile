from flask import Flask, request, jsonify
import numpy as np
import requests
from PIL import Image
from io import BytesIO
from tensorflow import keras

app = Flask(__name__)
model = keras.models.load_model('saved_model.h5')

def load_image_from_url(url):
    response = requests.get(url)
    image = Image.open(BytesIO(response.content))
    image = image.resize((150, 150))  # Đảm bảo kích thước đúng
    image_array = np.array(image) / 255.0  # Chuyển đổi thành mảng numpy và chuẩn hóa
    return image_array

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    image_urls = data['image_urls']
    images = []

    for url in image_urls:
        try:
            image_array = load_image_from_url(url)
            images.append(image_array)
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    images_array = np.array(images)
    prediction = model.predict(images_array)
    predicted_classes = np.argmax(prediction, axis=1)

    # Mapping giữa lớp và ID sản phẩm
    product_mapping = {
        0: "product_id_1",
        1: "product_id_2",
        2: "product_id_3",
        # Thêm các sản phẩm khác tương ứng với lớp
    }

    # Lấy ID sản phẩm từ lớp dự đoán
    product_ids = [product_mapping[class_id] for class_id in predicted_classes]

    return jsonify({'product_ids': product_ids})

if __name__ == '__main__':
    app.run(port=5000)  # Chạy server trên cổng 5000