# Viurr

Download programmes from Viu

## Install

If you have already installed `node>=12` and `npm`/`yarn`, you can install Viurr globally to make it available in `PATH`.

```bash
# npm
npm install -g viurr
```

```bash
# Yarn
yarn global add viurr
```

Otherwise, you could [download the pre-build executables](https://github.com/kitce/viurr/releases)

You may want to rename the executable to `viurr`, then put it in your `PATH` or any directory you want to execute from.

## Usage

### Command Line Interface

#### Inspect

```bash
# Inspect the details of an episode
viurr inspect episode <productId>
```

```bash
# Inspect details of a series
viurr inspect series <productId>
```

| Option | Description |
| --- | --- |
| `--json` | Print the result in JSON format |

#### Download

```bash
# Download files of an episode
viurr download episode <type> <productId> [filepath]
```

```bash
# Download files of a series
viurr download series <type> <productId> [filepath]
```

---

#### Options

`type`

`cover` | `description` | `subtitle` | `video`

Specify `--help` to see the available options of each `type`, for example:

```bash
$ viurr download episode video --help
viurr download episode video <productId> [filepath]

Download video of an episode

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --quality  Video quality
          [string] [choices: "1080p", "720p", "480p", "240p"] [default: "1080p"]
```

---

`productId`

The id that can be found in the URL on viu.com, for example,

URL: `https://www.viu.com/ott/hk/zh-hk/vod/6979/男兒當入樽`

Product ID: `6979`

---

`filepath` *Optional*

The path template for the output files, can be relative or absolute.
It will receive the following values:

| Variable | Description | `cover` | `description` | `subtitle` | `video` |
| --- | --- | :---: | :---: | :---: | :---: |
| `PRODUCT_ID` | Product ID  | ✔ | ✔ | ✔ | ✔ |
| `SERIES_TITLE` | Series title | ✔ | ✔ | ✔ | ✔ |
| `EPISODE_NUMBER` | Episode number | ✔ | ✔ | ✔ | ✔ |
| `EPISODE_TITLE` | Episode title | ✔ | ✔ | ✔ | ✔ |
| `QUALITY` | Video quality | | | | ✔ |
| `SUBTITLE_NAME` | Subtitle name/language | | | ✔ | |
| `EXT` | Suggested file extension | ✔ | | | |

Each `{{VARIABLE}}` will be replaced with the value.

Learn more from [mustache.js](https://github.com/janl/mustache.js)

---

#### Examples

Cover image

```bash
$ viurr download episode cover 6979
Downloading cover image of "男兒當入樽" EP.1 "天才籃球員誕生"
Downloaded: /Users/kit.lee/Workspace/Personal/viurr/1-天才籃球員誕生.jpeg
```

Description

```bash
$ viurr download episode description 6979
Downloading description of "男兒當入樽" EP.1 "天才籃球員誕生"
Downloaded: /Users/kit.lee/Workspace/Personal/viurr/1-天才籃球員誕生.txt
```

Subtitle

```bash
$ viurr download episode subtitle 6979
Downloading subtitle of "男兒當入樽" EP.1 "天才籃球員誕生" (Language ID: 1)
Downloaded: /Users/kit.lee/Workspace/Personal/viurr/1-天才籃球員誕生.chi.srt
```

Video

This program uses FFmpeg to encode the HLS playlist file and output the video with the original codecs. (i.e. `-c copy`).

If you already have FFmpeg available in your `PATH`, then you are good to go, otherwise, you need to set the environment variable `FFMPEG_PATH` as the path to the executable FFmpeg.

```bash
$ viurr download episode video 6979
Downloading video of "男兒當入樽" EP.1 "天才籃球員誕生" (Quality: 1080p)

# encode in progress
Encoding [208.47/fps] [1745.6 Kb/s] [22.25 MB] [00:01:46]

# after finished
Downloaded: /Users/kit.lee/Workspace/Personal/viurr/1-天才籃球員誕生.mkv
```

#### Note

- `download series` is a shortcut to `download episode` to handle all available episodes in a series.
- When using `download series` , make sure to construct the `filepath` correctly with unique episode values (e.g. `EPISODE_NUMBER` or `EPISODE_TITLE`) to avoid file conflicts, the program will be terminated if it tries to write to an existing file.
- It is recommended to use `inspect` to see the available subtitles and video qualities before attempting to download the files.

### Programmatic

Install as local module

```bash
# npm
npm install viurr --save
```

```bash
# Yarn
yarn add viurr
```

#### Types

```ts
interface ISubtitle {
  name: keyof typeof SubtitleLanguageCode;
  url: string;
  languageId: string;
}

interface IEpisodeBase {
  productId: string;
  number: number;
  title: string;
  description: string;
  coverImageURL: string;
}

interface IEpisode extends IEpisodeBase {
  urls: IURL;
  subtitles: ISubtitle[];
}

interface ISeries {
  title: string;
  description: string;
  coverImageURL: string;
  total: number;
  episodes: IEpisodeBase[];
}

interface IURL {
  s240p: string;
  s480p: string;
  s720p: string;
  s1080p: string;
}

enum Quality {
  '1080p' = 's1080p',
  '720p' = 's720p',
  '480p' = 's480p',
  '240p' = 's240p'
}

type QualityOption = keyof typeof Quality;

enum LanguageFlag {
  TraditionalChinese = '1',
  English = '3',
  Indonesian = '7',
  Thai = '8'
}

enum SubtitleLanguageCode {
  '繁體中文' = 'chi', // 1
  'English' = 'eng', // 3
  'Indo' = 'ind', // 7
  'ภาษาไทย' = 'tha', // 8
  'Undefined' = 'und' // default
}
```

Learn more [here](https://github.com/kitce/viurr/blob/master/src/types/viu.types.ts)

#### Inspect

```js
import { inspect } from 'viurr';
```

Inspect the details of an episode

`inspect.episode(productId: string): Promise<IEpisode>`

Inspect the details of a series

`inspect.series(productId: string): Promise<ISeries>`

#### Download

```js
import { download } from 'viurr';
```

Download the cover image

`download.cover(productId: string, filename?: string): Promise<[ISeries, IEpisode, string]>`

Save the description as plain text file

`download.description(productId: string, filename?: string): Promise<[ISeries, IEpisode, string]>`

Download the subtitle in specific language in SRT format

`download.subtitle(productId: string, filename?: string, languageId = LanguageFlag.TraditionalChinese): Promise<[ISeries, IEpisode, string]>`

Download the video in specific quality

`download.video(productId: string, filename?: string, quality: QualityChoice = '1080p'): Promise<[ISeries, IEpisode, string, ReturnType<typeof encode>]>`

## TODO
- [x] Default filename
- [x] Progress bar
- [ ] Option to overwrite existing file
- [ ] Interactive CLI

## Contribute

```bash
yarn install
yarn build
```

## Test

Not available

## License

MIT License

## Disclaimer

This project is for technical testing and educational purposes only. The owner and contributors do not assume any legal responsibilities caused by the users. Users should be aware of and take the risks.
