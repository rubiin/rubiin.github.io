[] show by date by default
[] restrict to 4-5 posts
[x] show more
[] mobile responsive
[] minute read
[x] limit tags
[] paginate


export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/posts/" }, frontmatter: { draft: { ne: true } } }
      sort: { frontmatter: { date: DESC } }
      limit : 5
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
          html
        }
      }
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`;
