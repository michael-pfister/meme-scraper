import asciiArt from 'ascii-art';
import cliProgress from 'cli-progress';
import { downloadFile, httpRequest, imageLinks } from './functions.js';

//heading
await asciiArt
  .font('meme scraper', 'doom')
  .then((rendered) => {
    console.log(rendered);
  })
  .catch((error) => {
    console.log(error);
  });

//initialize Progress bar
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

//action according to user input
if (process.argv[2]) {
  bar1.start(100, 0);

  //download requested file
  downloadFile(
    `https://api.memegen.link/images/${process.argv[4]}/${process.argv[2]}/${process.argv[3]}.jpg`,
    './images/custom.jpg',
  );

  bar1.update(100);
  bar1.stop();
} else {
  bar1.start(100, 0);

  //get array of HTML tags
  let htmlLines = (
    await httpRequest('http://memegen-link-examples-upleveled.netlify.app/')
  ).data.split('\n');

  //extract links
  let _imageLinks = imageLinks(htmlLines);

  //download files
  for (let index = 0; index < 10; index++) {
    if (index < 10) {
      await downloadFile(_imageLinks[index], `images/0${index}.jpg`);
    } else {
      await downloadFile(_imageLinks[index], `images/${index}.jpg`);
    }

    bar1.update((index + 1) * 10);
  }

  bar1.stop();
}
