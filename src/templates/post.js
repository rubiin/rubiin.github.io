import { Main, media, theme, Button, mixins } from "@styles";
import styled from "styled-components";
import { graphql, Link } from "gatsby";
import kebabCase from "lodash/kebabCase";
import PropTypes from "prop-types";
import React from "react";
import { ShareLink, Head, Layout } from "@components";
import { NewsLetter } from "../components";
import { Disqus } from "gatsby-plugin-disqus";
import { formatDate } from "../utils";

const { colors, fonts, fontSizes } = theme;

const StyledNextPrev = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 20px;
  font-family: ${fonts.SFMono};
  font-size: ${fontSizes.sm};
  i {
    span {
      padding-left: 5px;
      font-family: ${fonts.SFMono};
    }
  }

  .next-prev{
  display: flex;
  justify-content: space-between;
  }
`;

const StyledToc = styled.div`
  margin: 20px 0;
  scroll-behavior: smooth;
  font-size: 1.4rem;

  h2 {
    font-size: 2.5rem;
  }
  ul {
    li {
      color: #64ffda;
    }
  }

  p {
    display: flex;
    align-items: center;
    color: #64ffda;
    cursor: pointer;
  }

  span:nth-child(1) {
    font-size: 1.5rem;
    padding-right: 5px;
  }
`;

const StyledDisqusContainer = styled.div`
  padding: 2rem;
  margin: 0 auto;
  width: 70%;
  ${media.phablet`display: none;`};
`;

const StyledPostContainer = styled(Main)`
  max-width: 1200px;
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
  }


`;

const StyledShareContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
  ${media.thone`justify-content: center;`};
`;

const StyledLoadComments = styled(Button)`
  display: flex;
  margin: 0 auto;
  margin-bottom: 50px;
  ${media.phablet`display: none;`};
`;

// add some texts before toc

const PostTemplate = ({ data, location }) => {
  const { frontmatter, html, excerpt, tableOfContents } = data.markdownRemark;
  const { title, date, tags, cover_image, slug } = frontmatter;

  const [showDisqus, setShowDisqus] = React.useState(false);
  const [showToc, setShowToc] = React.useState(false);

  const meta = {
    title,
    description: excerpt,
    siteUrl: location.href,
    ogImage: cover_image.publicURL,
  };

  const disqusConfig = {
    url: location.href,
    identifier: slug,
    title,
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
            <time>{formatDate(date)}</time>
            <span>&nbsp;&mdash;&nbsp;</span>
            {tags &&
              tags.length > 0 &&
              tags.map((tag, i) => (
                <Link
                  key={i}
                  to={`/blog/tags/${kebabCase(tag)}/`}
                  className="tag"
                >
                  #{tag}
                </Link>
              ))}
          </p>
          {tableOfContents !== "" && (
            <StyledToc>
              <h2 className="big-title">Table of contents</h2>
              <p onClick={() => setShowToc(!showToc)}>
                <span>🢒</span>
                <span>Click to expand!</span>
              </p>
              {showToc && (
                <div dangerouslySetInnerHTML={{ __html: tableOfContents }} />
              )}
            </StyledToc>
          )}
        </StyledPostHeader>

        <img className="post-image" src={cover_image.publicURL} alt={title} />

        <StyledPostContent dangerouslySetInnerHTML={{ __html: html }} />

        <StyledNextPrev>
          <div className="author">
            <i className="fa fa-user">
              <span><span style={{color: "#ffffff"}}>Rubin Bhandari</span> | {formatDate(date)}</span>
            </i>
          </div>

          <div className="next-prev">
            <Button to="/blog">Next</Button>
            <Button to="/blog">Next</Button>
            </div>
        </StyledNextPrev>
      </StyledPostContainer>

      <NewsLetter />

      {!showDisqus && (
        <StyledLoadComments onClick={() => setShowDisqus(true)}>
          Post a comment
        </StyledLoadComments>
      )}

      {showDisqus && (
        <StyledDisqusContainer>
          <Disqus config={disqusConfig} />
        </StyledDisqusContainer>
      )}
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
