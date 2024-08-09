import React from 'react';
import { Component } from 'react';
import { Main, media, mixins } from '@styles';
import styled from 'styled-components';

const StyledSubscribeForm = styled.div`
  width: 40%;
  .formkit-form[data-uid='589be1abe0'] {
    border: none !important;
    font-size: 13px;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  }

  .formkit-submit {
    background-color: transparent !important;
    border: 1px solid #64ffda !important;
  }

  ${media.tablet`width: 80%;`};
  ${media.phablet`width: 100%;`};
`;

const SubscribeDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
    return (
      <SubscribeDiv>
        <StyledSubscribeForm ref={el => (this.instance = el)}></StyledSubscribeForm>
      </SubscribeDiv>
    );
  }
}

export default Newsletter;
