import Layout from '../components/layouts/Layout';
import ProductDetails from '../components/layouts/ProductDetails';
import useProducts from '../hooks/useProducts';


export default function Home() {

  const {products} = useProducts('created')

  return (
    <div className="container">
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {products.map( prod => (
                <ProductDetails key={prod.id} product={prod}></ProductDetails>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}
