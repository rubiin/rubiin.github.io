import { Head, Layout } from '@components';
import { Main, mixins, theme } from '@styles';
import { Link, graphql } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';


const StyledTagsContainer = styled(Main)`
  h1 {
    margin-bottom: 50px;
  }
  ul {
    color: var(--light-slate);
    columns: 3;
    li {
      font-size: var(--fz-xxl);

      a {
        ${mixins.inlineLink};
        color: var(--light-slate);
        .count {
          color:  var(--slate);
          font-family: var(--font-mono);
          font-size: var(--fz-md);
        }
      }
    }
  }
`;

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
  location,
}) => {
  const sortTags = group.sort((a, b) => {
    return b.totalCount - a.totalCount;
  });

  const meta = {
    title,
    siteUrl: location.href,
    description: 'A list of all tags on the blog',
  };

  return (
    <Layout location={location}>
      <Head metadata={meta} />

      <StyledTagsContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/blog">All posts</Link>
        </span>

        <h1 className="big-title">Tags</h1>
        <ul className="fancy-list">
          {sortTags.map(tag => (
            <li key={tag.fieldValue}>
              <Link to={`/blog/tags/${kebabCase(tag.fieldValue)}/`}>
                {tag.fieldValue} <span className="count">({tag.totalCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      </StyledTagsContainer>
    </Layout>
  );
};

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired,
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
  location: PropTypes.object,
};

export default TagsPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000, filter: { frontmatter: { draft: { ne: true } } }) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;
