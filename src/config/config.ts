import path from 'path';
import yargs from 'yargs';

export enum Mode {
  Episode, // download the target episode only
  Series // download the complete series
}

export enum Quality {
  FullHD = 's1080p',
  High = 's720p',
  Good = 's480p',
  Low = 's240p'
}

const qualities: Quality[] = [
  Quality.FullHD,
  Quality.High,
  Quality.Good,
  Quality.Low,
];

const argv = yargs
  .option('episode', {
    string: true,
    number: true,
    demandOption: true,
    conflicts: 'series',
    description: 'Process the single episode of the given episode id'
  })
  .option('series', {
    string: true,
    number: true,
    demandOption: true,
    conflicts: 'episode',
    description: 'Process the complete series of the given episode id'
  })
  .option('video', {
    alias: 'v',
    string: true,
    coerce: path.resolve,
    description: 'Video file output path for each episode'
  })
  .options('quality', {
    alias: 'q',
    string: true,
    choices: qualities,
    default: Quality.FullHD,
    description: 'Video quality, only works when --video is specified'
  })
  .options('cover', {
    alias: 'c',
    string: true,
    coerce: path.resolve,
    description: 'Cover image file output path for each episode'
  })
  .options('subtitle', {
    alias: 's',
    string: true,
    coerce: path.resolve,
    description: 'Subtitle file output path for each episode'
  })
  .options('description', {
    alias: 'd',
    string: true,
    coerce: path.resolve,
    description: 'Description text file output path for each episode'
  })
  .argv;

const config = {
  target: argv.episode || argv.series,
  mode: argv.episode ? Mode.Episode : Mode.Series,
  video: {
    enabled: !!argv.video,
    filepathTemplate: argv.video,
    options: {
      quality: argv.quality
    }
  },
  cover: {
    enabled: !!argv.cover,
    filepathTemplate: argv.cover
  },
  subtitle: {
    enabled: !!argv.subtitle,
    filepathTemplate: argv.subtitle
  },
  description: {
    enabled: !!argv.description,
    filepathTemplate: argv.description
  }
};

export default config;
