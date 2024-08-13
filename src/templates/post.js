import { Main, media, theme } from '@styles';
import styled from 'styled-components';
import { graphql, Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import PropTypes from 'prop-types';
import React from 'react';
import { ShareLink, Head, Layout } from '@components';
import { NewsLetter } from '../components';

const { colors } = theme;

const StyledPostContainer = styled(Main)`
  max-width: 1000px;
`;
const StyledPostHeader = styled.header`
  margin-bottom: 50px;
  .tag {
    margin-right: 10px;
  }
`;
const StyledPostContent = styled.div`
  margin: 50px 0 100px 0;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2em 0 1em;
  }

  p {
    margin: 1em 0;
    line-height: 1.5;
    color: ${colors.lightSlate};
  }
`;

const StyledShareContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
  ${media.thone`justify-content: center;`};
`;

const Toc = styled.div`
  display: flex;
  flex-direction: column;
  li {
    line-height: 1;
    margin-top: 10px
  }
`


const PostTemplate = ({ data, location }) => {
  const { frontmatter, html, excerpt, tableOfContents } = data.markdownRemark;
  const { title, date, tags, cover_image } = frontmatter;

  const meta = {
    title,
    description: excerpt,
    siteUrl: location.href,
    ogImage: cover_image,
  };

  return (
    <Layout location={location}>
      <Head metadata={meta} />

      <StyledPostContainer>
        <span className="breadcrumb">
          <span className="arrow">&larr;</span>
          <Link to="/blog">All posts</Link>
        </span>
        <StyledShareContainer>
          <ShareLink location={location} title={title} />
        </StyledShareContainer>
        <StyledPostHeader>
          <h1 className="medium-title">{title}</h1>
          <p className="subtitle">
            <time>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>&nbsp;&mdash;&nbsp;</span>
            {tags &&
              tags.length > 0 &&
              tags.map((tag, i) => (
                <Link key={i} to={`/blog/tags/${kebabCase(tag)}/`} className="tag">
                  #{tag}
                </Link>
              ))}
          </p>
          {
            tableOfContents !== "" && (
              <Toc>
                <h2>Table of contents</h2>
                <div dangerouslySetInnerHTML={{ __html: tableOfContents }} />
              </Toc>
            )
          }
        </StyledPostHeader>


        <img className="post-image" src={cover_image.publicURL} alt={title} />

        <StyledPostContent dangerouslySetInnerHTML={{ __html: html }} />
      </StyledPostContainer>

      <NewsLetter />
    </Layout>
  );
};

export default PostTemplate;

PostTemplate.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
};

export const pageQuery = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { slug: { eq: $path } }) {
      html
      excerpt
      tableOfContents
      frontmatter {
        title
        date
        slug
        tags
        cover_image {
          publicURL
        }
      }
    }
  }
`;
