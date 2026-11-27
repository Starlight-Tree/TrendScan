"use strict";

/* 画面で使うデータ。出どころ・モックの範囲・ライセンスは docs/data.md */
// from 年から 2026 年までの並び
const yearsFrom = (from) => Array.from({ length: 2027 - from }, (_, index) => from + index);
const LANGUAGE_YEARS = yearsFrom(2007);
const CLOUD_YEARS = yearsFrom(2017);
const RECENT_YEARS = yearsFrom(2023);

/*
 * 「ランキング」の各タブ（順位の表と推移のグラフ）。点数と推移はモック。
 * - scores は years と同じ順で、末尾が最新の年。表だけに出すものは直近の分でよい。null は提供前の年
 * - color があるもの（上位 8）は推移にも出し、全部の年の値を持つ。色は名前ごとに固定する
 * - years が 1 年だけのタブは、推移と前年比を出さない
 * - periods は推移の期間の選択肢（年数）。ないタブは切り替えを出さない。initialPeriod がなければ全部の年
 * - sub は名前の下の小さい文字。comment は解説（固定の文章）
 */
const RANKINGS = {
  languages: {
    title: "2026 年の言語スコア",
    nameLabel: "言語",
    metric: "スコア",
    years: LANGUAGE_YEARS,
    periods: [5, 10, 20],
    initialPeriod: 10,
    comment: {
      heading: "TypeScript が GitHub で首位を維持",
      text:
        "TypeScript は 2025 年 8 月に、GitHub の月間の貢献者数で Python と JavaScript を抜いて 1 位になり、2026 年も首位です。" +
        "背景には、主要なフロントエンドのフレームワークのほとんどが、最初から TypeScript を使える形になっていることがあります。" +
        "GitHub は、AI エージェントと書くコードの信頼性を高めやすい「型のある言語」へ、開発者が移っているともみています。" +
        "Python は、AI とデータ分析の分野で引き続き主力です。",
      sources: [
        {
          label: "GitHub Octoverse 2025",
          url: "https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/",
        },
        {
          label: "2026",
          name: "GitHub Octoverse 2026",
          url: "https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/",
        },
      ],
    },
    items: [
      { name: "TypeScript", color: 2, scores: [null, null, null, null, null, 3, 5, 8, 11, 17, 23, 31, 39, 49, 55, 63, 71, 79, 89, 94] },
      { name: "Python", color: 1, scores: [44, 45, 47, 49, 51, 53, 55, 58, 61, 64, 68, 71, 75, 77, 79, 83, 87, 90, 88, 91] },
      { name: "JavaScript", color: 3, scores: [72, 74, 76, 79, 81, 83, 85, 87, 91, 92, 93, 92, 91, 91, 90, 88, 86, 82, 76, 74] },
      { name: "Java", color: 4, scores: [90, 90, 89, 89, 88, 87, 86, 85, 83, 81, 79, 76, 74, 72, 70, 68, 66, 64, 62, 61] },
      { name: "C#", color: 7, scores: [56, 57, 59, 60, 61, 60, 59, 57, 56, 55, 54, 53, 52, 51, 50, 50, 51, 51, 52, 52] },
      { name: "C++", color: 8, scores: [68, 66, 64, 62, 60, 58, 56, 54, 52, 50, 49, 48, 47, 47, 46, 46, 47, 47, 48, 48] },
      { name: "Go", color: 5, scores: [null, null, 4, 7, 9, 12, 15, 18, 21, 24, 26, 28, 30, 32, 34, 37, 39, 41, 43, 45] },
      { name: "Rust", color: 6, scores: [null, null, null, null, null, 1, 2, 3, 6, 8, 10, 12, 14, 17, 20, 25, 29, 33, 37, 41] },
      { name: "C", scores: [44, 43, 42, 40, 39, 38] },
      { name: "PHP", scores: [45, 42, 40, 37, 35, 34] },
      { name: "Kotlin", scores: [22, 23, 24, 25, 26, 27] },
      { name: "Lua", scores: [14, 15, 16, 17, 18, 19] },
      { name: "Swift", scores: [18, 18, 18, 17, 17, 17] },
      { name: "Ruby", scores: [24, 22, 20, 18, 16, 15] },
      { name: "Dart", scores: [8, 9, 10, 11, 12, 12] },
    ],
  },

  models: {
    title: "2026 年のモデルスコア",
    nameLabel: "モデル",
    metric: "スコア",
    // 版ごとの名前で過去の値がないので、今の年だけ
    years: [2026],
    comment: {
      heading: "11 月は 3 社が新しいモデルを相次いで発表",
      text:
        "Anthropic は 11 月 9 日に Claude Fable 5.2 を発表しました。" +
        "Google は 10 日に Gemini 4 Carbon の一般提供を始め、18 日には、100 万トークンの文脈に対応する Gemini 4 Neon を発表しました。" +
        "OpenAI は 17 日に、難しい仕事向けの GPT-6.2 Astra と、日常の仕事向けの Sol を公開しました。",
      sources: [
        { label: "Anthropic", name: "Anthropic の Claude Fable 5.2 の発表", url: "https://www.anthropic.com/claude-fable-and-mythos-5-2" },
        {
          label: "Google（Carbon）",
          url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/",
        },
        { label: "OpenAI", name: "OpenAI の GPT-6.2 の発表", url: "https://openai.com/index/introducing-gpt-6-2-astra-sol/" },
        {
          label: "Google（Neon）",
          url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/",
        },
      ],
    },
    items: [
      { name: "Gemini 4 Neon", sub: "Google", scores: [95] },
      { name: "GPT-6.2 Astra", sub: "OpenAI", scores: [93] },
      { name: "Claude Fable 5.2", sub: "Anthropic", scores: [91] },
      { name: "Gemini 4 Hydrogen", sub: "Google", scores: [89] },
      { name: "GPT-6.2 Sol", sub: "OpenAI", scores: [87] },
      { name: "Claude Opus 5.5", sub: "Anthropic", scores: [85] },
      { name: "Gemini 4 Carbon", sub: "Google", scores: [83] },
      { name: "GPT-6.1 Terra", sub: "OpenAI", scores: [81] },
      { name: "Claude Sonnet 5.5", sub: "Anthropic", scores: [79] },
      { name: "Gemini 4 Argon", sub: "Google", scores: [77] },
    ],
  },

  agents: {
    title: "コーディング向けエージェント",
    nameLabel: "エージェント",
    metric: "スコア",
    years: RECENT_YEARS,
    comment: {
      heading: "Claude Code と GitHub Copilot が先行",
      text:
        "Stack Overflow の 2026 年の開発者調査では、過去 1 年に使ったコーディングエージェントは Claude Code が 66%、GitHub Copilot が 59% で、続く OpenAI Codex の 30%、Cursor の 26% を大きく上回りました（回答 12,255 件）。" +
        "AI の使い道でも、コーディングの補助やエージェント（66%）が汎用のチャットボット（63%）を上回り、最も多くなっています。" +
        "同調査は、コーディングエージェントを、AI の記憶やエージェントの連携の道具に比べて成熟し、先頭がはっきりしてきた市場とみています。",
      sources: [
        { label: "Stack Overflow Developer Survey 2026", url: "https://survey.stackoverflow.co/2026/ai/" },
        {
          label: "エージェントの集計（ODbL 1.0）",
          name: "Stack Overflow Developer Survey 2026 のコーディングエージェントの集計（ODbL 1.0）",
          url: "https://survey.stackoverflow.co/2026/ai/data/ai-code-agent",
        },
      ],
    },
    items: [
      { name: "Claude Code", sub: "Anthropic", color: 1, scores: [null, null, 82, 94] },
      { name: "GitHub Copilot", color: 2, scores: [84, 88, 90, 89] },
      { name: "OpenAI Codex", color: 3, scores: [null, null, 62, 78] },
      { name: "Cursor", sub: "エディター", color: 4, scores: [38, 64, 78, 74] },
      { name: "Google Antigravity", color: 5, scores: [null, null, 30, 63] },
      { name: "Gemini Code Assist", sub: "Google", color: 6, scores: [30, 46, 55, 52] },
      { name: "OpenCode", sub: "オープンソース", color: 7, scores: [null, null, 28, 50] },
      { name: "JetBrains AI", color: 8, scores: [34, 42, 47, 46] },
      { name: "Windsurf", sub: "エディター", scores: [null, 40, 50, 36] },
      { name: "Warp", sub: "ターミナル", scores: [18, 22, 30, 32] },
    ],
  },

  services: {
    title: "2026 年の AI チャット注目度",
    nameLabel: "サービス",
    metric: "注目度",
    years: RECENT_YEARS,
    comment: {
      heading: "Gemini アプリの月間利用者数が 10 億人に",
      text:
        "Google の親会社の Alphabet は、2026 年 7〜9 月期の決算発表で、Gemini アプリの月間利用者数が 10 億人に達し、Google の歴史で最も速く伸びた製品だとしています。" +
        "Google は 11 月に、新しいモデルの Gemini 4 Carbon と Gemini 4 Neon の提供を、Gemini アプリでも始めました。",
      sources: [
        { label: "Alphabet の決算発表", name: "Alphabet の 2026 年 7〜9 月期の決算発表（SEC）", url: "https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm" },
        {
          label: "Google（決算説明）",
          name: "2026 年 7〜9 月期の決算説明での Alphabet の CEO の発言（Google の公式ブログ）",
          url: "https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q3-2026/",
        },
        {
          label: "Google（Carbon）",
          url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/",
        },
        {
          label: "Google（Neon）",
          url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/",
        },
      ],
    },
    items: [
      { name: "ChatGPT", sub: "OpenAI", color: 1, scores: [88, 94, 96, 95] },
      { name: "Gemini", sub: "Google", color: 2, scores: [52, 66, 80, 88] },
      { name: "Claude", sub: "Anthropic", color: 3, scores: [40, 54, 68, 84] },
      { name: "DeepSeek", color: 4, scores: [null, null, 70, 68] },
      { name: "Grok", sub: "SpaceXAI", color: 5, scores: [20, 36, 58, 61] },
      { name: "Microsoft Copilot", color: 6, scores: [50, 56, 58, 56] },
      { name: "Perplexity", color: 7, scores: [30, 46, 55, 53] },
      { name: "Meta AI", color: 8, scores: [24, 40, 48, 47] },
      { name: "Qwen", sub: "Alibaba", scores: [16, 24, 40, 43] },
      { name: "Kimi", sub: "Moonshot AI", scores: [14, 22, 32, 36] },
    ],
  },

  companies: {
    title: "2026 年の企業注目度",
    nameLabel: "企業",
    metric: "注目度",
    years: RECENT_YEARS,
    comment: {
      heading: "AI の半導体とモデル開発に、大きなお金が動く",
      text:
        "NVIDIA の 2026 年 8〜10 月期（10 月 25 日まで）の売上高は 1,158 億ドルで、前の年の同じ時期の約 2 倍（103% 増）でした。" +
        "そのうち 1,076 億ドルがデータセンター向けです。" +
        "モデルを開発する Anthropic は 5 月に、650 億ドルを調達し、調達後の評価額が 9,650 億ドルになったと発表しました。" +
        "同社は背景として、世界の企業が中心の業務に Claude を取り入れ、これまでにない需要があると説明し、資金は計算資源の拡大などに使うとしています。",
      sources: [
        {
          label: "NVIDIA",
          name: "NVIDIA の 2027 年度第 3 四半期の決算発表（SEC）",
          url: "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000088/q3fy27pr.htm",
        },
        { label: "Anthropic", name: "Anthropic の資金調達の発表", url: "https://www.anthropic.com/news/series-h" },
      ],
    },
    items: [
      { name: "OpenAI", sub: "モデル開発", color: 1, scores: [86, 90, 94, 95] },
      { name: "Anthropic", sub: "モデル開発", color: 2, scores: [58, 70, 84, 93] },
      { name: "Google", sub: "モデル・クラウド", color: 3, scores: [80, 82, 87, 90] },
      { name: "NVIDIA", sub: "半導体", color: 4, scores: [76, 86, 88, 86] },
      { name: "Meta", sub: "SNS・AI", color: 5, scores: [70, 76, 74, 72] },
      { name: "Microsoft", sub: "ソフト・クラウド", color: 6, scores: [82, 80, 76, 70] },
      { name: "Amazon", sub: "クラウド・EC", color: 7, scores: [52, 58, 62, 66] },
      { name: "DeepSeek", sub: "モデル開発", color: 8, scores: [18, 30, 70, 62] },
      { name: "Alibaba", sub: "クラウド・EC", scores: [30, 38, 50, 55] },
      { name: "Mistral AI", sub: "モデル開発", scores: [34, 42, 44, 45] },
    ],
  },

  clouds: {
    title: "2026 年のクラウド注目度",
    nameLabel: "クラウド",
    metric: "注目度",
    years: CLOUD_YEARS,
    periods: [5, 10],
    comment: {
      heading: "大手 3 社のクラウドは、そろって大きく伸びた",
      text:
        "2026 年 7〜9 月期の決算発表で、Amazon の AWS の売上は 460 億ドルで前の年の同じ時期より 39% 増え、同社は約 5 年で最も速い伸びだとしています。" +
        "Google Cloud は 307 億ドルで 103% 増でした。Google は、企業向けの AI の基盤やサービスなどがけん引し、TPU のシステムの販売も寄与したとしています。" +
        "Microsoft は Azure の売上が 48% 増でした。Google Cloud には Workspace なども含まれ、3 社の数字は範囲が違います。",
      sources: [
        { label: "Amazon", name: "Amazon の 2026 年 7〜9 月期の決算発表（SEC）", url: "https://www.sec.gov/Archives/edgar/data/1018724/000101872426000038/amzn-20260930xex991.htm" },
        { label: "Alphabet", name: "Alphabet の 2026 年 7〜9 月期の決算発表（SEC）", url: "https://www.sec.gov/Archives/edgar/data/1652044/000165204426000080/googexhibit991q32026.htm" },
        { label: "Microsoft", name: "Microsoft の 2026 年 7〜9 月期の決算発表（SEC）", url: "https://www.sec.gov/Archives/edgar/data/789019/000119312526436122/msft-ex99_1.htm" },
      ],
    },
    items: [
      { name: "AWS", sub: "Amazon", color: 1, scores: [96, 96, 96, 95, 95, 95, 94, 93, 92, 92] },
      { name: "Microsoft Azure", color: 2, scores: [62, 66, 70, 74, 77, 80, 82, 84, 86, 86] },
      { name: "Google Cloud", color: 3, scores: [50, 54, 58, 62, 66, 69, 72, 76, 80, 82] },
      { name: "Alibaba Cloud", color: 4, scores: [46, 50, 54, 58, 61, 62, 60, 58, 59, 60] },
      { name: "Oracle Cloud", color: 5, scores: [20, 22, 25, 28, 32, 36, 40, 46, 52, 57] },
      { name: "CoreWeave", color: 6, scores: [null, null, 4, 6, 8, 11, 14, 30, 44, 52] },
      { name: "Huawei Cloud", color: 7, scores: [18, 24, 30, 37, 40, 42, 44, 44, 44, 43] },
      { name: "Tencent Cloud", color: 8, scores: [30, 33, 36, 39, 41, 43, 42, 40, 39, 38] },
      { name: "IBM Cloud", scores: [38, 35, 33, 31] },
      { name: "Cloudflare", scores: [22, 25, 28, 30] },
    ],
  },
};

// ニュース。items を変えたら comment も直す。image は自作のモック
const NEWS_LIST = {
  title: "IT・AI のニュース",
  comment: {
    heading: "11 月は AI モデルの発表が続く",
    text: "下の一覧では、11 月 9 日から 18 日にかけて、Anthropic・Google・OpenAI が AI モデルの発表や一般提供を相次いで行っています。10 月は、Python 3.15 の正式版、TypeScript 7.1 のベータ版、Node.js 26 の長期サポートへの移行など、開発の土台の更新が目立ちます。",
  },
  items: [
    {
      title: "Google が Gemini 4 Neon を発表",
      description: "100 万トークンの文脈に対応。Gemini API や Gemini アプリなどへの提供を始めた。",
      date: "2026-11-18",
      link: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/",
      image: "images/news/mock-01.svg",
    },
    {
      title: "OpenAI が GPT-6.2 Astra と Sol を公開",
      description: "Astra は難しい仕事向け、Sol は日常の仕事向け。API でも使える。",
      date: "2026-11-17",
      link: "https://openai.com/index/introducing-gpt-6-2-astra-sol/",
      image: "images/news/mock-02.svg",
    },
    {
      title: "Google が Gemini 4 Carbon の一般提供を開始",
      description: "開発者・企業・一般の利用者が、API や Gemini アプリで使えるようになった。",
      date: "2026-11-10",
      link: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/",
      image: "images/news/mock-03.svg",
    },
    {
      title: "Anthropic が Claude Fable 5.2 と Mythos 5.2 を発表",
      description: "Fable 5.2 は広く提供し、Mythos 5.2 は審査を受けた利用者向けのプログラムに限る。",
      date: "2026-11-09",
      link: "https://www.anthropic.com/claude-fable-and-mythos-5-2",
      image: "images/news/mock-04.svg",
    },
    {
      title: "Node.js 26 が長期サポート（LTS）に移行",
      description: "コード名は Lithium。サポートは 2029 年 4 月まで。",
      date: "2026-10-28",
      link: "https://nodejs.org/en/blog/release/v26.13.0",
      image: "images/news/mock-05.svg",
    },
    {
      title: "GitHub が Octoverse 2026 を公開",
      description: "月間の貢献者数は TypeScript が 1 位で、Python と JavaScript が続く。",
      date: "2026-10-28",
      link: "https://github.blog/news-insights/octoverse/octoverse-commits-pushes-reach-new-highs-in-2026-as-developers-build-with-agents/",
      image: "images/news/mock-06.svg",
    },
    {
      title: "TypeScript 7.1 のベータ版が公開",
      description: "新しい API や、出力先の指定 es2026 などを追加した。",
      date: "2026-10-20",
      link: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/",
      image: "images/news/mock-07.svg",
    },
    {
      title: "Python 3.15.0 の正式版が公開",
      description: "必要になるまで読み込まない lazy import などを追加した。",
      date: "2026-10-09",
      link: "https://blog.python.org/2026/10/python-3150-final-is-here/",
      image: "images/news/mock-08.svg",
    },
  ],
};

// キーワード（日本語版 Wikipedia の閲覧数を取得する）。article は記事名、about は言葉の説明
const LIVE_KEYWORDS = [
  {
    title: "生成AI",
    article: "生成的人工知能",
    about: {
      text: "生成 AI は、文章・画像・動画・音楽などの新しいコンテンツを作る AI です。",
      source: { label: "AWS の解説（言葉の説明）", url: "https://aws.amazon.com/what-is/generative-ai/" },
    },
  },
  {
    title: "大規模言語モデル（LLM）",
    article: "大規模言語モデル",
    about: {
      text: "大規模言語モデル（LLM）は、大量のデータで事前に学習した非常に大きな深層学習のモデルで、さまざまな作業に合わせて使えます。",
      source: { label: "AWS の解説（言葉の説明）", url: "https://aws.amazon.com/what-is/large-language-model/" },
    },
  },
  {
    title: "ChatGPT",
    article: "ChatGPT",
    about: {
      text: "ChatGPT は、OpenAI の、会話の形で使う AI です。",
      source: { label: "OpenAI のヘルプ（言葉の説明）", url: "https://help.openai.com/en/articles/6783457-what-is-chatgpt" },
    },
  },
  {
    title: "AIエージェント",
    article: "知的エージェント",
    about: {
      text: "AI エージェントは、人が決めた目標に向けて、情報を集め、行動を自分で選んで作業を進めるソフトウェアです。",
      source: { label: "AWS の解説（言葉の説明）", url: "https://aws.amazon.com/what-is/ai-agents/" },
    },
  },
  {
    title: "バイブコーディング",
    article: "バイブコーディング",
    about: {
      text: "バイブコーディングは、コードを手で書く代わりに、AI に指示して生成させる開発のやり方です。",
      source: { label: "IBM の解説（言葉の説明）", url: "https://www.ibm.com/think/topics/vibe-coding" },
    },
  },
  {
    title: "MCP",
    article: "Model Context Protocol",
    about: {
      text: "MCP は、AI のアプリを外部のデータやツールにつなぐ、オープンな標準規格です。",
      source: { label: "MCP の公式ドキュメント（言葉の説明）", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
    },
  },
  {
    title: "Claude",
    article: "Claude",
    about: {
      text: "Claude は、Anthropic の AI アシスタントです。",
      source: { label: "Claude の公式ページ（言葉の説明）", url: "https://claude.com/product/overview" },
    },
  },
  {
    title: "Gemini",
    article: "Gemini (チャットボット)",
    about: {
      text: "Gemini は、Google の AI アシスタントです。",
      source: { label: "Gemini の公式ページ（言葉の説明）", url: "https://gemini.google/about/" },
    },
  },
];

// 技術記事（Qiita API で取得して固定）。items を変えたら comment も直す
const QIITA_LIST = {
  title: "2026 年 11 月下旬に Qiita で注目された記事",
  scoreLabel: "いいね",
  comment: {
    heading: "「なんとなく」を理解し直す記事が注目",
    text: "脆弱性の点数（CVSS）の読み方、設計の SOLID の原則、SSH の仕組みのように、うろ覚えのことを基本から理解し直す記事が目立ちます。AI の記事では、AI が書いた文章らしさの直し方と、AI がコードを書く時代のエンジニアの価値を考える記事が上位です。セキュリティでは、事故の公表が増えた理由を調べた記事と、情報漏えいを公表しないリスクを整理した記事も入っています。いいねが最も多いのは、QR コードの情報量を 4 倍にしようとして失敗した、ネタ記事です。",
    sources: [{ label: "Qiita API", url: "https://qiita.com/api/v2/docs" }],
  },
  // いいねの多い順
  items: [
    {
      title: "情報量が4倍のQRコードを作ろう",
      sub: "ネタ",
      value: 201,
      link: "https://qiita.com/reipandada/items/17496db6ac5f64a5e61a",
    },
    {
      title: "手書きをやめた途端、ブログが全部AI臭くなったあなたへ！ マシにする方法教えます",
      sub: "AI",
      value: 113,
      link: "https://qiita.com/minorun365/items/faa50b7662b86e1df29c",
    },
    {
      title: "日本語サイトで指定しておきたいCSS 2026年版",
      sub: "CSS",
      value: 72,
      link: "https://qiita.com/tofu_frontend/items/6a1bb7d80a58736eef0e",
    },
    {
      title: "脆弱性の「CVSS 9.8」って結局なに？CVSSの読み方をちゃんと理解する",
      sub: "Security",
      value: 72,
      link: "https://qiita.com/heki-dm/items/77ecaacd592d1c4459df",
    },
    {
      title: "コードを書くコストが下がった今、ソフトウェアエンジニアリングの価値はどこにあるのか",
      sub: "生成AI",
      value: 68,
      link: "https://qiita.com/figueiredoluiz/items/1d6751643b84db67812e",
    },
    {
      title: "【完全解説】本質から学ぶSOLIDの原則｜なんとなく分かるから完全理解へ【設計シリーズ】",
      sub: "SOLID原則",
      value: 44,
      link: "https://qiita.com/Sicut_study/items/2bbdfbacab915773dad1",
    },
    {
      title: "コピペでSSHしていた初心者が、仕組みから学び直してみる",
      sub: "初心者",
      value: 41,
      link: "https://qiita.com/Yuzuki-ki/items/b23e578d820d411bcb92",
    },
    {
      title: "なぜ 11 月に日本のサイバー事故は「爆発」したのか — 605件を数えたら「日本が狙われている」だけではなかった",
      sub: "初心者",
      value: 29,
      link: "https://qiita.com/songchong/items/073f202bb0ca65611b30",
    },
    {
      title: "情報漏えいを公表しないリスクの要点整理",
      sub: "Security",
      value: 22,
      link: "https://qiita.com/Maruo110/items/385b2c7ef5fbd074e6e2",
    },
    {
      title: "心理的安全性を現場で育てる ― 「なんで？」をやめただけで2チーム統合リーダーの現場が変わった話",
      sub: "心理的安全性",
      value: 21,
      link: "https://qiita.com/teppei19980914/items/205353ed847956c45dd2",
    },
  ],
};

// 動画。items を変えたら comment も直す。
// link は YouTube の動画ページ、image は自作のモック、date は日本時間の公開日
const VIDEO_LIST = {
  title: "公式チャンネルの動画（2026 年 11 月下旬）",
  comment: {
    heading: "開発や脆弱性の対策に AI を使う話が中心",
    text: "11 月 24〜26 日に公開された 6 本では、脆弱性の対策、開発の作業を AI に任せる方法、AI を使ったものづくりの実演が、2 本ずつあります。AI に任せきりにせず、確かめる仕組みを用意する話も目立ちます。テストや画面の画像で AI に自分の作業を確かめさせるコツ、AI の助けで作った脆弱性の修正案を人が確かめる事例、AI エージェントを組織で安全に使うための管理などです。",
  },
  items: [
    {
      link: "https://www.youtube.com/watch?v=wfc5iETZFnQ",
      image: "images/videos/mock-01.svg",
      title: "AI はセキュリティの危機か、守る側の味方か",
      description: "コードや脆弱性が増えるなか、AI を使った防ぎ方や直し方を話し合う。",
      date: "2026-11-26",
      channel: "GitHub",
    },
    {
      link: "https://www.youtube.com/watch?v=WN5O4vWCa54",
      image: "images/videos/mock-02.svg",
      title: "Gemini 4 に開発の長い作業を任せる 5 つのコツ",
      description: "事前に方針をすり合わせる、結果を確かめる手段を渡す、などを紹介する。",
      date: "2026-11-26",
      channel: "Google for Developers",
    },
    {
      link: "https://www.youtube.com/watch?v=1u0hTd86_HU",
      image: "images/videos/mock-03.svg",
      title: "Codex のプラグインで SVG と 3D を作る",
      description: "参考の画像を編集できる図や 3D モデルにして、言葉で直していく。",
      date: "2026-11-25",
      channel: "OpenAI",
    },
    {
      link: "https://www.youtube.com/watch?v=fpQcDQJQLhg",
      image: "images/videos/mock-04.svg",
      title: "通信なしで使える野外図鑑を Raspberry Pi で作る",
      description: "Antigravity と Gemma 4 を使い、動植物を調べる小型の端末を作る。",
      date: "2026-11-24",
      channel: "Google for Developers",
    },
    {
      link: "https://www.youtube.com/watch?v=MpsO8Ds8uyo",
      image: "images/videos/mock-05.svg",
      title: "GPT-6 Cyber で Linux の脆弱性を調べる",
      description: "1 回の実行で、Linux カーネルの脆弱性 948 件の確認と修正案づくりを助けた事例。修正案は人が確かめる。",
      date: "2026-11-24",
      channel: "OpenAI",
    },
    {
      link: "https://www.youtube.com/watch?v=TYhsC-S-Fx0",
      image: "images/videos/mock-06.svg",
      title: "AI エージェントを本番の開発に組み込む",
      description: "GitHub Actions と Copilot を使う仕組みと管理を、GitHub Next と利用企業の担当者が紹介する。",
      date: "2026-11-24",
      channel: "GitHub",
    },
  ],
};

// 「データ」のタブのカードの下に出す注意書き
const AI_NOTICE = "AI がまとめた内容には、誤りが含まれる場合があります。";

// 「生成 AI」。総務省の情報通信白書の調査結果

// 回答ごとの割合を足して、多い順に並べる
const toUsageItems = (rows) =>
  rows
    .map(([name, ...answers]) => ({ name, value: Math.round(answers.reduce((total, answer) => total + answer, 0) * 10) / 10 }))
    .sort((a, b) => b.value - a.value);

const AI_USAGE = {
  comment: {
    heading: "仕事の生成 AI は議事録・メール、個人の AI は情報の理解が最多",
    notice: AI_NOTICE,
    text: "2025 年度の企業の調査で、生成 AI を使っている割合が最も高い業務は、議事録・メールの作成補助（71.2%）でした。次は営業・販売、社内ヘルプデスクです。議事録・メールは、効果を感じる割合も目立って高くなっています。個人の調査（生成 AI に限らない AI 全般）では、情報の理解に使ったことがある人が 53.4% で最も多く、次は文書作成や校正でした。",
    sources: [
      {
        label: "総務省「令和 8 年版 情報通信白書」企業の業務",
        url: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/html/nd121130.html",
      },
      {
        label: "個人の目的",
        name: "総務省「令和 8 年版 情報通信白書」個人の利用目的",
        url: "https://www.soumu.go.jp/johotsusintokei/whitepaper/ja/r08/html/nd111330.html",
      },
    ],
  },
  // カードの右上のアイコンで切り替える内容。最初に出すのは先頭
  views: {
    business: {
      title: "生成 AI を使っている業務",
      nameLabel: "業務",
      tableNote:
        "デジタル化を始めた企業の管理職へのインターネット調査です（2026 年 1〜2 月）。割合は、使っているという回答の合計です。",
      // [業務, AI 中心の業務プロセスに変更, 部署内の特定業務で活用, 個人作業の効率化で活用]
      items: toUsageItems([
        ["議事録・メール作成補助", 11.3, 24.7, 35.2],
        ["社内ヘルプデスク", 11.9, 20.7, 18.3],
        ["研究・商品開発", 7.6, 22.9, 19.3],
        ["調達", 7.0, 16.7, 14.3],
        ["製造・生産", 6.0, 19.7, 16.7],
        ["マーケティング・広報", 7.4, 23.9, 18.1],
        ["営業・販売", 9.5, 22.9, 27.2],
        ["カスタマーサポート", 9.9, 22.1, 12.7],
        ["経営", 8.0, 21.3, 16.7],
        ["人事", 5.6, 20.3, 15.1],
        ["経理・財務", 9.3, 19.5, 15.9],
        ["法務", 6.2, 22.7, 13.7],
        ["社内システム開発・運用", 8.0, 24.5, 17.9],
      ]),
    },
    purposes: {
      title: "AI を使う目的",
      nameLabel: "目的",
      tableNote:
        "15〜69 歳へのインターネット調査です（2026 年 1〜2 月）。生成 AI に限らない AI が対象で、割合は使ったことがあるという回答の合計です。",
      // [目的, 定期的に利用, 過去に何度か利用]
      items: toUsageItems([
        ["情報の理解", 33.7, 19.7],
        ["文書作成や校正", 20.1, 18.0],
        ["翻訳", 13.7, 17.7],
        ["アイデアの発想や企画の構想", 14.4, 15.3],
        ["コンテンツの制作、創作", 11.5, 13.3],
        ["プログラミングやデータ処理", 4.9, 9.1],
        ["学習や教育支援", 9.7, 10.1],
        ["日常生活や業務の管理", 8.5, 10.5],
        ["専門家にするような心身、生活、将来に係る相談", 12.3, 12.5],
        ["日常の行動・判断にかかわる相談", 14.6, 13.0],
        ["日常的な会話のため", 11.0, 11.1],
      ]),
    },
  },
};

// 「IT・AI 導入」。国内は総務省の通信利用動向調査（IoT と AI をまとめた値）、世界は Microsoft の AI Diffusion Report。
// 国内の total は表の先頭にだけ出す。線の色は業種ごとに固定し、最新の値が大きい順に並べる
const toRateSeries = (rows) =>
  rows.map(([name, color, ...values]) => ({ name, color, values })).sort((a, b) => b.values.at(-1) - a.values.at(-1));

/* 世界の値（ADOPTION_RATES の world）の利用条件。値を写すときは、この文も入れる。
MIT License

Copyright (c) [2026] [Microsoft]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const toCountryItems = (rows) => rows.map(([rank, name, previous, value]) => ({ rank, name, previous, value }));

const ADOPTION_RATES = {
  comment: {
    heading: "国内の IoT・AI の導入は、金融・保険業で半数を超えた",
    notice: AI_NOTICE,
    text: "国内の 2025 年の調査では、IoT や AI などのシステムを導入している企業は 27.3% で、2021 年の 14.9% から増えました。最も高い業種は金融・保険業です。世界では、2026 年 4〜6 月期の推計で、15〜64 歳の人の 18.8% が生成 AI を使い、国別ではアラブ首長国連邦が最も高くなっています。",
    sources: [
      {
        label: "総務省「通信利用動向調査（企業編）」令和 7 年",
        url: "https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202500_002.pdf",
      },
      {
        label: "令和 6 年",
        name: "総務省「通信利用動向調査（企業編）」令和 6 年",
        url: "https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202400_002.pdf",
      },
      {
        label: "令和 5 年",
        name: "総務省「通信利用動向調査（企業編）」令和 5 年",
        url: "https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202300_002.pdf",
      },
      {
        label: "令和 4 年",
        name: "総務省「通信利用動向調査（企業編）」令和 4 年",
        url: "https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202200_002.pdf",
      },
      {
        label: "令和 3 年",
        name: "総務省「通信利用動向調査（企業編）」令和 3 年",
        url: "https://www.soumu.go.jp/johotsusintokei/statistics/pdf/HR202100_002.pdf",
      },
      { label: "Microsoft「AI Diffusion Report」のデータ", url: "https://github.com/microsoft/ai-diffusion-report" },
      {
        label: "同社の発表（2026 年 9 月 21 日）",
        name: "Microsoft の発表（2026 年 9 月 21 日）",
        url: "https://blogs.microsoft.com/on-the-issues/2026/09/21/the-continued-state-of-global-ai-diffusion-in-2026/",
      },
    ],
  },
  views: {
    domestic: {
      // 表を出さず、グラフだけにする
      chartOnly: true,
      nameLabel: "業種",
      yearUnit: "年",
      fromZero: true,
      years: [2021, 2022, 2023, 2024, 2025],
      title: "IoT・AI の導入率（国内）",
      note: "常用雇用者 100 人以上の企業への調査です（各年 8 月末）。AI だけの割合ではありません。医療・福祉、教育、宿泊・飲食などは「サービス業、その他」、製薬は「製造業」に含まれます。",
      metric: "導入している企業の割合",
      total: { name: "全体", values: [14.9, 13.5, 16.9, 18.4, 27.3] },
      // [業種, 色, 2021 年から 2025 年まで]
      series: toRateSeries([
        ["情報通信業", 1, 17.7, 21.6, 25.8, 30.6, 39.6],
        ["金融・保険業", 2, 38.1, 30.8, 34.7, 44.2, 52.3],
        ["不動産業", 3, 17.8, 20.2, 18.4, 17.5, 44.2],
        ["製造業", 4, 19.4, 19.0, 21.7, 26.1, 30.6],
        ["卸売・小売業", 5, 12.9, 11.4, 15.0, 16.9, 27.6],
        ["建設業", 6, 12.8, 14.0, 15.4, 18.5, 25.5],
        ["サービス業、その他", 7, 12.2, 8.4, 13.5, 11.2, 23.2],
        ["運輸業・郵便業", 8, 11.1, 11.7, 11.8, 13.2, 18.0],
      ]),
    },
    world: {
      title: "生成 AI を使う人の割合（世界の国別）",
      tableNote: "Microsoft が自社の利用データなどから推計した、15〜64 歳の利用率です。中国などは不完全な可能性があります。上位 20 と日本・米国・中国・韓国を表示しています。",
      nameLabel: "国・地域",
      // 列名は、この区切りの位置だけで折り返す（"\u00a0" は、区切りに残す空白）
      yearLabels: [["2025 年", "前半"], ["2026 年\u00a0", "4〜6 月"]],
      // [世界順位, 国・地域, 2025 年前半, 2026 年 4〜6 月]
      items: toCountryItems([
        [1, "アラブ首長国連邦", 59.4, 73.3],
        [2, "シンガポール", 58.6, 64.3],
        [3, "アイルランド", 41.7, 49.9],
        [4, "フランス", 40.9, 49.6],
        [5, "ノルウェー", 45.3, 49.4],
        [6, "スペイン", 39.7, 45.1],
        [7, "ニュージーランド", 37.6, 44.1],
        [8, "英国", 36.4, 43.7],
        [9, "オランダ", 36.3, 43.5],
        [9, "カタール", 35.7, 43.5],
        [11, "オーストラリア", 34.5, 40.7],
        [12, "韓国", 25.9, 40.6],
        [13, "ベルギー", 33.5, 40.3],
        [14, "スイス", 32.4, 39.1],
        [15, "イスラエル", 33.9, 38.7],
        [16, "カナダ", 33.5, 38.5],
        [17, "スウェーデン", 31.2, 37.3],
        [18, "オーストリア", 29.1, 35.4],
        [19, "台湾", 26.4, 33.8],
        [20, "ハンガリー", 27.9, 33.3],
        [21, "米国", 26.3, 33.0],
        [45, "日本", 16.7, 24.7],
        [67, "中国", 15.4, 17.5],
      ]),
    },
  },
};

// 「企業の業績」。各社が公表した連結の売上高（国内は百万円、世界は百万ドル）。
// 年度は決算期末が 4 月〜翌年 3 月の年で、伸び率は 2021 年度が 0%。
// [会社, 色, 2021 年度から 2025 年度まで]。直近の伸び率が大きい順に並べる
const toRevenueSeries = (rows) =>
  rows
    .map(([name, color, ...amounts]) => ({
      name,
      color,
      amounts,
      values: amounts.map((amount) => Math.round((amount / amounts[0] - 1) * 1000) / 10),
    }))
    .sort((a, b) => b.values.at(-1) - a.values.at(-1));

// 国内と世界で共通の形。amountUnit は金額の単位、growthNote は伸び率のときだけ注記に足す
const REVENUE_VIEW = {
  chartOnly: true,
  nameLabel: "会社",
  yearUnit: "年度",
  years: [2021, 2022, 2023, 2024, 2025],
  metric: "2021 年度からの売上高の伸び率",
};
const REVENUE_NOTE = "伸び率は 2021 年度が 0% です。一覧は、最初は 2025 年度の値です。";

const IT_REVENUE = {
  comment: {
    heading: "NVIDIA の売上高は 4 年で約 8 倍、国内の 5 社では楽天グループが最も伸びた",
    notice: AI_NOTICE,
    text: "2021〜2025 年度に、NVIDIA の売上高は約 8 倍になりました。直近の年度は、その約 9 割がデータセンター向けで、同社はこの部門の伸びの背景に AI などを挙げています。Microsoft と Amazon も、AI 向けの投資の拡大を説明しています。国内では楽天グループ（48% 増）と野村総合研究所（33% 増）の伸びが大きく、直近の年度はどちらも金融関連の事業などが好調でした。",
    sources: [
      { label: "NEC", name: "NEC の有価証券報告書", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBFV.pdf" },
      { label: "野村総合研究所", name: "野村総合研究所の有価証券報告書", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBM8.pdf" },
      { label: "LINEヤフー", name: "LINEヤフーの有価証券報告書", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100YBXD.pdf" },
      { label: "楽天グループ", name: "楽天グループの有価証券報告書", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XTNW.pdf" },
      { label: "サイバーエージェント", name: "サイバーエージェントの有価証券報告書", url: "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100XCU9.pdf" },
      { label: "Apple", name: "Apple の年次報告書の損益計算書", url: "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/R3.htm" },
      { label: "Microsoft", name: "Microsoft の年次報告書", url: "https://www.sec.gov/Archives/edgar/data/789019/000119312525245177/d61995dars.pdf" },
      { label: "NVIDIA", name: "NVIDIA の年次報告書", url: "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm" },
      { label: "Alphabet", name: "Alphabet の年次報告書の損益計算書", url: "https://www.sec.gov/Archives/edgar/data/1652044/000165204426000018/R5.htm" },
      { label: "Amazon", name: "Amazon の年次報告書の損益計算書", url: "https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/R4.htm" },
      { label: "Meta", name: "Meta の年次報告書の損益計算書", url: "https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/R5.htm" },
      { label: "Amazon の決算発表", name: "Amazon の 2025 年 10〜12 月期の決算発表（SEC）", url: "https://www.sec.gov/Archives/edgar/data/1018724/000101872426000002/amzn-20251231xex991.htm" },
    ],
  },
  // グラフに出す値の切り替え
  chartValues: [
    { id: "growth", label: "伸び率" },
    { id: "amount", label: "金額" },
  ],
  views: {
    domestic: {
      ...REVENUE_VIEW,
      title: "国内の IT 企業の売上高",
      note: `${REVENUE_NOTE}楽天グループとサイバーエージェントの 2021 年度は、会計基準の変更前の値です。`,
      fromZero: true,
      amountUnit: "億円",
      series: toRevenueSeries([
        ["NEC", 1, 3014095, 3313018, 3477262, 3423431, 3582733],
        ["野村総合研究所", 2, 611634, 692165, 736556, 764813, 814708],
        ["LINEヤフー", 3, 1567421, 1672377, 1814663, 1917478, 2036366],
        ["楽天グループ", 4, 1681757, 1920894, 2071315, 2279233, 2496575],
        ["サイバーエージェント", 5, 666149, 709923, 719451, 801236, 874030],
      ]),
    },
    world: {
      ...REVENUE_VIEW,
      title: "世界の IT 企業の売上高",
      note: REVENUE_NOTE,
      growthNote: "NVIDIA との差が大きいため、伸び率の縦軸は上ほど目盛りの間隔を詰めています。",
      // 1 社だけ伸びが大きいので、縦軸を倍率の対数にする
      ratioAxis: true,
      amountUnit: "億ドル",
      series: toRevenueSeries([
        ["Apple", 1, 365817, 394328, 383285, 391035, 416161],
        ["Microsoft", 2, 168088, 198270, 211915, 245122, 281724],
        ["NVIDIA", 3, 26914, 26974, 60922, 130497, 215938],
        ["Google（Alphabet）", 4, 257637, 282836, 307394, 350018, 402836],
        ["Amazon", 5, 469822, 513983, 574785, 637959, 716924],
        ["Meta", 6, 117929, 116609, 134902, 164501, 200966],
      ]),
    },
  },
};
