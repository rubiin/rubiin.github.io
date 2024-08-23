import styled from "styled-components";
import theme from "./theme";


const InlineLink = styled.a`
  display: inline-block;
  text-decoration: none;
  text-decoration-skip-ink: auto;
  position: relative;
  transition: var(--transition);
  cursor: pointer;

  &:hover,
  &:focus,
  &:active {
    color: var(--green);
    outline: 0;
    &:after {
      width: 100%;
    }
  }
  &:after {
    content: "";
    display: block;
    width: 0;
    height: 1px;
    position: relative;
    bottom: 0.37em;
    background-color: var(--green);
    transition: var(--transition);
  }
`;

export default InlineLink;
