import { Layout } from '@components';
import { Main, media, mixins, theme, Button } from '@styles';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Img from 'gatsby-image';
const { colors, fontSizes, fonts } = theme;

const StyledTagsContainer = styled.div`
  max-width: 100px;
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
`;

const StyledButtonContainer = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;;
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
const StyledFlex = styled.div`
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
const StyledReadingTime = styled.span`
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.smish};
  color: ${colors.lightSlate};
`;
const StyledDate = styled(StyledReadingTime)`
  text-transform: uppercase;
`;

const StyledReadingTimeContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-between;
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

const StyledMoreButton = styled(Button)`
  margin: 40px 0;
  padding: 1.25rem 10rem;
  ${media.phablet`padding:1.25rem 5rem;`};
`;



const BlogPage = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges;
  const group = data.allMarkdownRemark.group;


  const GRID_LIMIT = 4;


  const  [postsToShow, setPostsToShow] = useState(posts.slice(0, GRID_LIMIT));


  const showMore = () => {
    setPostsToShow(posts.slice(0, postsToShow.length + GRID_LIMIT));
  }

  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  return (
    <Layout location={location}>
      <Helmet>
        <title>Blog | Rubin Bhandari</title>
        <link rel="canonical" href="https://rubin.github.io/blog" />
      </Helmet>

      <StyledMainContainer>
        <header>
          <h1 className="big-title">Blog</h1>
        </header>

        <StyledFlex>
          <div className="posts">
            {posts.length > 0 &&
              postsToShow.map(({ node }, i) => {
                const { frontmatter, timeToRead, excerpt } = node;
                const { title, slug, date, tags } = frontmatter;
                const d = new Date(date);

                return (
                  <StyledPost key={i} tabIndex="0">
                    <StyledPostInner>
                      <header>
                        <Link to={slug}>
                          <StyledPostHeader>
                            <StyledFolder></StyledFolder>
                          </StyledPostHeader>
                          <StyledReadingTimeContainer>
                            <StyledDate>{`📅 ${d.toLocaleDateString('en-us', options)}`}</StyledDate>
                            <StyledReadingTime>{`⏱️ ${timeToRead} min read`}</StyledReadingTime>
                          </StyledReadingTimeContainer>
                          <StyledPostName>{title}</StyledPostName>
                          <StyledPostDescription>{excerpt}</StyledPostDescription>

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
            <StyledButtonContainer>
              <StyledMoreButton onClick={() => showMore()}>Show More</StyledMoreButton>
            </StyledButtonContainer>
          </div>
          <StyledTagsContainer>
            <h1>Tags</h1>
            <ul className="fancy-list">
              {group.map(tag => (
                <li key={tag.fieldValue}>
                  <Link to={`/blog/tags/${kebabCase(tag.fieldValue)}/`}>
                    {tag.fieldValue} <span className="count">({tag.totalCount})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </StyledTagsContainer>
        </StyledFlex>
      </StyledMainContainer>
    </Layout>
  );
};

BlogPage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default BlogPage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/posts/" }, frontmatter: { draft: { ne: true } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          frontmatter {
            title
            slug
            date
            tags
            draft
          }
          excerpt
          timeToRead
        }
      }
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;
