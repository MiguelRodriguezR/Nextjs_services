import Head from "next/head";
import styled from "@emotion/styled";
import Layout from "../components/layouts/Layout";
import Form, { Field, InputSubmit, Error } from "../components/ui/Form";
import { css } from "@emotion/core";
import useValidation from "../hooks/useValidation";
import firebase from "../firebase";
import validateCreateAccount from "../validators/validateCreateAccount";
import { useState } from "react";
import Router from 'next/router'

const INITIAL_STATE = { name: "", email: "", password: "" };

export default function CreateAccount() {

  const [error, setError] = useState(false);

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidation(INITIAL_STATE, validateCreateAccount, createAccount);

  async function createAccount() {
    try {
      await firebase.register(values.name, values.email, values.password);
      Router.push('/');
    } catch (error) {
      setError(error.message);
    }
  }

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
            Create Account
          </h1>
          <Form onSubmit={handleSubmit} noValidate>
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
              <label htmlFor="name">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
            {errors.email && <Error>{errors.email}</Error>}
            <Field className="">
              <label htmlFor="name">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
            {errors.password && <Error>{errors.password}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Create Account" />
          </Form>
        </>
      </Layout>
    </div>
  );
}
