# GitHub Trending 抓取插件

自动抓取 GitHub Trending 热门项目，生成 TOP10 精选榜单，支持多语言分类。

**Version**: v2.0.0

## 功能说明

- **自动抓取**：从 GitHub Trending 页面抓取热门项目
- **多语言支持**：支持 JavaScript、TypeScript、Python 等主流语言
- **中文介绍**：生成项目中文介绍和推荐理由
- **数据展示**：展示 Star/Fork 数量、语言标签、今日新增 Stars
- **定时推送**：每天 07:40 推送到 Feishu DM

## 使用方法

```bash
node /root/.openclaw/skills/openclaw-github-trending/main.js
```

## 输出位置

- **报告存储**：`/root/.openclaw/workspace/news/`

## 推送渠道

- **Feishu DM**：ou_63a0ac397bf0e77bd4ef632b0822a779
