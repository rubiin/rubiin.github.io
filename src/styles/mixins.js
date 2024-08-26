import { css } from 'styled-components';
import theme from './theme';
import media from './media';
const { colors, fontSizes, fonts } = theme;
import styled, { keyframes } from 'styled-components';

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
const GlitchButton = styled.a`
  padding: 0.5rem 1rem;
  color: var(--green);
  font-size: var(--fz-xxs);
  font-family: var(--font-mono);
  background: linear-gradient(45deg, transparent 5%, rgba(41, 61, 90, 0.99) 5%);
  border: 0;
  border-radius: ${theme.borderRadius};
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

    content: 'Get in touch';
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

const button = styled.button`
  color: var(--green);
  background-color: transparent;
  border: 1px solid var(--green);
  border-radius: ${theme.borderRadius};
  font-size: var(--fz-xs);
  font-family: var(--font-mono);
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  padding: 1.25rem 1.75rem;

  &:hover,
  &:focus,
  &:active {
    background-color: var(--green);
    outline: none;
  }
  &:after {
    display: none !important;
  }
`;

const mixins = {
  flexCenter: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  flexBetween: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  outline: css`
    outline: 1px solid red;
  `,

  link: css`
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: var(--transition);
    cursor: pointer;
    &:hover,
    &:active,
    &:focus {
      color: var(--green);
      outline: 0;
    }
  `,
  button,
  GlitchButton,
  header: styled.header`
    width: 100%;
  `,
  footer: styled.footer`
    margin: 0;
    padding: ${theme.margin};
  `,

  section: styled.section`
    margin: 0 auto;
    padding: 150px 0;
    max-width: 1000px;

    ${media.tablet`padding: 100px 0;`};
  `,

  inlineLink: css`
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    position: relative;
    transition: var(--transition);
    cursor: pointer;
    color: var(--green);
    &:hover,
    &:focus,
    &:active {
      color: var(--green);
      outline: 0;
      &:after {
        width: 100%;
      }
      & > * {
        color: var(--green) !important;
        transition: var(--transition);
      }
    }
    &:after {
      content: '';
      display: block;
      width: 0;
      height: 1px;
      position: relative;
      bottom: 0.37em;
      background-color: var(--green);
      transition: var(--transition);
      opacity: 0.5;
    }
  `,

  smallButton: css`
    color: var(--green);
    background-color: transparent;
    border: 1px solid var(--green);
    border-radius: ${theme.borderRadius};
    padding: 0.75rem 1rem;
    font-size: var(--fz-xs);
    font-family: var(--font-mono);
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition);
    &:hover,
    &:focus,
    &:active {
      background-color: var(--green);
    }
    &:after {
      display: none !important;
    }
  `,
  Heading: styled.h3`
    position: relative;
    display: flex;
    align-items: center;
    margin: 10px 0 40px;
    width: 100%;
    white-space: nowrap;
    font-size: var(--fz-heading);
    ${media.tablet`font-size: 24px;`};

    &:before {
      counter-increment: section;
      content: '0' counter(section) '.';
      margin-right: 10px;
      font-family: var(--font-mono);
      font-weight: normal;
      color: var(--green);
      font-size: var(--fz-xl);
      position: relative;
      bottom: 4px;
      ${media.tablet`font-size: var(--fz-lg);`};
    }

    &:after {
      content: '';
      display: block;
      height: 1px;
      width: 300px;
      background-color: var(--lightest-navy);
      position: relative;
      top: -5px;
      margin-left: 20px;
      ${media.desktop`width: 200px`};
      ${media.tablet`width: 100%;`};
      ${media.thone`margin-left: 10px;`};
    }
  `,

  bigButton: css`
    color: var(--green);
    background-color: transparent;
    border: 1px solid var(--green);
    border-radius: ${theme.borderRadius};
    padding: 1.25rem 1.75rem;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition);
    &:hover,
    &:focus,
    &:active {
      background-color: var(--green);
    }
    &:after {
      display: none !important;
    }
  `,

  sidePadding: css`
    padding: 0 150px;
    ${media.desktop`padding: 0 100px;`};
    ${media.tablet`padding: 0 50px;`};
    ${media.phablet`padding: 0 25px;`};
  `,

  boxShadow: css`
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
    transition: var(--transition);

    &:hover,
    &:focus {
      box-shadow: 0 20px 30px -15px var(--navy-shadow);
    }
  `,

  fancyList: css`
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: var(--fz-lg);
    li {
      position: relative;
      padding-left: 30px;
      margin-bottom: 10px;
      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
      }
    }
  `,
};

export default mixins;
