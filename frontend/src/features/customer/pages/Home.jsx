import { useEffect }  from 'react'
import Carousel from '../../../components/customer/Carousel'
import CategoryList from './CategoryList'
import ProductCard from './ProductCard'
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from '../../../redux/productSlice';

function Home() {
  const dispatch = useDispatch();
  const  products = useSelector((state) => state.products.products);
  const {search,category} =  useSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts()); 

  }, [dispatch]);
let heading = "All Products";

if (search) {
  heading = `Search results for "${search}"`;
} else if (category) {
  heading = `${category} Products`;
}
  return (
    <div className='w-full space-y-6 pt-27 md:pt-5'>
     <Carousel />
     <CategoryList />
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  <h2 className="text-xl md:text-2xl font-bold text-(--dark-teal) mb-4">
    {heading}
  </h2>
</div>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-28">
    {products.length > 0 ? (
        products.map((p) => <ProductCard key={p._id} product={p} />)
      ) : (
        <p className="col-span-full text-center">No matching products found</p>
      )}
     </div>
    </div>
  )
}

export default Home