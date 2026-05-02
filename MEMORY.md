# MEMORY.md - 长期记忆库

## 说明
此文件存储需要跨会话保留的重要信息。
Agent 每次会话会读取此文件，也可根据需要向其中追加新的记忆条目。

## 记忆条目格式
每条记忆包含：时间戳、类别、内容、标签

---

## 用户偏好记忆

### 2026-04-12 | 代码风格
- 用户偏好 2 空格缩进
- 函数命名使用驼峰式
- 注释风格：关键逻辑必须注释，但避免过度注释
- 标签：#code-style #preference

### 2026-04-12 | 沟通偏好
- 用户喜欢直接高效的沟通方式
- 不需要过多寒暄
- 有多个方案时希望看到对比和推荐
- 标签：#communication #preference

### 2026-04-17 | 系统优化偏好
- 心跳轮询间隔改为 24 小时
- 工作区根目录只保留 8 个核心文件，多余文件归档到 archive/
- 历史备份文件（*backup*）已清理
- 官方文档驱动优化：每 7 天 05:00 自动执行
- 标签：#preference #system

---

## 项目知识记忆

### pan_crawler | 架构信息
技术栈：Python 3, asyncio, SQLite, Crawl4AI, SearxNG, Feishu Webhook, SMTP
关键模块：
  - pan_cli.py: 主命令行接口 (27KB)
  - src/quark_crawler.py: 夸克网盘爬虫核心
  - src/multi_network.py: 多网盘统一接口 (夸克/百度/阿里)
  - src/cache.py: 智能缓存 (LRU/LFU, TTL, 4 级)
  - src/scheduler.py: 定时调度器
  - src/notification.py: 飞书 Webhook + SMTP 通知
  - src/incremental_sync.py: 增量同步 (MD5 哈希)
  - src/error_handler.py: 错误重试 (指数退避, 3 次)
  - webapp/: Web 管理界面 (Flask)
部署：
  - 路径：/root/.openclaw/workspace/pan/
  - 数据库：SQLite (data/crawler.db)
  - 配置：config/quark-crawler.json
标签：#project #architecture #crawler #python #quark

### research-assistant | 架构信息
技术栈：SearxNG (本地) + Crawl4AI (v0.8.6) + Python asyncio
SearxNG 运行在 http://soudb.cn:4000
标签：#project #architecture #research #search

### claw-code | 架构信息
技术栈：TypeScript, Node.js
关键模块：runtime.ts, session_store.ts, query_engine.ts
路径：/root/.openclaw/workspace/skills/claw-code/scripts/
标签：#project #architecture #agent-harness #typescript

### EvoMap Evolver | 架构信息
类型：AI 自主进化系统 (LLM-driven)
运行方式：balanced mode
路径：/root/.openclaw/workspace/evolver/
守护进程 PID: 708921
每日 01:00 Deep Check + 00:10 Auto-Update Check
标签：#project #architecture #evolver #ai

---

## 经验教训

### 2026-04-04 | Cron 推送修复
- 问题：定时任务脚本 stdout 输出未被 Gateway 捕获
- 解决：改用 OpenClaw system_event 格式输出
- 标签：#lesson-learned #cron

### 2026-04-17 | HEARTBEAT_OK 刷屏
- 问题：心跳间隔 30 分钟导致 Control UI 频繁显示 HEARTBEAT_OK
- 解决：间隔改为 24 小时
- 标签：#lesson-learned #heartbeat

### 2026-04-17 | Git Sync Monitor 超时
- 问题：Git 同步监控任务执行超时 (300 秒)
- 原因：待排查 (网络或仓库数据量)
- 标签：#lesson-learned #cron #git

---

## 重要信息

### 2026-04-19 | 技能版本检查报告
- 检查日期：2026-04-19 02:00:45
- 总技能数：19，有版本声明：19，待添加版本：0
- 所有技能版本声明正确，无需更新
- 版本异常项：
  - `openclaw-github-trending`: `vv2.0.0` (双 v 前缀，建议修正为 `v2.0.0`)
  - `xiucheng-self-improving-agent`: `v"1.0.0"` (含引号，建议修正为 `v1.0.0`)
- 技能依赖状态：Node.js v22.22.2 / npm 10.9.7 / curl 8.5.0 全部正常
- 标签：#system #skills #maintenance

### 2026-04-17 | 工作区结构
```
/root/.openclaw/workspace/
├── AGENTS.md        # 操作规范
├── SOUL.md          # 性格与价值观
├── IDENTITY.md      # 身份定义
├── USER.md          # 用户偏好
├── TOOLS.md         # 工具配置
├── HEARTBEAT.md     # 心跳检查项
├── MEMORY.md        # 长期记忆
├── DREAMS.md        # 梦境记忆
├── archive/         # 历史归档
├── memory/          # 每日笔记
└── skills/          # 技能目录
```
- 标签：#system #structure

---

## 记忆维护指南
1. 新的重要信息应及时追加到此文件
2. 过期或无用的记忆应定期清理
3. 建议按季度归档旧记忆到独立的归档文件
4. 标签体系保持一致，便于检索

Version: 2.0 | Last Update: 2026-04-19 02:00 UTC+8

### 更新日志
- **2026-04-19 02:00**: 技能版本检查报告（19 技能全合规，2 项格式异常待修正）
- **2026-04-17 13:30**: 全面精简 — 对齐官方文档规范
  - 删除：占位模板（经验教训/重要信息空条目）
  - 删除：cron 任务详情（已在 AGENTS.md）
  - 删除：skill 版本表（过时数据）
  - 删除：短记忆 promotion 冗余内容
  - 保留：用户偏好 + 项目知识 + 经验教训 + 重要配置
  - 新增：系统优化偏好、工作区结构图
  - 精简后：360 → 180 行 (-50%)
