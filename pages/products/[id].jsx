import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import FirebaseContext from "../../firebase/context";
import Error404 from "../../components/layouts/404";
import Layout from "../../components/layouts/Layout";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Field, InputSubmit } from "../../components/ui/Form";
import Button from "../../components/ui/Button";

const ProductContainer = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;
const ProductCreator = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Product = () => {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);
  const [coment, setComent] = useState({});
  const [getDB, setGetDB] = useState(true);

  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { user, firebase } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && getDB) {
      const getProduct = async () => {
        const productQuery = await firebase.db.collection("products").doc(id);
        const productRes = await productQuery.get();
        if (productRes.exists) {
          setProduct(productRes.data());
        } else {
          setError(true);
        }
        setGetDB(false);
      };
      getProduct();
    }
  }, [id]);

  if (Object.keys(product).length === 0 && !error) return "Loading...";

  const {
    urlImage,
    name,
    company,
    created,
    description,
    votes,
    voters,
    coments,
    url,
    creator,
  } = product;

  const voteProduct = () => {
    if (!user) {
      return router.push("/login");
    }

    const newTotalVotes = votes + 1;

    if (voters.includes(user.uid)) {
      return;
    }

    firebase.db
      .collection("products")
      .doc(id)
      .update({ votes: newTotalVotes, voters: [...voters, user.uid] });

    setProduct({
      ...product,
      votes: newTotalVotes,
    });

    setGetDB(true);
  };

  const comentChange = (e) => {
    setComent({
      ...coment,
      [e.target.name]: e.target.value,
    });
  };

  const addComent = (e) => {
    e.preventDefault();
    if (!user) {
      return router.push("/login");
    }

    const newComents = [
      ...coments,
      { ...coment, userId: user.uid, name: user.displayName },
    ];

    firebase.db.collection("products").doc(id).update({ coments: newComents });

    setProduct({ ...product, coments: newComents });
    setComent({});
    setGetDB(true);
  };

  const canDelete = () => {
    if (!user) {
      return router.push("/login");
    }
    if (user.uid === creator.id) {
      return true;
    }
    return false;
  };

  const deleteProduct = async () => {
    if (!user) {
        return router.push("/login");
      }
      if (user.uid !== creator.id) {
        return router.push("/login");
      }
    try {
      await firebase.db.collection("products").doc(id).delete();
      return router.push("/");
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <Layout>
      <>
        {error && <Error404></Error404>}
        <div className="contenedor">
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            {product.name}
          </h1>
          <ProductContainer>
            <div className="">
              <p>Posted {formatDistanceToNow(new Date(created))} ago</p>
              <p>
                Published by {creator.name} from {company}
              </p>
              <img src={urlImage} alt="" />
              <p>{description}</p>
              {user && (
                <>
                  <h2>Write a coment</h2>
                  <form onSubmit={addComent}>
                    <Field>
                      <input
                        type="text"
                        name="message"
                        onChange={comentChange}
                      />
                    </Field>
                    <InputSubmit type="submit" value="Add coment"></InputSubmit>
                  </form>
                </>
              )}
              <h2
                css={css`
                  margin: 2rem 0;
                `}
              >
                Comments
              </h2>
              {coments.length === 0 ? (
                "There's not coments yet"
              ) : (
                <ul>
                  {coments.map((coment, i) => (
                    <li
                      key={i}
                      css={css`
                        border: 1px solid #e1e1e1;
                        padding: 2rem;
                        margin-top: 2px;
                      `}
                    >
                      <p>{coment.message}</p>
                      <p>
                        written by:
                        <span
                          css={css`
                            font-weight: bold;
                          `}
                        >
                          {""} {coment.name}
                        </span>
                      </p>
                      {coment.userId === creator.id && (
                        <ProductCreator>Creator</ProductCreator>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside>
              <Button target="_blank" bgColor="true" href={url}>
                Visit URL
              </Button>

              <div
                css={css`
                  margin-top: 5rem;
                `}
              >
                <p
                  css={css`
                    text-align: center;
                  `}
                >
                  {votes} Votes
                </p>
              </div>
              {user && <Button onClick={voteProduct}>Vote</Button>}
              {canDelete() && (
                <Button onClick={deleteProduct}>Delete Product</Button>
              )}
            </aside>
          </ProductContainer>
        </div>
      </>
    </Layout>
  );
};

export default Product;
