import { useEffect } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

export interface NewsArticleSchema {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  citation?: string[];
  articleSection?: string;
}

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  breadcrumbs?: Array<{ name: string; path: string }>;
  faqs?: FaqItem[];
  applicationCategory?: string;
  newsArticle?: NewsArticleSchema;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  breadcrumbs = [],
  faqs = [],
  applicationCategory = 'FinanceApplication',
  newsArticle,
}) => {
  useEffect(() => {
    // 1. Update Title & Meta Tags
    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    // Canonical link
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bharatcalc.in';
    const fullUrl = `${origin}${canonicalPath}`;
    setMeta('og:url', fullUrl, true);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', fullUrl);

    // 2. Inject Dynamic Schema.org JSON-LD
    const scriptId = 'seo-schema-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    // NewsArticle Schema
    if (newsArticle) {
      const articleSchema: any = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: newsArticle.headline,
        description: newsArticle.description,
        datePublished: newsArticle.datePublished,
        dateModified: newsArticle.dateModified,
        citation: newsArticle.citation || [],
      };

      const items: any[] = [articleSchema];
      if (breadcrumbs.length > 0) {
        items.push({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: crumb.name,
            item: `${origin}${crumb.path}`,
          })),
        });
      }

      scriptTag.textContent = JSON.stringify(
        items.length === 1 ? items[0] : { '@context': 'https://schema.org', '@graph': items },
        null,
        2
      );
      return;
    }

    const schemaGraph: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: title,
        description,
        applicationCategory,
        operatingSystem: 'All',
        url: fullUrl,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
    ];

    // BreadcrumbList Schema
    if (breadcrumbs.length > 0) {
      schemaGraph.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `${origin}${crumb.path}`,
        })),
      });
    }

    // FAQPage Schema
    if (faqs.length > 0) {
      schemaGraph.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      });
    }

    scriptTag.textContent = JSON.stringify(
      schemaGraph.length === 1 ? schemaGraph[0] : { '@context': 'https://schema.org', '@graph': schemaGraph },
      null,
      2
    );

    return () => {
      // Cleanup tag if needed on unmount
    };
  }, [title, description, canonicalPath, breadcrumbs, faqs, applicationCategory, newsArticle]);

  return null;
};
