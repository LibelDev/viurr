# Viurr

Download programmes from Viu

## Install

If you have already installed `node>=8` and `npm`/`yarn`, you can install Viurr globally to make it available in `PATH`.

```bash
# npm
npm install -g viurr
```

```bash
# Yarn
yarn global add viurr
```

Otherwise, you could download the pre-build executables :

- [Linux](https://github.com/kitce/viurr/raw/master/builds/viurr-linux)
- [macOS](https://github.com/kitce/viurr/raw/master/builds/viurr-macos)
- [Windows](https://github.com/kitce/viurr/raw/master/builds/viurr-win.exe)

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
viurr download episode <type> <productId> <filePathTemplate>
```

```bash
# Download files of a series
viurr download series <type> <productId> <filePathTemplate>
```

---

#### Options

`type`

`cover` | `description` | `subtitle` | `video`

Specify `--help` to see the available options of each `type`, for example :

```bash
$ viurr download episode video --help
viurr download episode video <productId> <filePathTemplate>

Download video(s) of an episode

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --quality  Video quality
         [array] [choices: "1080p", "720p", "480p", "240p"] [default: ["1080p"]]
```

---

`productId`

The id that can be found in the URL on viu.com, for example,

URL : `https://www.viu.com/ott/hk/zh-hk/vod/6979/男兒當入樽`

Product ID : `6979`

---

`filePathTemplate`

The path template for the output files, can be relative or absolute.
It will receive the following values :

| Variable | Description | `cover` | `description` | `subtitle` | `video` |
| --- | --- | :---: | :---: | :---: | :---: |
| `PRODUCT_ID` | Product ID  | ✔ | ✔ | ✔ | ✔ |
| `SERIES_TITLE` | Series title | ✔ | ✔ | ✔ | ✔ |
| `EPISODE_NUMBER` | Episode Number | ✔ | ✔ | ✔ | ✔ |
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
$ viurr download episode cover 6979 "{{SERIES_TITLE}}/{{EPISODE_NUMBER}}.{{EPISODE_TITLE}}.{{EXT}}"
Downloading cover image of "6979"
Finished : <cwd>/男兒當入樽/1.天才籃球員誕生.jpeg
```

Description

```bash
$ viurr download episode description 6979 "{{SERIES_TITLE}}/{{EPISODE_NUMBER}}.{{EPISODE_TITLE}}.txt"
Downloading description of "6979"
Finished : <cwd>/男兒當入樽/1.天才籃球員誕生.txt
```

Subtitle

```bash
$ viurr download episode subtitle 6979 "{{SERIES_TITLE}}/{{EPISODE_NUMBER}}.{{EPISODE_TITLE}}.{{SUBTITLE_NAME}}.srt"
Downloading subtitle of "6979" (Language ID : 1)
Finished : <cwd>/男兒當入樽/1.天才籃球員誕生.繁體中文.srt
```

Video

This program uses ffmpeg to encode the HLS playlist file and output the video with the original codecs. (i.e. `-vcodec copy -acodec copy`)

Therefore, ffmpeg and ffprobe need to be available in `PATH`.

You can also set the absolute paths to the env `FFMPEG_PATH` and `FFPROBE_PATH` to use the specified executables.

Learn more from [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#ffmpeg-and-ffprobe)

```bash
$ viurr download episode video 6979 "{{SERIES_TITLE}}/{{EPISODE_NUMBER}}.{{EPISODE_TITLE}}.{{QUALITY}}.mp4" --quality 720p
Downloading video of "6979" (Quality : 720p)
Finished : <cwd>/男兒當入樽/1.天才籃球員誕生.720p.mp4
```

#### Note

It is recommended to use `inspect` to see the available subtitles and video qualities before attempting to download the files.

`download series` is a shortcut to `download episode` to handle all available episodes in a series.

When using `download series` , make sure to construct the `filePathTemplate` correctly with unique episode values (e.g. `EPISODE_NUMBER`, `EPISODE_TITLE`) to avoid file conflicts, the program will be terminated if it tries to write to an existing file.

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
type QualityChoice = "1080p" | "720p" | "480p" | "240p";

interface Subtitle {
  name: string;
  url: string;
  languageId: string;
}

interface BasicEpisode {
  productId: string;
  number: number;
  title: string;
  description: string;
  coverImageURL: string;
}

interface URL {
  s240p: string;
  s480p: string;
  s720p: string;
  s1080p: string;
}

interface Episode extends BasicEpisode {
  urls: URL;
  subtitles: Subtitle[];
}

interface Series {
  title: string;
  description: string;
  coverImageURL: string;
  total: number;
  episodes: BasicEpisode[];
}
```

#### Inspect

```js
import {inspect} from 'viurr';
```

Inspect the details of an episode

`inspect.episode(productId: string): Promise<Episode>`

Inspect the details of a series

`inspect.series(productId: string): Promise<Series>`

#### Download

```js
import {download} from 'viurr';
```

Each method exposed in `download` returns a `Promise` that resolves the rendered file path.

Download the cover image

`download.cover(productId: string, filePathTemplate: string): Promise<string>`

Save the description as plain text file

`download.description(productId: string, filePathTemplate: string): Promise<string>`

Download the subtitle in specific language

`download.subtitle(productId: string, filePathTemplate: string, languageId: string): Promise<string>`

Download the video in specific quality

`download.video(productId: string, filePathTemplate: string, quality: QualityChoice): Promise<string>`

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
