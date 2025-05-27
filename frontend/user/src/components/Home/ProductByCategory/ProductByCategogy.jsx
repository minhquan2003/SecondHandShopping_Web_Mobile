import {getProductByCategory} from '../../../hooks/Products';
import { useParams } from 'react-router-dom';
import ListProductCard from '../ListProducts/ListProductCard'
import BackButton from '../../../commons/BackButton'
// import ListCategories from '../Categories/ListCategories'
import { getCategoryDetailByCategoryId } from '../../../hooks/Categories';

const ProductByCategogy = () => {   
    const { categoryId } = useParams();
    const { products, loading, error } = getProductByCategory(categoryId);
    const { categoryDetail, loadings, errors } = getCategoryDetailByCategoryId(categoryId);

    return(
        <div className="p-5 min-h-screen">
            <div className="flex items-center mb-4">
                <BackButton />
                {/* <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1> */}
            </div>
            {/* <ListCategories /> */}
            <div className="w-screen h-auto flex flex-col justify-center items-center bg-main overflow-x-hidden">
                <div className="mb-4">
                    <label htmlFor="categorySelect" className="mr-2">Chọn danh mục:</label>
                    <select id="categorySelect" className="border p-2 rounded">
                        {categoryDetail.map((detail) => (
                            <option key={detail._id} value={detail._id}>
                                {detail.name}
                            </option>
                        ))}
                    </select>
                </div>
                {products.length != 0 ? 
                <ListProductCard data={{ products, loading, error }} />
                : <h2 className="text-red-500 font-bold">Không còn sản phẩm cho danh mục này.</h2>
                }
                {/* <h1>Danh sách các sản phẩm của: {nameCategogy}</h1> */}
                
            </div>
        </div>
    );
}

export default ProductByCategogy;