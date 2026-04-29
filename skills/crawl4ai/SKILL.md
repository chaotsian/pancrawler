# crawl4ai 技能

version: 1.0.0
**Version**: v1.0.0

Crawl4AI 是一个开源的、LLM 友好的网页爬虫与爬取工具，用于将网页转换为干净的 Markdown 格式，适用于 RAG、智能体和数据管道。

## 📦 安装

```bash
# 安装 crawl4ai
pip install -U crawl4ai

# 运行安装后设置
crawl4ai-setup

# 验证安装
crawl4ai-doctor

# 手动安装浏览器（如需）
python -m playwright install --with-deps chromium
```

## 🚀 基本用法

### Python API

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def fetch_content(url):
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)
        return result.markdown

# 使用示例
content = await fetch_content("https://example.com/news")
```

### CLI 命令

```bash
# 基础爬取，输出 Markdown
crwl crawl https://example.com -o markdown

# 深度爬取，BFS 策略
crwl crawl https://docs.crawl4ai.com --deep-crawl bfs --max-pages 10

# LLM 提取结构化数据
crwl crawl https://www.example.com -q "Extract product prices"
```

## 📋 主要功能

| 功能 | 说明 |
|------|------|
| **LLM 友好输出** | 生成干净的 Markdown，适合 RAG 和智能体 |
| **反检测绕过** | 3 层反爬检测，避免被屏蔽 |
| **深度爬取** | BFS/DFS/Best-first 策略，支持断点续爬 |
| **结构化提取** | LLM 驱动 + CSS/XPath 选择器 |
| **浏览器控制** | 完整的 Playwright 浏览器控制能力 |

## 💡 OpenClaw 集成示例

### 示例 1: 新闻爬取

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def scrape_china_ai_news():
    urls = [
        "https://www.sohu.com/",
        "https://www.163.com/tech",
        "https://www.zhihu.com/topic/20071373/hot"
    ]
    
    async with AsyncWebCrawler() as crawler:
        for url in urls:
            result = await crawler.arun(url=url, wait_for="networkidle")
            print(f"### 来源: {url}")
            print(result.markdown[:2000])  # 获取前 2000 字符
```

### 示例 2: 深度爬取

```python
async def deep_crawl_documentation():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://docs.crawl4ai.com",
            deep_crawl=True,
            max_depth=2,
            bypass_cache=True
        )
        print(f"爬取了 {len(result.links)} 个链接")
```

### 示例 3: LLM 提取

```python
async def extract_product_info(url):
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url=url,
            extraction_question="提取所有产品名称和价格"
        )
        print(result.extracted_content)
```

## 🎯 典型使用场景

| 场景 | 推荐方法 |
|------|----------|
| 新闻网站爬取 | `AsyncWebCrawler().arun()` |
| 文档网站深度爬取 | `--deep-crawl` CLI |
| 结构化数据提取 | `extraction_question` 参数 |
| 反爬网站 | 浏览器配置 + stealth 模式 |

## 🔧 常用参数

| 参数 | 说明 |
|------|------|
| `-o, --output` | 输出格式 (markdown/json/all) |
| `--deep-crawl` | 深度爬取策略 (bfs/dfs/best-first) |
| `--max-pages` | 最大爬取页面数 |
| `-q, --question` | LLM 提取问题 |
| `--bypass-cache` | 跳过缓存 |

## 📚 相关资源

- GitHub: https://github.com/unclecode/crawl4ai
- PyPI: https://pypi.org/project/crawl4ai/
- 文档: https://docs.crawl4ai.com/
- Discord: https://discord.gg/jP8KfhDhyN

---

**技能维护**: OpenClaw 社区  
**更新时间**: 2026-04-24  
**版本**: v0.8.5
