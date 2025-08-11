import { Helmet } from "react-helmet-async";

type SEOProps = {
  title: string
  description?: string
  canonical?: string
}

export const SEO = ({ title, description, canonical }: SEOProps) => {
  const metaTitle = title.length > 60 ? `${title.slice(0,57)}...` : title
  const metaDesc = description && description.length > 160 ? `${description.slice(0,157)}...` : description
  return (
    <Helmet>
      <title>{metaTitle}</title>
      {metaDesc && <meta name="description" content={metaDesc} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={metaTitle} />
      {metaDesc && <meta property="og:description" content={metaDesc} />} 
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />} 
    </Helmet>
  )
}
