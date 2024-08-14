import styled, { keyframes } from "styled-components";
import theme from "./theme";
import { Link } from "gatsby-link";
const { colors, fontSizes, fonts } = theme;

// Keyframes for the glitch animation
const glitchAnimation = keyframes`
  0% {
    clip-path: var(--slice-1);
    transform: translate(-20px, -10px);
  }
  10% {
    clip-path: var(--slice-3);
    transform: translate(10px, 10px);
  }
  20% {
    clip-path: var(--slice-1);
    transform: translate(-10px, 10px);
  }
  30% {
    clip-path: var(--slice-3);
    transform: translate(0px, 5px);
  }
  40% {
    clip-path: var(--slice-2);
    transform: translate(-5px, 0px);
  }
  50% {
    clip-path: var(--slice-3);
    transform: translate(5px, 0px);
  }
  60% {
    clip-path: var(--slice-4);
    transform: translate(5px, 10px);
  }
  70% {
    clip-path: var(--slice-2);
    transform: translate(-10px, 10px);
  }
  80% {
    clip-path: var(--slice-5);
    transform: translate(20px, -10px);
  }
  90% {
    clip-path: var(--slice-1);
    transform: translate(-10px, 0px);
  }
  100% {
    clip-path: var(--slice-1);
    transform: translate(0);
  }
`;

// Styled component for the button
const StyledButton = styled.a`
  padding: 0.5rem 1rem;
  color: ${colors.green};
  font-size: ${fontSizes.xs};
  font-family: ${fonts.SFMono};
  background: linear-gradient(45deg, transparent 5%, rgba(41, 61, 90, 0.99) 5%);
  border: 0;
  cursor: pointer;
  decoration: none;
  letter-spacing: 3px;
  line-height: 3.5rem;
  box-shadow: 6px 0px 0px #00e6f6;
  outline: transparent;
  font-weight: bold;
  position: relative;

  &::after {
    --slice-0: inset(50% 50% 50% 50%);
    --slice-1: inset(80% -6px 0 0);
    --slice-2: inset(50% -6px 30% 0);
    --slice-3: inset(10% -6px 85% 0);
    --slice-4: inset(40% -6px 43% 0);
    --slice-5: inset(80% -6px 5% 0);

    content: "Get in touch";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 3%,
      #00e6f6 3%,
      #00e6f6 5%,
      rgba(41, 61, 90, 0.99) 5%
    );
    text-shadow:
      -3px -3px 0px #f8f005,
      3px 3px 0px #00e6f6;
    clip-path: var(--slice-0);
  }

  &:hover::after {
    animation: ${glitchAnimation} 1s steps(2, end);
  }
`;

export default StyledButton;
