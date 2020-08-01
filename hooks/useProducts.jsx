import React, { useContext, useState, useEffect } from 'react'
import { FirebaseContext } from '../firebase';

const useProducts = (order) => {
    const [products, setProducts] = useState([]);

    const { firebase} = useContext(FirebaseContext);

    useEffect(() => {
        const getProds = () => {
        firebase.db.collection('products').orderBy(order, 'desc').onSnapshot(handleSnapshot)
        }
        getProds();
    },[]);

    function handleSnapshot(snapshot){
        const products = snapshot.docs.map( doc => {
        return {
            ...doc.data(),
            id: doc.id,
        }
        })
        setProducts(products);
    }

    return { products };
}
 
export default useProducts;