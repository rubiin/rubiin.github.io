import { Layout, TagItem, Head } from '@components';
import config from '@config';
import { Main, media, mixins, theme } from '@styles';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDate } from '../../utils';


const POST_TAGS = Object.freeze({
  RECENT: 'Recent',
  FEATURED: 'Featured',
});

const StyledTagsContainer = styled.div`
  width: 200px;
  margin-top: 100px;
  ${media.bigDesktop`display:none;`};
  ${media.phablet`display: none;`};
`;

const StyledMainContainer = styled(Main)`
  padding-bottom: 0;
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
  align-items: center;
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
  transition: var(--transition);
  background-color: var(--light-navy);
  header,
  a {
    width: 100%;
  }
`;
const StyledAllCategory = styled(Link)`
  padding: 1rem;
`;

const StyledPost = styled.div`
  transition: var(--transition);
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
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--light-slate);
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
  color: var(--green);
  svg {
    width: 40px;
    height: 40px;
  }
`;
const StyledPostName = styled.h5`
  margin: 0 0 10px;
  font-size: var(--fz-xxl);
  color: var(--lightest-slate);
`;
const StyledPostDescription = styled.div`
  font-size: 17px;
  color: var(--light-slate);
`;

const StyledTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  a {
    ${mixins.inlineLink};
  }
`;

const StyledToggleButton = styled(mixins.button)`
  padding: 0.5rem 0.7rem;
  margin: 0.4rem;
`;

const StyledMoreButton = styled(mixins.button)`
  margin: 40px 0;
  padding: 1.25rem 10rem;
  ${media.thone`padding:1.25rem 6rem;`};
  ${media.thone`padding:1.25rem 4rem;`};
  ${media.tiny`padding:1.25rem 4rem;`};
`;

const StyledLatestPostHeader = styled.h1`
    margin: 0  auto;
    margin-bottom: 1rem;
}
`;

const BlogPage = ({ location, data }) => {
  const group = data.allMarkdownRemark.group;
  const GRID_LIMIT = 5;

  const posts = data.allMarkdownRemark.edges;
  const [toggleText, setToggleTxt] = useState(POST_TAGS.FEATURED);
  const [postsToShow, setPostsToShow] = useState(posts.slice(0, GRID_LIMIT));

  const handleToggle = () => {
    // if toggleText is Featured, show featured posts
    if (toggleText === POST_TAGS.FEATURED) {
      setToggleTxt(POST_TAGS.RECENT);

      setPostsToShow(posts.filter(({ node }) => node.frontmatter.featured).slice(0, GRID_LIMIT));
    } else {
      setPostsToShow(posts.slice(0, GRID_LIMIT));

      setToggleTxt(POST_TAGS.FEATURED);
    }
  };

  const sortTags = group
    .sort((a, b) => {
      return b.totalCount - a.totalCount;
    })
    .slice(0, GRID_LIMIT);

  const showMore = () => {
    if (toggleText === POST_TAGS.FEATURED) {
      setPostsToShow(posts.slice(0, postsToShow.length + GRID_LIMIT));
    } else {
      setPostsToShow(
        posts
          .filter(({ node }) => node.frontmatter.featured === true)
          .slice(0, postsToShow.length + GRID_LIMIT),
      );
    }
  };

  const meta = {
    title: ` Blog | ${config.name}`,
    siteUrl: location.href,
    description: config.postPageDescription,
  };

  return (
    <Layout location={location}>
      <Head metadata={meta} />

      <StyledMainContainer>
        <StyledFlex>
          <div className="posts">
            <StyledLatestPostHeader className="small-title wavy">
              {toggleText === POST_TAGS.FEATURED ? POST_TAGS.RECENT : POST_TAGS.FEATURED} Posts
            </StyledLatestPostHeader>

            <StyledButtonContainer>
              <StyledToggleButton onClick={() => handleToggle()}>{toggleText}</StyledToggleButton>
            </StyledButtonContainer>

            {posts.length > 0 &&
              postsToShow.map(({ node }, i) => {
                const { frontmatter, timeToRead, excerpt } = node;
                const { title, slug, date, tags } = frontmatter;

                return (
                  <StyledPost key={i} tabIndex="0">
                    <StyledPostInner>
                      <header>
                        <Link to={slug}>
                          <StyledPostHeader>
                            <StyledFolder></StyledFolder>
                          </StyledPostHeader>
                          <StyledReadingTimeContainer>
                            <StyledDate>{`📆 ${formatDate(date)}`}</StyledDate>
                            <StyledReadingTime>{`⏱️ ${timeToRead} min read`}</StyledReadingTime>
                          </StyledReadingTimeContainer>
                          <StyledPostName>{title}</StyledPostName>
                          <StyledPostDescription>{excerpt}</StyledPostDescription>
                        </Link>
                      </header>
                      <footer>
                        <StyledTags>
                          {tags.map((tag, i) => (
                            <TagItem key={i} text={tag}></TagItem>
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
            <h2 className="small-text">Read more on</h2>
            <ul className="fancy-list">
              {sortTags.map(tag => (
                <li key={tag.fieldValue}>
                  <Link to={`/blog/tags/${kebabCase(tag.fieldValue)}/`}>
                    {tag.fieldValue} <span className="count">({tag.totalCount})</span>
                  </Link>
                </li>
              ))}
              <StyledAllCategory to={`/blog/tags`}>All tags</StyledAllCategory>
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
            featured
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
