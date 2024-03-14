import fs from 'fs';
import sitemap from 'sitemap';

const hostname = 'https://www.en-gramma.com';

const urls = [
  { url: '/', changefreq: 'monthly', priority: 1 },
  { url: '/music', changefreq: 'monthly', priority: 0.8 },
  { url: '/media', changefreq: 'monthly', priority: 0.8 },
  { url: '/bio', changefreq: 'monthly', priority: 0.8 },
  { url: '/tour', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.8 },
];

const sitemapInstance = sitemap.createSitemap({
  hostname,
  urls,
});

// Generate XML sitemap
const xml = sitemapInstance.toString();

// Write sitemap to file
fs.writeFileSync('sitemap.xml', xml);