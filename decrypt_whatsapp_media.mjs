import { decryptMedia } from '@open-wa/wa-decrypt';
import fs from 'fs';
import mime from 'mime-types';

const processMessage = async (message) => {
  if (message.mimetype) {
    const filename = `${message.t}.${mime.extension(message.mimetype)}`;
    const mediaData = await decryptMedia(message);
    const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString('base64')}`;
    fs.writeFile(filename, mediaData, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    });
  }
};

processMessage({
  type: 'audio',
  ptt: true,
  deprecatedMms3Url:
    'https://mmg.whatsapp.net/v/t62.7117-24/27344656_1261309388396041_5542913227665457652_n.enc?ccb=11-4&oh=01_Q5AaIGMJYTCt4Phv4G3eYvcheah_FuywmnEKLBfnjF8CVa0l&oe=6736F6C5&_nc_sid=5e03e0&mms3=true',
  seconds: 3,
  mediaKey: 'DxozffLBZ8WGnE4tFM9mhN5xe90jxvCRRJhWQm66UEc=',
  mimetype: 'audio/ogg; codecs=opus',
  waveform: 'AAAAAAAAAAAAAAAAAAAAASpDSDwiHCE7PDUxOUNJSjY2NBkyQUA9OS4vHBgfAh4wLQYINjAgIBAsKSQfCAAAAA==',
  directPath:
    '/v/t62.7117-24/27344656_1261309388396041_5542913227665457652_n.enc?ccb=11-4&oh=01_Q5AaIGMJYTCt4Phv4G3eYvcheah_FuywmnEKLBfnjF8CVa0l&oe=6736F6C5&_nc_sid=5e03e0',
  size: '8761',
  filehash: 'ucLYreQe5YfxQ7+5aziJi5SUH481ByFuZYEeW84wm44=',
  fileEncSha256: '8aItWpcsWINMdudukmRSY+Mt6NTI3qA+5v5pZxFMYSM=',
  mediaKeyTimestamp: '1729077344',
});

processMessage({
  type: 'video',
  deprecatedMms3Url:
    'https://mmg.whatsapp.net/v/t62.7161-24/23653849_559516006530247_8641481265472457271_n.enc?ccb=11-4&oh=01_Q5AaIKrlVIJagOyrluVwZwNjlGaBYw0lkBP6oTpNxXu3hEI6&oe=673701CA&_nc_sid=5e03e0&mms3=true',
  width: 632,
  height: 850,
  seconds: 6,
  mediaKey: 'KEe5fi0Xe3lIYSLczj/x6njmPxvckphFRGRwqjeH36I=',
  mimetype: 'video/mp4',
  directPath:
    '/v/t62.7161-24/23653849_559516006530247_8641481265472457271_n.enc?ccb=11-4&oh=01_Q5AaIKrlVIJagOyrluVwZwNjlGaBYw0lkBP6oTpNxXu3hEI6&oe=673701CA&_nc_sid=5e03e0',
  size: '1161424',
  filehash: 'Zin5mywlO8qrEupVw+0Ijn5AijZKfgjB9bds7ABa+Es=',
  fileEncSha256: 'E9i2lC/UKhXDToGUUdrvx4YlLEhfu+9Ben9Ka66ZCCc=',
  jpegThumbnail:
    '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgANgMBIgACEQEDEQH/xAAvAAACAwEBAAAAAAAAAAAAAAAABAIDBQEGAQADAQAAAAAAAAAAAAAAAAAAAQMC/9oADAMBAAIQAxAAAAB8VoaYQYkGfbeIgdAX1BFu9J2crZjSTrnA0jeNxF5EaabWZK8Hk46m8Z4Z9lmJw2rMrTqlajvZanQXGs9uAdUATJAFQCP/xAApEAACAgICAAQFBQAAAAAAAAABAgADESEEEhMxQVEFECIyM0JScoHR/9oACAEBAAE/AMDHX9PoYdjf3CW3omHzv1EflO7EVKdwce2wnxGxForVfLcI0I/KrX/Jnk34x9I9DBw0H1OS3vCa0HUATvk5mNkQCca1FOGG54q9cxr2c9UGTHqvU5YSuwg4M76BE7mcr4bkZWFLKqurzjkU1dsZJl1o6jXnLtNqcTj2XrB8O93hGZza08IkiNWnVQRoR2rss6j0l9QLruLzfCQKgAEXn5z3f5c/8I/lL17KN4E6jOQSMRujEdjD4Y8hOyftMZ1QZJnNvSxFCt6y7D1/1FR87JgSdD7xjg7EtvawkkwLkZMB7LiOANQDHy0fOIMncLahbqYWJmzD9pnbU//EABwRAAIDAAMBAAAAAAAAAAAAAAABAhAREiAxYf/aAAgBAgEBPwCtpjkyNyI+GfXTb0TeHLr/AP/EAB0RAAICAQUAAAAAAAAAAAAAAAABAhEQEiAhMYH/2gAIAQMBAT8A2JEYqiSzHolVnhQlwNKzTi8//9k=',
  streamingSidecar:
    'HXEJGyDAFEjObNudrkLNoQl3FDduyyl4VZ5xNi+BDQF9EYzmGtLAjlCjmDHVS3EXpz3zoA2aEBb3eTyMIjCZ8qSgvxR+ut52t27iULkkRG531njlH8qR/hYeGkRpt+N7pRROQ39ud6DQClPOEHADeva7HS9zwzb+t/f734sosCQ4XER1ENIx1ooZh+wotWmIDowSMzR7jUdUfs6fJFfAUQjkkG9r/bG3Es886HIASF4r29mv',
  mediaKeyTimestamp: '1729078707',
});

processMessage({
  type: 'image',
  deprecatedMms3Url:
    'https://mmg.whatsapp.net/o1/v/t62.7118-24/f1/m232/up-oil-image-02e22a6e-a126-4f73-88f3-4125b73c3b82?ccb=9-4&oh=01_Q5AaIPGsTUJctwjzyO98Na9qk05cnSNl5liVlqO2kbOusUJZ&oe=67374CCA&_nc_sid=e6ed6c&mms3=true',
  width: 1280,
  height: 619,
  caption: 'Teste image',
  mediaKey: 'MXrkO6YWsA8GL2umnCE/WRk838GHVLhlMctHhUftABw=',
  mimetype: 'image/jpeg',
  directPath:
    '/o1/v/t62.7118-24/f1/m232/up-oil-image-02e22a6e-a126-4f73-88f3-4125b73c3b82?ccb=9-4&oh=01_Q5AaIPGsTUJctwjzyO98Na9qk05cnSNl5liVlqO2kbOusUJZ&oe=67374CCA&_nc_sid=e6ed6c',
  size: '176008',
  filehash: 'Reve48SSk98MyAvRDrXXiKAjbhHC+jDSuevBuGB2LYs=',
  contextInfo: {
    expiration: 0,
    disappearingMode: {
      initiator: 'CHANGED_IN_CHAT',
    },
    ephemeralSettingTimestamp: '0',
  },
  fileEncSha256: 'kke4fT46Ly+xqH665g0ekqAIMLnDsBefN/osjmFEBoo=',
  jpegThumbnail:
    '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',
  mediaKeyTimestamp: '1729085917',
});
