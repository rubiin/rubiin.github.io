import { Head, Layout } from '@components';
import { Main, mixins, theme } from '@styles';
import { Link, graphql } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
const { colors, fontSizes, fonts } = theme;

const StyledTagsContainer = styled(Main)`
  h1 {
    margin-bottom: 50px;
  }
  ul {
    color: ${colors.lightSlate};
    columns: 3;
    li {
      font-size: ${fontSizes.xxl};

      a {
        ${mixins.inlineLink};
        color: ${colors.lightSlate};
        .count {
          color: ${colors.slate};
          font-family: ${fonts.SFMono};
          font-size: ${fontSizes.md};
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

        <h1>Tags</h1>
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
