import Head from "next/head";
import styled from "@emotion/styled";
import Layout from "../components/layouts/Layout";
import Form, { Field, InputSubmit, Error } from "../components/ui/Form";
import { css } from "@emotion/core";
import useValidation from "../hooks/useValidation";
import { FirebaseContext } from "../firebase";
import { useState, useContext } from "react";
import Router, { useRouter } from "next/router";
import validateCreateProduct from "../validators/validateCreateProduct";
import FileUploader from "react-firebase-file-uploader";
import Error404 from "../components/layouts/404";

const INITIAL_STATE = {
  name: "",
  company: "",
  image: "",
  url: "",
  description: "",
};

export default function newProduct() {
  const [nameImage, setName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlImage, setUrlImage] = useState("");

  const [error, setError] = useState(false);

  const { user, firebase } = useContext(FirebaseContext);

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidation(INITIAL_STATE, validateCreateProduct, createProduct);

  const router = useRouter();

  const { name, company, image, url, description } = values;

  async function createProduct() {
    if (!user) return router.push("/login");

    const product = {
      name,
      company,
      url,
      urlImage,
      description,
      votes: 0,
      voters: [],
      coments: [],
      created: Date.now(),
      creator: {
        id: user.uid,
        name: user.displayName
      }
    };

    firebase.db.collection("products").add(product);

    return router.push('/')
  }

  const handleUploadStart = () => {
    setProgress(0);
    setUploading(true);
  };

  const handleProgress = (progress) => setProgress({ progress });

  const handleUploadError = (error) => {
    setUploading(error);
    console.error(error);
  };

  const handleUploadSuccess = (name) => {
    setProgress(100);
    setUploading(false);
    setName(name);
    firebase.storage
      .ref("products")
      .child(name)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        setUrlImage(url);
      });
  };

  if(!user) return <Error404></Error404>

  return (
    <div className="container">
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            New Product
          </h1>
          <Form onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>General Info</legend>

              <Field className="">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field>
              {errors.name && <Error>{errors.name}</Error>}
              <Field className="">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={values.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field>
              {errors.company && <Error>{errors.company}</Error>}
              <Field className="">
                <label htmlFor="image">Image</label>
                <FileUploader
                  accept="image/*"
                  id="image"
                  name="image"
                  randomizeFilname
                  storageRef={firebase.storage.ref("products")}
                  onUploadStart={handleUploadStart}
                  onUploadError={handleUploadError}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                />
              </Field>
              <Field className="">
                <label htmlFor="url">URL</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field>
              {errors.url && <Error>{errors.url}</Error>}
            </fieldset>

            <fieldset>
              <legend>About your Product</legend>

              <Field className="">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Field>
              {errors.description && <Error>{errors.description}</Error>}
            </fieldset>

            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Create Product" />
          </Form>
        </>
      </Layout>
    </div>
  );
}
