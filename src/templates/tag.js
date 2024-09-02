import { Head, Layout, TagItem } from '@components';
import { Main, mixins, theme } from '@styles';
import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import config from '../config';
import { formatDate } from '../utils';
const { colors, fontSizes } = theme;

const StyledTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  a {
    ${mixins.inlineLink};
  }
`;

const StyledTagsContainer = styled(Main)`
  max-width: 1000px;

  span.tag {
    font-size: 25px;
  }

  a {
    ${mixins.inlineLink};
  }

  h1 {
    ${mixins.flexBetween};
    margin-bottom: 50px;

    a {
      font-size: var(--fz-lg);
      font-weight: 400;
    }
  }

  ul {
    li {
      font-size: 24px;
      h2 {
        font-size: inherit;
        margin: 0;
        a {
          color: var(--light-slate);
        }
      }
      .subtitle {
        color: var(--slate);
        font-size: var(--fz-sm);

        .tag {
          margin-right: 5px;
        }
      }
    }
  }
`;

const TagTemplate = ({ pageContext, data, location }) => {
  const { tag } = pageContext;
  const { edges } = data.allMarkdownRemark;

  const meta = {
    title: `All tags | ${config.name}`,
    description: 'A list of all tags on the site',
    siteUrl: location.href,
  };

  return (
    <Layout location={location}>
      <Head metadata={meta} />
      <StyledTagsContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/blog">All posts</Link>
        </span>

        <h1>
          <span className="tag">
            Showing Post From <span className="wavy">#{tag}</span>
          </span>
          <span>
            <Link to="/blog/tags">View all tags</Link>
          </span>
        </h1>

        <ul className="fancy-list">
          {edges.map(({ node }) => {
            const { title, slug, date, tags } = node.frontmatter;
            return (
              <li key={slug}>
                <h2>
                  <Link to={slug}>{title}</Link>
                </h2>
                <p className="subtitle">
                  <time>{formatDate(date)}</time>
                  <StyledTags>
                    {tags.map((tag, i) => (
                      <TagItem key={i} text={tag}></TagItem>
                    ))}
                  </StyledTags>
                </p>
              </li>
            );
          })}
        </ul>
      </StyledTagsContainer>
    </Layout>
  );
};

export default TagTemplate;

TagTemplate.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired,
      ),
    }),
  }),
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query ($tag: String!) {
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          frontmatter {
            title
            date
            slug
            tags
          }
        }
      }
    }
  }
`;
