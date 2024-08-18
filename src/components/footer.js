import {
  IconDev,
  IconGitHub,
  IconInstagram,
  IconLinkedin,
  IconRss,
  IconTwitter,
} from "@components/icons";
import { socialMedia } from "@config";
import { media, mixins, theme } from "@styles";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
const { colors, fontSizes, fonts } = theme;

const StyledContainer = styled.footer`
  ${mixins.flexCenter};
  flex-direction: column;
  padding: 15px;
  background-color: ${colors.darkNavy};
  color: ${colors.slate};
  height: auto;
  min-height: 100px;
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
  margin-left: -320px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sm};
  line-height: 1;
  ${media.thone`font-size: ${fontSizes.xs};`};
  ${media.bigDesktop`margin-left: 0;`};
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
                {name === "GitHub" ? (
                  <IconGitHub />
                ) : name === "Linkedin" ? (
                  <IconLinkedin />
                ) : name === "Dev.to" ? (
                  <IconDev />
                ) : name === "Instagram" ? (
                  <IconInstagram />
                ) : name === "Twitter" ? (
                  <IconTwitter />
                ) : name === "Github" ? (
                  <IconGitHub />
                ) : (
                  <IconRss />
                )}
              </StyledSocialLink>
            </li>
          ))}
      </StyledSocialList>
    </StyledSocial>
    <StyledMetadata tabIndex="-1">
      <h4>
        <span role="img" aria-label="copyright">
          Copyright © {new Date().getFullYear()} Rubin Bhandari.
        </span>
      </h4>
    </StyledMetadata>
  </StyledContainer>
);

Footer.propTypes = {
  githubInfo: PropTypes.object,
};

export default Footer;
