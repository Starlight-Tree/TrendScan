# データと出典

- 「ランキング」の点数・推移・前年比はすべてモックで、測定値でも公式の順位でもありません。
- 「データ」のタブ（生成 AI・IT・AI 導入・企業の業績）の数字と解説は、サンプル（モック）の扱いです。AI が公開資料を調べてまとめたもので、正確さは保証しません。
- 解説・一覧・数字は固定で、自動では更新しません（キーワードを除く）。
- 確認日は、日付の断りがないものは 2026-11-27 です。

## ランキング

### 順位（名前は実在、点数はモック）

言語は 15 件、ほかは 10 件です。並び順の参考にした資料と、このサイトの点数は別のものです。

| タブ | 並び順 |
|---|---|
| 言語 | 1〜3 位は [GitHub Octoverse 2026](https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/)（月間の貢献者数）。9〜15 位の 7 言語どうしの順は [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology/data/languages)（全回答者の利用率。SQL・HTML/CSS・シェル・アセンブリは除く）。4〜8 位と、7 言語を 8 位より下に置いたことはモック |
| AI モデル | 並びと点数はモックで、性能の順ではありません。3 社を、11 月の直近の発表が新しい順（Google・OpenAI・Anthropic）に 1 件ずつ交互に並べています。版ごとの名前で過去の値がないため、推移と前年比はありません |
| AI エージェント | [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent) の、過去 1 年の利用率の上位 10 |
| AI チャット・AI 企業・クラウド | すべてモック |

AI モデルの名前は、[Anthropic のモデル一覧](https://platform.claude.com/docs/en/models/overview)、[Google DeepMind の Gemini のページ](https://deepmind.google/models/gemini/)、[OpenAI の発表](https://openai.com/index/introducing-gpt-6-2-astra-sol/)などで確かめました（2026-11-28）。

### 推移（モック）

上位 8 件を出します。期間は、言語が 2007〜2026 年、クラウドが 2017〜2026 年、AI エージェント・AI チャット・AI 企業が 2023〜2026 年です。提供前の年は空欄です（前の名前の時期は、提供していたとみなします）。

| 名前 | 値がある最初の年 |
|---|---|
| Claude Code・OpenAI Codex（エージェント）・Google Antigravity・OpenCode・DeepSeek（チャットのアプリの公開年） | 2025 |
| Windsurf | 2024 |
| CoreWeave（GPU クラウドの開始年。資料によって違い、2019 が多い） | 2019 |
| TypeScript（最初の公開）・Rust（試験版 0.1 の公開） | 2012 |
| Go（オープンソースの公開） | 2009 |

### 解説

次の資料をもとに自分の言葉で書きました。モックの点数は使っていません。資料へのリンクは、画面の解説の下にあります。

| タブ | もとにした資料 |
|---|---|
| 言語 | GitHub Octoverse 2025・2026 |
| AI モデル | Anthropic・Google・OpenAI の発表（ニュースの一覧と同じページ） |
| AI エージェント | Stack Overflow Developer Survey 2026 の AI の章と、コーディングエージェントの集計 |
| AI チャット | [Alphabet の 2026 年 7〜9 月期の決算発表](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm)、[同じ期の決算説明での CEO の発言](https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q3-2026/)、Google の Gemini 4 Carbon・Neon の発表。Gemini アプリの利用者数が月間であることは、CEO の発言のページの図の代替テキスト（monthly active users）が根拠です（本文と決算発表には期間がありません） |
| AI 企業 | [NVIDIA の決算発表](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000088/q3fy27pr.htm)（2026-11-17）と、Anthropic の資金調達の発表（2026-05-28） |
| クラウド | 2026 年 7〜9 月期の決算発表：[Amazon](https://www.sec.gov/Archives/edgar/data/1018724/000101872426000038/amzn-20260930xex991.htm)・[Alphabet](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm)・[Microsoft](https://www.sec.gov/Archives/edgar/data/789019/000119312526436122/msft-ex99_1.htm)。範囲が違い、Google Cloud は Google Workspace と TPU のシステムの販売を含みます。Microsoft は Azure の伸び率だけを使います。伸びの理由は Google の説明だけを書きます |

## トピック

### ニュース

公開元のページなどで確かめた出来事を、自分の言葉で短くまとめ、元のページへリンクします。画像は自作のモックです（`images/news/`）。

### 技術記事

[Qiita API v2](https://qiita.com/api/v2/docs) で取得した、11 月 20〜27 日の投稿でストック 10 以上の 17 件のうち、いいねの上位 10 件です。いいねの数は取得した時点のものです。持つのは題・最初のタグ・いいねの数・リンクだけで、本文は持たず、投稿者名は表示しません（リンクの URL には投稿者の ID が含まれます）。解説は、記事をもとに自分の言葉で書いた傾向です。

### 動画

公式チャンネル（GitHub・Google for Developers・OpenAI・Anthropic）の、11 月 24〜26 日（日本時間）公開の動画から、開発に関係する 6 本を選びました（ショートは除きます。再生回数などの順位ではありません）。

題と説明は、YouTube の題と説明欄をもとに自分の言葉で書きました。各パネルは動画ページへのリンクです。サムネは自作のモックで（`images/videos/`）、YouTube のサムネイルは使わず、プレイヤーも埋め込みません。

### キーワード

タブを開いたときに、決めた 8 語の日本語版 Wikipedia の記事の閲覧数を取得します。見出しと要点は、取得した数字（閲覧数の最多と次点、前の週からの伸びが最大の言葉）から自動で作り、増減の理由は書きません。取得先の仕様や利用の上限で、表示できないことがあります。

記事の名前が画面の表記と違う言葉は、次のとおりです。

| 画面の言葉 | Wikipedia の記事 |
|---|---|
| 生成AI | 生成的人工知能 |
| 大規模言語モデル（LLM） | 大規模言語モデル |
| AIエージェント | 知的エージェント |
| MCP | Model Context Protocol |
| Gemini | Gemini (チャットボット) |

言葉の説明は固定の文章で、次の資料を読んで自分の言葉で書きました（画面に出るのは、伸びが最大の言葉の分だけです）。

| 言葉 | 資料 |
|---|---|
| 生成AI | [AWS の解説](https://aws.amazon.com/what-is/generative-ai/) |
| 大規模言語モデル（LLM） | [AWS の解説](https://aws.amazon.com/what-is/large-language-model/) |
| ChatGPT | [OpenAI のヘルプ](https://help.openai.com/en/articles/6783457-what-is-chatgpt) |
| AIエージェント | [AWS の解説](https://aws.amazon.com/what-is/ai-agents/) |
| バイブコーディング | [IBM の解説](https://www.ibm.com/think/topics/vibe-coding) |
| MCP | [MCP の公式ドキュメント](https://modelcontextprotocol.io/docs/getting-started/intro) |
| Claude | [Claude の公式ページ](https://claude.com/product/overview) |
| Gemini | [Gemini の公式ページ](https://gemini.google/about/) |

## データ

見出し・要点・注記は、AI が次の資料を読んで書きました。グラフと表は、このサイトで作っています。

### 生成 AI

総務省の令和 8 年版 情報通信白書に載る、インターネット調査の結果です。

| 値 | もとのページ |
|---|---|
| 企業の業務ごとの生成 AI の活用状況（日本）：13 業務 | [図表Ⅰ-2-1-7](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/html/nd121130.html)と、その [CSV](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/csv/f00033_01.csv) |
| 個人の目的ごとの AI の利用状況（日本）：11 の目的 | [図表Ⅰ-1-1-10](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/html/nd111330.html)と、その [CSV](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/csv/f00015.csv) |

- 調査は、2026 年 1〜2 月の、調査会社のモニターへのインターネット調査です（[付注](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/html/ne110000.html)）。
- 企業：デジタル化を始めた従業員 10 人以上の企業の、管理職以上が回答しています（日本の有効回答は 515）。日本の企業全体の割合ではありません。活用方針の質問に「わからない」と答えた回答は除きます。
- 企業の割合は、「業務プロセスが AI 中心に変更されている」「部署内の特定業務で活用している」「従業員が個人作業の効率化で活用している」の合計です。分母には「未導入」「わからない」「社内に該当業務はない」も含みます。「上記の業務に当てはまらない業務」は出しません。要点の「効果を感じる割合も目立って高い」は、同じ節の本文と図表によります。
- 個人：年齢と性別が偏らないように選んだ 15〜69 歳です（日本の有効回答は 1,236）。割合は「定期的に利用している」と「ほとんど利用しないが、過去に何度か利用したことはある」の合計で、**生成 AI に限らない AI の利用**です。
- 合計は、丸められた公表値どうしを足したものです。

### IT・AI 導入

| 画面の表示 | 出どころと値 | 対象 |
|---|---|---|
| IoT・AI の導入率（国内） | 総務省「通信利用動向調査報告書（企業編）」の図表 6-2（令和 3・4 年は図表 7-2）の「導入している」。[令和 3 年](https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202100_002.pdf)・[令和 4 年](https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202200_002.pdf)・[令和 5 年](https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202300_002.pdf)・[令和 6 年](https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202400_002.pdf)・[令和 7 年](https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202500_002.pdf) | 常用雇用者 100 人以上の企業（各年 8 月末） |
| 生成 AI を使う人の割合（世界の国別） | Microsoft の [AI Diffusion Report の公開データ](https://github.com/microsoft/ai-diffusion-report) の `data/AI_Diffusion_Q22026_Update.csv`（2026-11-28 に取得）の「H1 2025」と「Q2 2026」 | 各国・地域の 15〜64 歳 |

- 国内は「IoT や AI などのシステムやサービス」の導入で、**AI だけの割合ではありません**。公表の値のままです。
- 「サービス業、その他」には、農業・林業、漁業、鉱業、電気・ガス・熱供給・水道、物品賃貸、学術研究・専門技術サービス、宿泊・飲食、生活関連サービス・娯楽、教育・学習支援、医療・福祉、複合サービス事業、ほかに分類されないサービス業が含まれます（令和 7 年の報告書の概要の表）。
- 世界は、期間中に生成 AI の製品を使った人の割合の推計で、**企業の導入率ではありません**。Microsoft の匿名の利用データを OS と端末のシェア、インターネットの普及率、人口で補正しています（[発表](https://blogs.microsoft.com/on-the-issues/2026/09/21/the-continued-state-of-global-ai-diffusion-in-2026/)）。[技術論文](https://arxiv.org/html/2511.02781v1)（2025 年の版）によると、主に Windows のパソコンのデータで、ロシア・イラン・中国の一部は不完全な可能性があります。AI の製品も提供する会社の推計です。
- 表は、2026 年 4〜6 月の値で 20 位までの国・地域と、日本（45 位）・米国（21 位）・中国（67 位）です（韓国は 12 位）。順位はこのサイトで 147 の国・地域に付け（同じ値は同じ順位）、国名もこのサイトで訳しました。
- 要点の世界全体の 18.8% は CSV にないので、上の発表の値です（発表は「6 月」の値と書き、画面は「4〜6 月期の推計」と書きます）。
- 国内の調査と世界の推計は、対象も方法も違うので、直接は比べられません。

### 企業の業績

各社が公表した連結の売上高（売上収益）で、2026-11-28 に取得しました。`data.js` には、国内は百万円、世界は百万ドルで持ちます。

- 年度は、決算期末が 4 月〜翌年 3 月の間にある年です。期末は、NEC・野村総合研究所・LINEヤフーが 3 月、楽天グループ・Alphabet・Amazon・Meta が 12 月、サイバーエージェントと Apple が 9 月（Apple は下旬の土曜日）、Microsoft が 6 月、NVIDIA が 1 月下旬です。NVIDIA の 2025 年度は、同社の 2026 年度（2026 年 1 月 25 日まで）です。
- 伸び率は 2021 年度を 0% としてこのサイトで計算し、小数第 1 位に丸めます。買収や事業の売却などによる増減も含みます。金額は億円・億ドルに丸めて表示し、為替の換算はしません。
- 会社は、業界の順位で選んだものではありません。国内の 5 社は、AI が候補を出し、5 年分を確かめられた会社です。
- 楽天グループは IFRS 第 17 号を 2023 年度の期首から適用し、2022 年度は遡って適用した値、2021 年度は適用前の値です。
- サイバーエージェントは収益認識に関する会計基準を 2022 年度から適用し、2021 年度は適用前の値です。2021〜2024 年度は過年度の訂正を反映した値です。2025 年度の有価証券報告書には 2026-04 に訂正の確認書が出ています。

国内は、有価証券報告書の「主要な経営指標等の推移」の連結の売上収益（サイバーエージェントは売上高）です（[EDINET 閲覧サイト](https://disclosure2.edinet-fsa.go.jp/)）。

| 会社 | 資料（2021〜2025 年度） |
|---|---|
| NEC | [有価証券報告書 第188期](https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBFV.pdf) |
| 野村総合研究所 | [有価証券報告書 第61期](https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBM8.pdf) |
| LINEヤフー | [有価証券報告書 第31期](https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBXD.pdf) |
| 楽天グループ | [有価証券報告書 第29期](https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTNW.pdf) |
| サイバーエージェント | [有価証券報告書 第28期](https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XCU9.pdf) |

出典：EDINET閲覧（提出）サイト（上の表の各資料）、[公共データ利用規約（第1.0版）](https://www.digital.go.jp/resources/open_data/public_data_license_v1.0)。伸び率の計算、億円への丸め、増収の理由の要約は、このサイトで行っています。

世界は、年次報告書の損益計算書の売上高です。

| 会社（使った行） | 2023〜2025 年度の資料 | 2021・2022 年度の資料 |
|---|---|---|
| Apple（Net sales） | [10-K 2025](https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/R3.htm) | [10-K 2023](https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/R3.htm) |
| Microsoft（Revenue） | [年次報告書 2025](https://www.sec.gov/Archives/edgar/data/789019/000119312525245177/d61995dars.pdf) | [10-K 2023](https://www.sec.gov/Archives/edgar/data/789019/000095017023035122/R2.htm) |
| NVIDIA（Revenue） | [10-K 2026](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/R3.htm) | [10-K 2024](https://www.sec.gov/Archives/edgar/data/1045810/000104581024000029/R3.htm) |
| Alphabet（Revenues） | [10-K 2025](https://www.sec.gov/Archives/edgar/data/1652044/000165204426000018/R5.htm) | [10-K 2023](https://www.sec.gov/Archives/edgar/data/1652044/000165204424000022/R5.htm) |
| Amazon（Total net sales） | [10-K 2025](https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/R4.htm) | [10-K 2023](https://www.sec.gov/Archives/edgar/data/1018724/000101872424000008/R4.htm) |
| Meta（Revenue） | [10-K 2025](https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/R5.htm) | [10-K 2023](https://www.sec.gov/Archives/edgar/data/1326801/000132680124000012/R5.htm) |

要点に足した背景は、次の資料の説明です。直近の年度の説明で、4 年間の伸び全体の理由ではありません。

- NVIDIA：Data Center の伸びは、AI などへの基盤の移り変わりによるもの。「約 9 割がデータセンター向け」は、Data Center（1,937 億ドル）を全体（2,159 億ドル）で割った値です（[10-K 2026](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm)）。
- Microsoft：AI のサービスへの需要の高まりなどに合わせて、データセンターの場所とサーバーの能力を増やす（[年次報告書 2025](https://www.sec.gov/Archives/edgar/data/789019/000119312525245177/d61995dars.pdf)）。
- Amazon：有形固定資産の取得が前の年より増えたのは、主に AI への投資（[2025 年 10〜12 月期の決算発表](https://www.sec.gov/Archives/edgar/data/1018724/000101872426000002/amzn-20251231xex991.htm)）。
- 楽天グループ：2025 年度の増収は、フィンテックが中心（有価証券報告書 第29期。フィンテックは 19.0% 増、モバイルは 9.6% 増）。
- 野村総合研究所：2025 年度の増収は、金融 IT ソリューションと IT 基盤サービスが中心（有価証券報告書 第61期。金融業全般向けと、クラウドなどが好調）。

## 利用条件

2026-11-28 に確認しました。

| 提供元 | 扱い |
|---|---|
| [Wikimedia Analytics API](https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/) | 閲覧数のデータは CC0 1.0 |
| [総務省の通信利用動向調査](https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202500_002.pdf) | [総務省のサイトの利用条件](https://www.soumu.go.jp/menu_kyotsuu/policy/tyosaku.html)では、リンクは自由で、コンテンツは[公共データ利用規約（第1.0版）](https://www.digital.go.jp/resources/open_data/public_data_license_v1.0)に準拠して利用できる（出典を示し、加工したときはそのことも書く）。数値データと簡単な表・グラフは著作権の対象外 |
| [総務省の情報通信白書](https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/pdf/r08riyou.pdf) | 令和 8 年版は CC BY 4.0。対象外の一覧にある図表と、第三者の出典がある文章は除く（このサイトが使う図表は一覧にない）。数値や簡単な表・グラフは自由に使える。白書の図や画像は載せない |
| [Microsoft AI Diffusion Report のデータ](https://github.com/microsoft/ai-diffusion-report) | MIT License（下の「ライセンス」） |
| [Qiita API v2](https://qiita.com/api/v2/docs) | 使う項目は上の「技術記事」のとおり。記事の権利は投稿者にある |
| [EDINET](https://disclosure2dl.edinet-fsa.go.jp/guide/static/disclosure/WZEK0030.html) の有価証券報告書 | [公共データ利用規約（第1.0版）](https://www.digital.go.jp/resources/open_data/public_data_license_v1.0)に準拠して利用できる（出典を示し、加工したときは、そのことと加工した主体も書く）。スクレイピングなどによる機械的な取得は禁止（API を使う場合などを除く）。使うのは売上高の数値と増収の理由の短い要約で、画面には各報告書へのリンクを置く |
| [SEC](https://www.sec.gov/about/privacy-information) の公開資料 | sec.gov の情報は公開情報で、許可なしに複製・再配布できる。出典に SEC を示し、印章とロゴは使わない。使うのは数値、説明の短い要約、リンクだけ |
| [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent) | データは [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/)。「言語」の 9〜15 位の順と、「AI エージェント」の順と解説の割合に使う。表示：Contains information from the Stack Overflow Developer Survey 2026 (Stack Exchange Inc.), which is made available here under the Open Database License (ODbL). |
| [YouTube](https://www.youtube.com/) | 使い方は上の「動画」のとおり。動画の権利は投稿者にある |

書体は Google Fonts（Inter・Noto Sans JP）を読み込みます。

## ライセンス

### 世界の AI 利用率のデータ

「IT・AI 導入」の世界の値は、次の条件で公開されたデータから写しています（同じ文が `data.js` にもあります）。

```text
MIT License

Copyright (c) [2026] [Microsoft]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### アイコン

左のメニューの 3 つは [Lucide](https://lucide.dev/) の `trophy`・`newspaper`・`chart-line` です。形は変えず、大きさと線の太さを合わせて `index.html` に直接書いています。この 3 つは、Lucide の `LICENSE` にある Feather 由来の一覧に含まれません。

```text
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
