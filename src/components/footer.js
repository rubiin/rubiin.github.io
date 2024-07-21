import React from 'react';
import PropTypes from 'prop-types';
import { IconGitHub, IconLinkedin, IconDev, IconInstagram, IconTwitter } from '@components/icons';
import { socialMedia } from '@config';
import styled from 'styled-components';
import { theme, mixins, media } from '@styles';
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled.footer`
  ${mixins.flexCenter};
  flex-direction: column;
  padding: 15px;
  background-color: ${colors.darkNavy};
  color: ${colors.slate};
  text-align: center;
  height: auto;
  min-height: 70px;
`;
const StyledSocial = styled.div`
  color: ${colors.lightSlate};
  width: 100%;
  max-width: 270px;
  margin: 0 auto 10px;
  display: none;
  ${media.tablet`display: block;`};
`;
const StyledSocialList = styled.ul`
  ${mixins.flexBetween};
  padding: 0;
  margin: 0;
  list-style: none;
`;
const StyledSocialLink = styled.a`
  padding: 10px;
  svg {
    width: 20px;
    height: 20px;
  }
`;
const StyledMetadata = styled.div`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  line-height: 1;
`;
const StyledGitHubLink = styled.a`
  color: ${colors.slate};
  padding: 10px;
`;
const Footer = () => (
  <StyledContainer>
    <StyledSocial>
      <StyledSocialList>
        {socialMedia &&
          socialMedia.map(({ name, url }, i) => (
            <li key={i}>
              <StyledSocialLink
                href={url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label={name}
              >
                {name === 'GitHub' ? (
                  <IconGitHub />
                ) : name === 'Linkedin' ? (
                  <IconLinkedin />
                ) : name === 'Dev.to' ? (
                  <IconDev />
                ) : name === 'Instagram' ? (
                  <IconInstagram />
                ) : name === 'Twitter' ? (
                  <IconTwitter />
                ) : (
                  <IconGitHub />
                )}
              </StyledSocialLink>
            </li>
          ))}
      </StyledSocialList>
    </StyledSocial>
    <StyledMetadata tabindex="-1">
      <h4>
        <span role="img" aria-label="easter">
          The site has some easter eggs 💜🐰🥚
        </span>
      </h4>
      <StyledGitHubLink
        href="https://github.com/bchiang7"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        <div>Theme by Brittany Chiang</div>
      </StyledGitHubLink>
    </StyledMetadata>
  </StyledContainer>
);

Footer.propTypes = {
  githubInfo: PropTypes.object,
};

export default Footer;
