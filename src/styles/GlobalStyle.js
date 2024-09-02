import { createGlobalStyle } from 'styled-components';
import FontFaces from './fonts';
import media from './media';
import mixins from './mixins';
import PrismStyles from './PrismStyles';
import theme from './theme';
import TransitionStyles from './TransitionStyles';
import variables from './variables';

const GlobalStyle = createGlobalStyle`
  ${FontFaces};
  ${variables}

  html {
    box-sizing: border-box;
    width: 100%;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: var(--navy);
    color:  var(--slate);
    line-height: 1.3;
    font-family: var(--font-sans);
    font-size: var(--fz-xl);
    ${media.phablet`font-size: var(--fz-lg);`}

    &.hidden {
      overflow: hidden;
    }
    &.blur {
      overflow: hidden;
      #root > #content > * {
        filter: blur(5px) brightness(0.7);
        transition: var(--transition);
        pointer-events: none;
        user-select: none;
      }
    }
  }

  ::selection {
    background-color: var(--lightest-navy);
    color: var(--lightest-slate);
  }

  #root {
    min-height: 100vh;
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    color: var(--lightest-slate);
    margin: 0 0 10px 0;
  }

  h1 {
    &.big-title {
      font-size: 80px;
      line-height: 1.1;
      ${media.desktop`font-size: 70px;`};
      ${media.tablet`font-size: 60px;`};
      ${media.phablet`font-size: 50px;`};
      ${media.phone`font-size: 40px;`};
    }

    &.medium-title {
      font-size: 60px;
      line-height: 1.1;
      ${media.desktop`font-size: 50px;`};
      ${media.tablet`font-size: 40px;`};
    }

      &.small-title {
      font-size: 40px;
      line-height: 1.1;
      ${media.desktop`font-size: 30px;`};
      ${media.tiny`font-size: 20px;`};
    }
  }

  img {
    width: 100%;
    max-width: 100%;
    vertical-align: middle;
  }

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    vertical-align: middle;
  }

  a {
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: var(--transition);
    cursor: pointer;

    &:hover,
    &:focus {
      color: var(--green);
    }
  }

  button {
    cursor: pointer;
    border: 0;
    border-radius: 0;

    &:focus,
    &:active {
      outline-color: var(--blue);
    }
  }

  input, textarea {
    border-radius: 0;
    outline: 0;

    &:focus {
      outline: 0;
    }
    &::placeholder {
    }
    &:focus,
    &:active {
      &::placeholder {
        opacity: 0.5;
      }
    }
  }

  p {
    margin: 0 0 15px 0;

    & > a {
      ${mixins.inlineLink};
    }

    & > code {
      background-color: var(--light-navy);
      color: var(--white);
      font-size: var(--fz-sm);
      border-radius: ${theme.borderRadius};
      padding: 0.3em 0.5em;
    }
  }

  ul {
    &.fancy-list {
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
    }
  }

  blockquote {
    border-left-color: var(--green);
    border-left-style: solid;
    border-left-width: 1px;
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 1.5rem;

    p {
      font-style: italic;
      font-size: 24px;
    }
  }

  hr {
    background-color: var(--lightest-navy);
    height: 1px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;

    margin: 0 auto;
    width: 50%;

  }

  code {
    font-family: var(--font-mono);
    font-size: var(--fz-md);
  }

  .overline {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: normal;
  }

  .subtitle {
    color: var(--green);
    margin: 0 0 20px 0;
    font-size: var(--fz-md);
    font-family: var(--font-mono);
    font-weight: normal;
    line-height: 1.5;
    ${media.desktop`font-size: var(--fz-sm);`};
    ${media.tablet`font-size: var(--fz-xs);`};

    a {
      ${mixins.inlineLink};
      line-height: 1.5;
    }
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    color: var(--green);

    .arrow {
      display: block;
      margin-right: 10px;
      padding-top: 4px;
    }
    a {
      ${mixins.inlineLink};
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      font-weight: bold;
      line-height: 1.5;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }

  .gatsby-image-outer-wrapper {
    height: 100%;
  }

  .wavy{
    text-decoration-line: underline;
    text-decoration-color: #2ba283;
    text-decoration-style: wavy;
    text-decoration-thickness: 2px;
    text-underline-offset: .5em;
  }

 .post-image{
 object-fit: cover;
border-radius: ${theme.borderRadius};
box-shadow:0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19) !important;
 }

.social {
  font-size: 2.5em;
  height: 40px;
  overflow: hidden;
  border-bottom: 1px solid #64ffda;
}

i.share {
  position: relative;
  top: 20px;
  margin: 0 10px;
  transition: all 100ms cubic-bezier(0.42, 0, 0.58, 1);
  /* ease-in-out */
}
i.share:hover {
  top: 5px;
}

.fb {
  color: #3b5998;
}

.tw {
  color: #09aeec;
}

.yt {
  color: #aa2a25;
}

.dr {
  color: #ea4c89;
}

.sk {
  color: #00a5e6;
}

 .em{
  color: #e7c9a9;
 }



  ${TransitionStyles};

  ${PrismStyles};
`;

export default GlobalStyle;
