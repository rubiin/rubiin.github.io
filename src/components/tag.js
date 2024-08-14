import React from "react";

import { mixins } from "@styles";
import { Link } from "gatsby";
import kebabCase from "lodash/kebabCase";
import styled from "styled-components";

const StyledTag = styled.div`
  ${mixins.flexCenter};
  padding: 0.25rem 0.75rem;
  background-color: rgba(45, 212, 191, 0.1);
  border-radius: 9999px;
  font-weight: 500;
  color: rgb(94 234 212 / 1);
  margin-top: 0.5rem;
  margin-right: 0.375rem;
  font-size: 0.75rem;
`;

const TagItem = ({ text }) => (
  <StyledTag>
    <Link to={`/blog/tags/${kebabCase(text)}/`}>{text}</Link>
  </StyledTag>
);

export default TagItem;
