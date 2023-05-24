import debugFactory from 'debug';
import fs from 'fs/promises';
import ms from 'ms';
import Mustache from 'mustache';
import path from 'path';
import { SrtSubtitlePosition } from '../types/types';

const debug = debugFactory('viurr:helpers:subtitle');

interface ISubtitle {
  number: number;
  timecode: readonly [readonly [start: string, end: string], readonly [start: number, end: number]];
  dialogue: string;
}

const SUBTITLE_TEMPLATE_FILEPATH = path.resolve(__dirname, '../../templates/subtitle.template.txt');
debug('SUBTITLE_TEMPLATE_FILEPATH', SUBTITLE_TEMPLATE_FILEPATH);

const parseSRT = (srt: string): ISubtitle[] => {
  const subtitles = srt.trim().split(/\r?\n\r?\n/).map((part) => part.split(/\r?\n/));
  return subtitles.map((subtitles) => {
    const [number, timecode, ...dialogues] = subtitles;
    return {
      number: parseInt(number, 10),
      timecode: parseTimecode(timecode),
      dialogue: dialogues.join('\n')
    };
  });
};

const parseTimecode = (timecode: string) => {
  const [start, end] = timecode.split(' --> ');
  const msStart = parseTimestampToMilliseconds(start);
  const msEnd = parseTimestampToMilliseconds(end);
  return [[start, end], [msStart, msEnd]] as const;
};

const parseTimestamp = (timestamp: string) => {
  const [hours, minutes, seconds, milliseconds] = timestamp.split(/[:,]/);
  return [
    parseInt(hours, 10),
    parseInt(minutes, 10),
    parseInt(seconds, 10),
    parseInt(milliseconds, 10)
  ] as const;
};

const parseTimestampToMilliseconds = (timestamp: string) => {
  const [hours, minutes, seconds, milliseconds] = parseTimestamp(timestamp);
  return (
    ms(`${hours}h`) +
    ms(`${minutes}m`) +
    ms(`${seconds}s`) +
    milliseconds
  );
};

const renderSubtitle = (template: string, subtitle: ISubtitle) => {
  const { timecode } = subtitle;
  const [start, end] = timecode[0];
  return Mustache.render(template, { ...subtitle, start, end });
};

const patchSubtitlePosition = (subtitle: ISubtitle, position?: SrtSubtitlePosition): ISubtitle => {
  const tag = typeof position !== 'undefined' ? `{\\an${position}}` : '';
  const dialogue = [tag, subtitle.dialogue].join('');
  return { ...subtitle, dialogue };
};

export const patchSrtPosition = async (srt: string, position: SrtSubtitlePosition) => {
  const subtitles = parseSRT(srt);
  const template = await fs.readFile(SUBTITLE_TEMPLATE_FILEPATH, 'utf-8');
  return subtitles
    .map((subtitle) => patchSubtitlePosition(subtitle, position))
    .map((subtitle) => renderSubtitle(template, subtitle))
    .join('\n\n');
};

export const mergeSRTs = async (a: string, b: string) => {
  const aSubtitles = parseSRT(a);
  const bSubtitles = parseSRT(b);
  const subtitles = ([] as ISubtitle[]).concat(aSubtitles, bSubtitles);
  subtitles.sort((a, b) => {
    if (a.number === b.number) {
      return a.timecode[1][0] - b.timecode[1][0];
    }
    return a.number - b.number;
  });
  const template = await fs.readFile(SUBTITLE_TEMPLATE_FILEPATH, 'utf-8');
  return subtitles
    .map((subtitle) => renderSubtitle(template, subtitle))
    .join('\n\n');
};
