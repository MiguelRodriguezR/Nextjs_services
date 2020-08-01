import Head from 'next/head'
import styled from '@emotion/styled';
import Layout from '../components/layouts/Layout';
import { useRouter } from 'next/router'
import useProducts from '../hooks/useProducts';
import { useEffect, useState } from 'react';
import ProductDetails from '../components/layouts/ProductDetails';


export default function search() {

  const router = useRouter();
  const { query : {q}} = router;
  const {products} = useProducts('votes');

  const [ result, setResult] = useState([])

  useEffect(() => {
    const search = q.toLowerCase();
    const filter = products.filter( product => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      )
    })
    setResult(filter);
  },[q, products])

  return (
    <div className="container">
       <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {result.map( prod => (
                <ProductDetails key={prod.id} product={prod}></ProductDetails>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}