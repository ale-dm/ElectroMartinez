import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = 'ElectroMartinez - Tu tienda de electrodomésticos',
    description = 'Encuentra los mejores electrodomésticos y electrónica para tu hogar. Lavadoras, frigoríficos, TVs y más con envío gratis.',
    keywords = 'electrodomésticos, lavadoras, frigoríficos, televisores, electrónica, hogar',
    image = '/logo.png',
    url = window.location.href,
    type = 'website',
    author = 'ElectroMartinez',
    price = null,
    currency = 'EUR',
    availability = null,
    canonical = null
}) => {
    const siteName = 'ElectroMartinez';
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="es_ES" />

            {/* Product specific OG tags */}
            {type === 'product' && (
                <>
                    {price && <meta property="product:price:amount" content={price} />}
                    {currency && <meta property="product:price:currency" content={currency} />}
                    {availability && <meta property="product:availability" content={availability} />}
                </>
            )}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:creator" content="@electromartinez" />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Spanish" />
            <meta name="author" content={author} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            
            {/* Geo Tags */}
            <meta name="geo.region" content="ES" />
            <meta name="geo.placename" content="España" />
            
            {/* Mobile Web App */}
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content={siteName} />
            
            {/* Theme Color */}
            <meta name="theme-color" content="#f59e0b" />
            <meta name="msapplication-TileColor" content="#f59e0b" />
        </Helmet>
    );
};

export default SEO;
