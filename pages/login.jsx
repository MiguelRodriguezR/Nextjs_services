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

const INITIAL_STATE = { email: "", password: "" };

export default function login() {

  const [error, setError] = useState(false);

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useValidation(INITIAL_STATE, validateCreateAccount, login);

  async function login() {
    try {
      const user = await firebase.login(values.email, values.password);
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
            LogIn
          </h1>
          <Form onSubmit={handleSubmit} noValidate>
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
            <InputSubmit type="submit" value="Login" />
          </Form>
        </>
      </Layout>
    </div>
  );
}
