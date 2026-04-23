const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const NEWS_DIR = '/root/.openclaw/workspace/news';
const FEISHU_DM = 'ou_63a0ac397bf0e77bd4ef632b0822a779';

// 确保新闻目录存在
if (!fs.existsSync(NEWS_DIR)) {
  fs.mkdirSync(NEWS_DIR, { recursive: true });
}

// GitHub Trending URL 列表（按语言分类）
const TRENDING_URLS = {
  'JavaScript': 'https://github.com/trending?since=daily&language=javascript',
  'TypeScript': 'https://github.com/trending?since=daily&language=typescript',
  'Python': 'https://github.com/trending?since=daily&language=python',
};

// 获取网页内容
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 解析 GitHub Trending 页面
function parseTrending(html) {
  const projects = [];
  
  // 匹配项目卡片
  const projectRegex = /<article[^>]*data-test-selector="table-row-component"[^>]*>[\s\S]*?<\/article>/g;
  const matches = html.match(projectRegex);
  
  if (!matches) return projects;
  
  for (const match of matches) {
    const project = parseProject(match);
    if (project) projects.push(project);
  }
  
  return projects;
}

// 解析单个项目
function parseProject(html) {
  // 提取作者和仓库名
  const repoMatch = html.match(/href="\/([^/]+\/[^"]+)"[^>]*data-hydro-click=/);
  if (!repoMatch) return null;
  
  const repo = repoMatch[1];
  
  // 提取标题
  const titleMatch = html.match(/title="[^"]*\/([^"]+)"[^>]*data-hydro-click=/);
  const title = titleMatch ? titleMatch[1] : repo.split('/')[1];
  
  // 提取描述
  const descMatch = html.match(/<p class="col-9[^"]*">([^<]+)<\/p>/);
  const description = descMatch ? descMatch[1].trim() : '';
  
  // 提取语言
  const langMatch = html.match(/itemprop="programmingLanguage"[^>]*>([^<]+)<\/span>/);
  const language = langMatch ? langMatch[1].trim() : 'Unknown';
  
  // 提取 Star 数
  const starMatch = html.match(/<svg[^>]*class="octicon octicon-star[^>]*>[^<]*<\/svg>\s*<span[^>]*>([^<]+)<\/span>/);
  const stars = starMatch ? starMatch[1].trim() : '0';
  
  // 提取 Fork 数
  const forkMatch = html.match(/<svg[^>]*class="octicon octicon-repo-forked[^>]*>[^<]*<\/svg>\s*<span[^>]*>([^<]+)<\/span>/);
  const forks = forkMatch ? forkMatch[1].trim() : '0';
  
  // 提取今日 Stars
  const todayStarsMatch = html.match(/<span[^>]*data-test-selector="repo-list-stars[^>]*>Today[^<]*<\/span>\s*<span[^>]*data-menu-button-text[^>]*>([^<]+)<\/span>/);
  const todayStars = todayStarsMatch ? todayStarsMatch[1].trim() : '0';
  
  // 提取图标链接
  const iconMatch = html.match(/src="([^"]+)"[^>]*class="avatar[^>]*width="40"/);
  const icon = iconMatch ? iconMatch[1] : '';
  
  return {
    repo,
    title,
    description,
    language,
    stars,
    forks,
    todayStars,
    icon,
    url: `https://github.com/${repo}`,
  };
}

// 生成中文介绍
function generateChineseDesc(project) {
  // 简单生成中文描述
  const desc = project.description || '热门 GitHub 项目';
  return `${project.title} - ${project.description}`;
}

// 生成 Markdown 报告
function generateReport(allProjects) {
  let report = `# 📚 GitHub Trending TOP10\n\n`;
  report += `**⏰ 执行时间**：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n\n`;
  report += `**🔍 数据来源**：GitHub Trending\n\n`;
  report += `---\n\n`;
  
  // 合并所有项目的前 10 名
  const top10 = [];
  const seen = new Set();
  
  for (const lang in allProjects) {
    for (const project of allProjects[lang]) {
      if (seen.size >= 10) break;
      if (!seen.has(project.repo)) {
        seen.add(project.repo);
        top10.push({ ...project, language: lang });
      }
    }
    if (top10.length >= 10) break;
  }
  
  top10.forEach((project, index) => {
    report += `## 🌟 **#${index + 1} ${project.title}**\n\n`;
    report += `**📦 仓库**：[${project.repo}](https://github.com/${project.repo})\n\n`;
    report += `**💻 语言**：${project.language}\n\n`;
    report += `**⭐ Star**：${project.stars} (今日 +${project.todayStars})\n\n`;
    report += `**-git Fork**：${project.forks}\n\n`;
    report += `**📝 介绍**：${project.description}\n\n`;
    report += `**💡 推荐理由**：该项目在 GitHub Trending 中表现优异，是${project.language}领域的热门项目。\n\n`;
    report += `---\n\n`;
  });
  
  report += `\n## 📊 统计信息\n\n`;
  report += `**📊 今日热门语言**：${Object.keys(allProjects).join('、')}\n\n`;
  report += `**🌐 数据来源**：https://github.com/trending\n\n`;
  
  return report;
}

// 发送到 Feishu
function sendToFeishu(report) {
  const webhookUrl = 'https://open.feishu.cn/open-apis/bot/v2/hook'; // 示例 URL，实际使用时需要配置
  
  console.log('报告已生成，可以发送到 Feishu');
  console.log('实际推送需要配置飞书机器人的 Webhook 地址');
}

// 主函数
async function main() {
  console.log('开始抓取 GitHub Trending...');
  
  const allProjects = {};
  
  for (const [lang, url] of Object.entries(TRENDING_URLS)) {
    console.log(`抓取 ${lang} 分类...`);
    try {
      const html = await fetchPage(url);
      const projects = parseTrending(html);
      allProjects[lang] = projects.slice(0, 10); // 只取前 10 个
      console.log(`  ✓ 抓取到 ${projects.length} 个项目`);
    } catch (err) {
      console.error(`  ✗ ${lang} 抓取失败:`, err.message);
      allProjects[lang] = [];
    }
  }
  
  // 生成报告
  const report = generateReport(allProjects);
  
  // 保存到文件
  const timestamp = new Date().toLocaleDateString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '');
  
  const filePath = path.join(NEWS_DIR, `github-trending-${timestamp}.md`);
  fs.writeFileSync(filePath, report, 'utf-8');
  
  console.log(`报告已保存到: ${filePath}`);
  console.log('\n前 5 个项目预览:');
  console.log(report.split('\n').slice(0, 20).join('\n'));
  
  return report;
}

// 运行主函数
main().catch(console.error);
