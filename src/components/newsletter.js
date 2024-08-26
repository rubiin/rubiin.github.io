import { media } from '@styles';
import React, { Component } from 'react';
import styled from 'styled-components';

const StyledSubscribeForm = styled.div`
  .formkit-form[data-uid='589be1abe0'] {
    border: none !important;
    max-width: 100% !important;
    width: 40% !important;
    font-size: 13px;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    ${media.giant`width: 70% !important;`};
    ${media.bigDesktop`width: 70% !important;`};
    ${media.desktop`width: 80% !important;`};
    ${media.tablet`width: 80% !important;`};
    ${media.thone`width: 100% !important;`};
  }
  .formkit-submit {
    background-color: transparent !important;
    border: 1px solid #64ffda !important;
  }
  display: flex;
  justify-content: center;
`;

class Newsletter extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://rubin-bhandari.ck.page/589be1abe0/index.js';
    script.async = true;
    script.setAttribute('data-uid', '589be1abe0');
    this.instance.appendChild(script);
  }

  render() {
    return <StyledSubscribeForm ref={el => (this.instance = el)}></StyledSubscribeForm>;
  }
}

export default Newsletter;
