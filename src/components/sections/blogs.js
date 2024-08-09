import { Button, Main, media, mixins, theme } from '@styles';
import { Link, navigate } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
const { colors, fontSizes, fonts } = theme;

const StyledTagsContainer = styled.div`
  width: 200px;
  margin-top: 100px;
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

const StyledAllCategory = styled(Link)`
  padding: 1rem;
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
  margin-top: 1rem;
  font-size: ${fontSizes.lg};
  color: ${colors.lightSlate};
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

const StyledTags = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
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

const StyledLatestPostHeader = styled.h1`
    margin: 0  auto;
    margin-bottom: 3rem;
}
`;

const StyledButtonContainer = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledMoreButton = styled(Button)`
  margin: 40px 0;
  padding: 1.25rem 10rem;
  ${media.phablet`padding:1.25rem 5rem;`};
`;

const Blog = ({ posts, tags }) => {
  const postsData = posts.edges;
  const tagsData = tags.group;

  const sortTags = tagsData
    .sort((a, b) => {
      return b.totalCount - a.totalCount;
    })
    .slice(0, 5);

  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  return (
    <StyledMainContainer>
      <StyledFlex>
        <div className="posts">
          <StyledLatestPostHeader className="small-title wavy">Recent Posts</StyledLatestPostHeader>

          {postsData.length > 0 &&
            postsData.map(({ node }, i) => {
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
            <StyledMoreButton onClick={() => navigate('/blog')}>View All Posts</StyledMoreButton>
          </StyledButtonContainer>
        </div>
        <StyledTagsContainer>
          <h1 className="small-text">Tags</h1>
          <ul className="fancy-list">
            {sortTags.map(tag => (
              <li key={tag.fieldValue}>
                <Link to={`/blog/tags/${kebabCase(tag.fieldValue)}/`}>
                  {tag.fieldValue} <span className="count">({tag.totalCount})</span>
                </Link>
              </li>
            ))}
            <StyledAllCategory to={`/blog/tags`}>Read more on</StyledAllCategory>
          </ul>
        </StyledTagsContainer>
      </StyledFlex>
    </StyledMainContainer>
  );
};

Blog.propTypes = {
  posts: PropTypes.object.isRequired,
  tags: PropTypes.object.isRequired,
};

export default Blog;
