# One Day in One Image — World News, 24 November 2026

![make.fun bounty](https://make.fun/badge/news-image-20261124.svg) ![rank](https://make.fun/badge/news-image-20261124/cj473565/news-image-20261124/rank.svg) ![reward](https://make.fun/badge/news-image-20261124/cj473565/news-image-20261124/reward.svg)

用一张图总结 2026 年 11 月 24 日（周二）的世界新闻。

A single image that sums up the world news of Tuesday, 24 November 2026: six stories from that day, drawn together into one picture.

## What's in the image

The picture brings together these six news stories from 24 November 2026:

1. **霍尔木兹海峡油轮触雷** — 伊朗称四艘油轮在霍尔木兹海峡触雷。
2. **华为案裁决** — 美国陪审团裁定华为窃取商业机密与银行欺诈罪成。
3. **乌克兰袭击俄罗斯船只** — 乌克兰袭击利比亚外海与芬兰湾的俄罗斯船只。
4. **英伟达换帅** — 英伟达恢复黄仁勋 CEO 职务。
5. **利雅得高塔遭无人机袭击** — 无人机袭击利雅得最高塔致 11 人受伤。
6. **塞内加尔重夺非洲杯** — 塞内加尔经体育法庭上诉重夺非洲杯冠军。

## How it works

The repository holds just the artwork (`entry.png`) and a small runner (`main.ts`, Node 22, standard library only, no network access). When the program runs, it:

- locates `entry.png` next to `main.ts`,
- checks the file exists and starts with a PNG or JPEG signature,
- copies the image bytes unchanged to `entry.png` inside the output directory (`MAKEFUN_OUTPUT_DIR`, or `/output` when the variable is not set),
- verifies the written file has the same byte size as the source.

## Run it locally

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

After it finishes, the image is at `out/entry.png`.

## Bounty

This is an entry for the make.fun bounty: https://make.fun/bounty/news-image-20261124

## License

MIT — see [LICENSE](LICENSE).
