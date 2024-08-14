import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import { Layout } from '@components';
import styled from 'styled-components';
import { theme, mixins, media, Main } from '@styles';
const { colors, fonts } = theme;

const StyledMainContainer = styled(Main)`
  ${mixins.flexCenter};
  flex-direction: column;
  overflow: hidden;
`;

const StyledImg = styled.img`
  max-width: 300px;
  ${media.giant`width: 30%;`};
  ${media.bigDesktop`width: 50%;`}
  ${media.desktop`width: 40%;`}
${media.phablet`width: 70%;`}
${media.thone`width: 50%;`}
-webkit-animation:slide-top 2s ease-in-out infinite alternate-reverse;
  animation:slide-top 2s ease-in-out infinite alternate-reverse @-webkit-keyframes slide-top {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    100% {
      -webkit-transform: translateY(-15px);
      transform: translateY(-15px);
    }
  }
  @keyframes slide-top {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    100% {
      -webkit-transform: translateY(-15px);
      transform: translateY(-15px);
    }
  }
`;

const StyledDataContainer = styled.div`
  ${mixins.flexCenter};
  gap: 2rem;
  width: 80%;
  margin: 0 auto;
  ${media.phone`flex-direction: column;`}
`;

const StyledTitle = styled.h1`
  color: ${colors.green};
  font-family: ${fonts.SFMono};
  font-size: 12vw;
  line-height: 1;
  ${media.bigDesktop`font-size: 200px;`}
  ${media.phablet`font-size: 120px;`};
`;
const StyledSubtitle = styled.h2`
  font-size: 3vw;
  font-weight: 400;
  ${media.bigDesktop`font-size: 50px;`};
  ${media.phablet`font-size: 30px;`};
`;
const StyledHomeButton = styled(Link)`
  ${mixins.bigButton};
  margin-top: 40px;
`;

const NotFoundPage = ({ location }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Layout location={location}>
      <TransitionGroup component={null}>
        {isMounted && (
          <CSSTransition timeout={500} classNames="fade">
            <StyledMainContainer className="fillHeight">
              <StyledDataContainer>
                <div>
                  <StyledTitle>404</StyledTitle>
                  <StyledSubtitle>Page Not Found</StyledSubtitle>
                </div>
                <StyledImg src="https://www.salehriaz.com/404Page/img/astronaut.svg" />
              </StyledDataContainer>

              <StyledHomeButton to="/">Go Home</StyledHomeButton>
            </StyledMainContainer>
          </CSSTransition>
        )}
      </TransitionGroup>
    </Layout>
  );
};

NotFoundPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default NotFoundPage;
