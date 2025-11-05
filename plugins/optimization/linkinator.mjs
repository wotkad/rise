import { LinkChecker } from 'linkinator';
import chalk from 'chalk';

async function linkinator() {
  const linkCheckMode = process.argv[2];
  const linkExtRe = /https?:\/\//g;
  const linksInfo = {
    brokenLinks: [],
    linksCount: 0,
  };
  const PORT = '8080'
  const BASE_URL = `http://localhost:${PORT}`;

  const excludedKeywords = [
    '.xml',
    '/assets',
  ];

  switch (linkCheckMode) {
    case 'internal':
      console.log('Running internal link check...');
    break;

    case 'external':
      console.log('Running external link check...');
    break;

    default:
      console.log('Running both internal and external link check...');
  }

  const checker = new LinkChecker();

  checker.on('link', (link) => {
    if (link.url.match(linkExtRe)) {
      const internalLink = excludedKeywords.filter(
        keyword => link.url.match(keyword)
      );

      if (linkCheckMode === 'external' && link.url.match(BASE_URL)) return;
      if (linkCheckMode === 'internal' && !link.url.match(BASE_URL)) return;
      if (
        linkCheckMode === 'internal' && internalLink.length ||
        linkCheckMode === 'all' && internalLink.length
      ) return;

      linksInfo.linksCount++;

      if (link.status === 404) {
        linksInfo.brokenLinks.push({
          url: link.url,
          parent: link.parent,
        });
      }
    }
  });

  await checker.check({
    path: BASE_URL,
    recurse: true,
  });

  console.log(`Total links found: ${linksInfo.linksCount}`);

  if (linksInfo.brokenLinks.length) {
    console.log(`Broken links: ${chalk.bold.red(linksInfo.brokenLinks.length)}`);

    for (const brokenLink of linksInfo.brokenLinks) {
      console.log('');
      console.log(chalk.bold.red(`Link: ${brokenLink.url}`));
      console.log(chalk.cyan(`  Page: ${brokenLink.parent}`));
    }

    process.exit(0);
  } else {
    console.log(chalk.bold.green(`No links found`));

    process.exit(0);
  }
}
linkinator();