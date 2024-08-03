import { Button, Main, media, mixins, theme } from '@styles';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
const { colors, fontSizes, fonts } = theme;

const StyledTagsContainer = styled.div`
  max-width: fit-content;
  ${media.bigDesktop`display:none;`};
  ${media.phablet`display: none;`};
`;

const StyledMainContainer = styled(Main)`
  & > header {
    text-align: center;
    margin-bottom: 100px;
    a {
      &:hover,
      &:focus {
        cursor:
          url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>⚡</text></svg>")
            20 0,
          auto;
      }
    }
  }

  footer {
    ${mixins.flexBetween};
    margin-top: 20px;
    width: 100%;
    justify-content: flex-end;
  }
  padding: 0 0;
`;
const StyledFeaturedImg = styled(Img)`
  width: 100%;
  max-width: 100%;
  vertical-align: middle;
  border-radius: ${theme.borderRadius};
  position: relative;
  mix-blend-mode: multiply;
  filter: grayscale(100%) contrast(1) brightness(90%);
  ${media.tablet`
    object-fit: cover;
    width: auto;
    height: 100%;
    filter: grayscale(100%) contrast(1) brightness(80%);
  `};
`;
const StyledGrid = styled.div`
  margin-top: 20px;
  display: flex;
  width: inherit;
  gap: 10%;
  justify-content: space-around;

  .posts {
    display: flex;
    flex-direction: column;
    width: 80%;
    gap: 0.5rem;
  }
`;

const StyledPostInner = styled.div`
  ${mixins.boxShadow};
  ${mixins.flexBetween};
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding: 2rem 1.75rem;
  height: 100%;
  border-radius: ${theme.borderRadius};
  transition: ${theme.transition};
  background-color: ${colors.lightNavy};
  header,
  a {
    width: 100%;
  }
`;

const StyledAllCategory = styled(Link)`
  margin-top: 20px;
`;

const StyledPost = styled.div`
  transition: ${theme.transition};
  cursor: default;
  &:hover,
  &:focus {
    outline: 0;
    ${StyledPostInner} {
      transform: translateY(-5px);
    }
  }
`;
const StyledPostHeader = styled.div`
  ${mixins.flexBetween};
  margin-bottom: 30px;
`;
const StyledFolder = styled.div`
  color: ${colors.green};
  svg {
    width: 40px;
    height: 40px;
  }
`;
const StyledPostName = styled.h5`
  margin: 0 0 10px;
  font-size: ${fontSizes.xxl};
  color: ${colors.lightestSlate};
`;
const StyledPostDescription = styled.div`
  font-size: 17px;
  color: ${colors.lightSlate};
`;
const StyledDate = styled.span`
  text-transform: uppercase;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.xs};
  color: ${colors.lightSlate};
`;
const StyledTags = styled.ul`
  display: flex;
  align-items: flex-end;
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.xs};
    color: ${colors.green};
    line-height: 1.75;
    margin-right: 15px;
    &:last-of-type {
      margin-right: 0;
    }
    a {
      ${mixins.inlineLink};
    }
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledMoreButton = styled(Button)`
  margin: 40px auto;
`;

const Blog = ({ posts, tags }) => {
  const postsData = posts.edges;
  const tagsData = tags.group;

  const sortTags = tagsData
    .sort((a, b) => {
      return b.totalCount - a.totalCount;
    })
    .slice(0, 5);

  return (
    <StyledMainContainer>
      <header>
        <h1 className="medium-title">Recently published</h1>
      </header>

      <StyledGrid>
        <div className="posts">
          {postsData.length > 0 &&
            postsData.map(({ node }, i) => {
              const { frontmatter } = node;
              const { title, description, slug, date, tags } = frontmatter;
              const d = new Date(date);

              return (
                <StyledPost key={i} tabIndex="0">
                  <StyledPostInner>
                    <header>
                      <Link to={slug}>
                        <StyledPostHeader>
                          <StyledFolder></StyledFolder>
                        </StyledPostHeader>
                        <StyledPostName>{title}</StyledPostName>
                        <StyledPostDescription>{description}</StyledPostDescription>
                        <StyledDate>{`📅 ${d.toLocaleDateString()}`}</StyledDate>
                      </Link>
                    </header>
                    <footer>
                      <StyledTags>
                        {tags.map((tag, i) => (
                          <li key={i}>
                            <Link to={`/blog/tags/${kebabCase(tag)}/`}>#{tag}</Link>
                          </li>
                        ))}
                      </StyledTags>
                    </footer>
                  </StyledPostInner>
                </StyledPost>
              );
            })}
        </div>
        <StyledTagsContainer>
          <h1>Tags</h1>
          <ul className="fancy-list">
            {sortTags.map(tag => (
              <li key={tag.fieldValue}>
                <Link to={`/blog/tags/${kebabCase(tag.fieldValue)}/`}>
                  {tag.fieldValue} <span className="count">({tag.totalCount})</span>
                </Link>
              </li>
            ))}
            <StyledAllCategory to={`/blog/tags`}>All Tags</StyledAllCategory>
          </ul>
        </StyledTagsContainer>
      </StyledGrid>
      <StyledButtonContainer>
        <StyledMoreButton to={`/blog`}>View All Posts</StyledMoreButton>
      </StyledButtonContainer>
    </StyledMainContainer>
  );
};

Blog.propTypes = {
  posts: PropTypes.object.isRequired,
  tags: PropTypes.object.isRequired,
};

export default Blog;
