import React from "react";
import { css } from "@emotion/core";

const Error404 = () => {
  return (
    <h1
      css={css`
        margin-top: 5rem;
        text-align: center;
      `}
    >
      OH OH The page you are looking for doesn't exist 
    </h1>
  );
};

export default Error404;
