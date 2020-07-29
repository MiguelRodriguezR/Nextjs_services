import Head from 'next/head'
import styled from '@emotion/styled';
import Layout from '../components/layouts/Layout';
import { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../firebase';
import ProductDetails from '../components/layouts/ProductDetails';


export default function Home() {

  const [products, setProducts] = useState([]);

  const { firebase} = useContext(FirebaseContext);

  useEffect(() => {
    const getProds = () => {
      firebase.db.collection('products').orderBy('created', 'desc').onSnapshot(handleSnapshot)
    }
    getProds();
  },[]);

  function handleSnapshot(snapshot){
    const products = snapshot.docs.map( doc => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
    setProducts(products);
  }

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
