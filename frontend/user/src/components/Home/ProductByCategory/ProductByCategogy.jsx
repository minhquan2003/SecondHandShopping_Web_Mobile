import {getProductByCategory} from '../../../hooks/Products';
import { useParams } from 'react-router-dom';
import ListProductCard from '../ListProducts/ListProductCard'
import BackButton from '../../../commons/BackButton'

const ProductByCategogy = () => {   
    const { categoryId } = useParams();
    const { products, loading, error } = getProductByCategory(categoryId);
    return(
        <div className="p-5 min-h-screen">
            <div className="flex items-center mb-4">
                <BackButton />
                {/* <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1> */}
            </div>
        <div className="w-screen h-auto flex flex-col justify-center items-center bg-main overflow-x-hidden">
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