import React, { useEffect, useState } from 'react';
import { addProduct, getAllCountries  } from '../../hooks/Products';
import { getCategories } from '../../hooks/Categories';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateOneProduct } from '../../hooks/Products';

const ProductUpload = () => {
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const { productId } = useParams();
    const [media, setMedia] = useState(null);
    const [mediaUrl, setMediaUrl] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [brand, setBrand] = useState('');
    const [condition, setCondition] = useState('Mới');
    const [origin, setOrigin] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const { categories } = getCategories();
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]); // State cho quốc gia
     const [isOtherOrigin, setIsOtherOrigin] = useState(false);
    const [otherOrigin, setOtherOrigin] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                const product = await getProductById(productId);
                if (product) {
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price);
                    setQuantity(product.quantity);
                    setBrand(product.brand);
                    setCondition(product.condition);
                    setOrigin(product.origin);
                    setSelectedCategory(product.category_id);
                    setMediaUrl(product.image_url || product.video_url); // Lấy URL từ cả hai
                }
            } else {
                resetForm();
            }
        };
        const fetchCountries = async () => {
            const countryData = await getAllCountries();
            setCountries(countryData); // Lưu danh sách quốc gia vào state
        };
         fetchCountries();
        fetchProduct();
    }, [productId]);

    const resetForm = () => {
        setMedia(null);
        setMediaUrl('');
        setName('');
        setDescription('');
        setPrice('');
        setQuantity('');
        setBrand('');
        setCondition('Mới');
        setOrigin('');
        setSelectedCategory('');
         setIsOtherOrigin(false);
        setOtherOrigin('');
    };

    const handleMediaChange = (e) => {
        const selectedMedia = e.target.files[0];
        setMedia(selectedMedia);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId && !media) {
            alert("Vui lòng chọn hình ảnh hoặc video.");
            return;
        }

        if (!name || !description || !price || !quantity || !brand || !selectedCategory) {
            alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
            return;
        }

        const formData = new FormData();
        formData.append("file", media);
        formData.append("upload_preset", "images_preset");
        formData.append("cloud_name", "dd6pnq2is");

        try {
            const uploadUrl = media.type.startsWith('image/') 
                ? 'https://api.cloudinary.com/v1_1/dd6pnq2is/image/upload' 
                : 'https://api.cloudinary.com/v1_1/dd6pnq2is/video/upload';

            const response = await fetch(uploadUrl, {
                method: "POST",
                body: formData
            });

            const uploadedMediaUrl = await response.json();
            setMediaUrl(uploadedMediaUrl.secure_url);
            let partner = userInfo.role === 'partner';
            
            const productData = {
                name,
                description,
                price,
                quantity,
                user_id: userInfo._id,
                category_id: selectedCategory,
                image_url: media.type.startsWith('image/') ? uploadedMediaUrl.secure_url : '',
                video_url: media.type.startsWith('video/') ? uploadedMediaUrl.secure_url : '',
                brand,
                condition,
                origin,
                partner,
                approve: false,
                status: true
            };

            if (productId) {
                await updateOneProduct(productId, productData);
                alert("Bạn đã chỉnh sửa sản phẩm thành công.");
            } else {
                await addProduct(productData);
                alert("Bạn đã đăng sản phẩm thành công.");
            }
            navigate(`/editSale/${userInfo._id}`);
            resetForm();
        } catch (error) {
            console.error('Error uploading media:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 mb-6 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Đăng Sản Phẩm Mới</h2>
            <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="md:w-1/2 p-4 border border-gray-300 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Chọn Hình Ảnh hoặc Video</h3>
                    <input 
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={handleMediaChange} 
                        className="mb-4 border border-gray-300 rounded p-2 w-full"
                    />
                    {media && (
                        <div>
                            <p className="text-sm text-gray-700">Đã chọn: {media.name}</p>
                            {media.type.startsWith('image/') ? (
                                <img src={URL.createObjectURL(media)} alt="Product" className="mt-2 w-full h-auto rounded"/>
                            ) : (
                                <video controls className="mt-2 w-full h-auto rounded">
                                    <source src={URL.createObjectURL(media)} type={media.type} />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    )}
                    {mediaUrl && (
                        <div>
                            {mediaUrl.endsWith('.mp4') ? (
                                <video controls className="mt-2 w-full h-auto rounded">
                                    <source src={mediaUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={mediaUrl} alt="Uploaded" className="mt-2 w-full h-auto rounded"/>
                            )}
                        </div>
                    )}
                </div>
                <div className="md:w-1/2 p-4 border border-gray-300 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Thông Tin Sản Phẩm</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                placeholder="Tên sản phẩm" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="border border-gray-300 p-2 w-full rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <textarea 
                                placeholder="Mô tả sản phẩm" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                className="border border-gray-300 p-2 w-full rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="number" 
                                placeholder="Giá" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                                className="border border-gray-300 p-2 w-full rounded"
                                required
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="number" 
                                placeholder="Số lượng" 
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)} 
                                className="border border-gray-300 p-2 w-full rounded"
                                required
                                min="1"
                            />
                        </div>
                        <div className="mb-4">
                            <input 
                                type="text" 
                                placeholder="Hãng" 
                                value={brand} 
                                onChange={(e) => setBrand(e.target.value)} 
                                className="border border-gray-300 p-2 w-full rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <select 
                                value={condition} 
                                onChange={(e) => setCondition(e.target.value)} 
                                className="border border-gray-300 p-2 w-full rounded"
                                required
                            >
                                <option value="Mới">Mới</option>
                                <option value="Đã qua sử dụng">Đã qua sử dụng</option>
                                <option value="Tái chế">Tái chế</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <select 
                                value={origin} 
                                onChange={(e) => {
                                    setOrigin(e.target.value);
                                    setIsOtherOrigin(e.target.value === 'Khác'); // Kiểm tra nếu chọn "Khác"
                                }} 
                                className="border border-gray-300 p-2 w-full rounded"
                                required
                            >
                                <option value="">Chọn xuất xứ</option>
                                {countries.map(country => (
                                    <option key={country._id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        {isOtherOrigin && ( // Hiển thị input nếu chọn "Khác"
                            <div className="mb-4">
                                <input 
                                    type="text" 
                                    placeholder="Nhập xuất xứ khác" 
                                    value={otherOrigin} 
                                    onChange={(e) => setOtherOrigin(e.target.value)} 
                                    className="border border-gray-300 p-2 w-full rounded"
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)} 
                                className="border border-gray-300 p-2 w-full rounded"
                                required
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {productId ? (
                            <div className="flex">
                                <button 
                                    className="border border-green-600 bg-gray-100 text-xl font-bold text-green-600 p-2 rounded hover:bg-gray-300 transition duration-200 w-full">
                                    Lưu
                                </button>
                                <button 
                                    onClick={() => navigate(`/editSale/${userInfo._id}`)}
                                    className="bg-blue-500 ml-6 text-white p-2 rounded hover:bg-blue-600 transition duration-200 w-full">
                                    Thoát
                                </button>
                            </div>
                        ) : (
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 w-full">
                                Đăng Sản Phẩm
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductUpload;