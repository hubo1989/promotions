const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { fixSvgPaths } = require('./fixSvgPaths');

// 存储已处理的文件路径防止重复处理
const processedFiles = new Set();
// 存储修复后的SVG文件映射
const fixedSvgMap = new Map();

// 预处理所有SVG文件
function preprocessSvgFiles() {
  const svgFiles = findFilesWithExt(process.cwd(), '.svg');
  console.log(`预处理 ${svgFiles.length} 个SVG文件...`);
  
  svgFiles.forEach(svgFile => {
    const fixedPath = fixSvgPaths(svgFile);
    fixedSvgMap.set(path.relative(process.cwd(), svgFile), path.relative(process.cwd(), fixedPath));
    console.log(`  映射: ${svgFile} -> ${fixedPath}`);
  });
}

// 寻找指定扩展名的文件
function findFilesWithExt(dir, ext) {
  const results = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...findFilesWithExt(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  });
  
  return results;
}

function readFileContent(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function processSvg(svgPath, baseDir) {
  const fullPath = path.resolve(baseDir, svgPath);
  if (fs.existsSync(fullPath)) {
    // 检查是否有修复版的SVG
    const relativePath = path.relative(process.cwd(), fullPath);
    if (fixedSvgMap.has(relativePath)) {
      const fixedSvgPath = path.resolve(process.cwd(), fixedSvgMap.get(relativePath));
      console.log(`使用修复版SVG: ${fixedSvgPath}`);
      const svgContent = fs.readFileSync(fixedSvgPath, 'utf8');
      return svgContent;
    } else {
      // 使用原始SVG
      const svgContent = fs.readFileSync(fullPath, 'utf8');
      return svgContent;
    }
  }
  return '';
}

function inlineAssets(htmlContent, baseDir) {
  const $ = cheerio.load(htmlContent, { decodeEntities: false });

  // 处理 CSS
  $('link[rel="stylesheet"]').each((_, elem) => {
    const href = $(elem).attr('href');
    if (href && !/^https?:\/\//.test(href)) {
      const cssPath = path.resolve(baseDir, href);
      if (fs.existsSync(cssPath) && !processedFiles.has(cssPath)) {
        processedFiles.add(cssPath);
        const cssText = fs.readFileSync(cssPath, 'utf8');
        $(elem).replaceWith(`<style>/* ${href} */\n${cssText}</style>`);
      }
    }
  });

  // 处理 JavaScript
  $('script[src]').each((_, elem) => {
    const src = $(elem).attr('src');
    if (src && !/^https?:\/\//.test(src)) {
      const scriptPath = path.resolve(baseDir, src);
      if (fs.existsSync(scriptPath) && !processedFiles.has(scriptPath)) {
        processedFiles.add(scriptPath);
        const jsText = fs.readFileSync(scriptPath, 'utf8');
        $(elem).removeAttr('src').html(`/* ${src} */\n${jsText}`);
      }
    }
  });

  // 处理图片和SVG
  $('img, object').each((_, elem) => {
    const tagName = $(elem).prop('tagName').toLowerCase();
    const src = tagName === 'img' ? $(elem).attr('src') : $(elem).attr('data');

    if (src && !/^(data:|https?:)/.test(src)) {
      const resourcePath = path.resolve(baseDir, src);
      if (fs.existsSync(resourcePath) && !processedFiles.has(resourcePath)) {
        processedFiles.add(resourcePath);
        
        if (path.extname(resourcePath).toLowerCase() === '.svg') {
          const svgContent = processSvg(src, baseDir);
          if (svgContent) {
            if (tagName === 'object') {
              $(elem).replaceWith(svgContent);
            } else {
              $(elem).attr('src', `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`);
            }
          }
        } else {
          const mimeType = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
          }[path.extname(resourcePath).toLowerCase()] || 'application/octet-stream';
          
          const data64 = fs.readFileSync(resourcePath).toString('base64');
          $(elem).attr('src', `data:${mimeType};base64,${data64}`);
        }
      }
    }
  });

  // 处理iframe
  $('iframe').each((_, elem) => {
    const src = $(elem).attr('src');
    if (src && !/^(data:|https?:)/.test(src)) {
      const iframePath = path.resolve(baseDir, src);
      if (fs.existsSync(iframePath) && !processedFiles.has(iframePath)) {
        processedFiles.add(iframePath);
        const iframeContent = processSingleHtml(iframePath);
        $(elem).replaceWith(`<div class="embedded-iframe">${iframeContent}</div>`);
      }
    }
  });

  // 处理HTML链接
  $('a[href]').each((_, elem) => {
    const href = $(elem).attr('href');
    if (href && href.endsWith('.html')) {
      const pageName = path.basename(href, '.html');
      $(elem).attr('href', `javascript:showPage('${pageName}')`);
    }
  });

  return $.html();
}

function processSingleHtml(filePath) {
  console.log(`处理HTML: ${filePath}`);
  const baseDir = path.dirname(filePath);
  const rawHtml = readFileContent(filePath);
  return inlineAssets(rawHtml, baseDir);
}

function findAllHtmlFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results.push(...findAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });

  return results;
}

function bundleProject(entryFile = 'main.html') {
  // 预处理SVG文件
  preprocessSvgFiles();
  
  processedFiles.clear();
  const allHtmlFiles = findAllHtmlFiles(path.dirname(entryFile));
  console.log(`找到 ${allHtmlFiles.length} 个HTML文件`);
  
  // 处理所有HTML文件
  const processedContents = new Map();
  allHtmlFiles.forEach(file => {
    const content = processSingleHtml(file);
    processedContents.set(path.basename(file), content);
  });

  // 构建主文档
  const mainContent = processedContents.get(path.basename(entryFile));
  const $main = cheerio.load(mainContent, { decodeEntities: false });

  // 添加隐藏容器
  $main('body').append('<div id="__all_pages__" style="display:none;"></div>');

  // 插入所有页面内容
  processedContents.forEach((content, fileName) => {
    if (fileName !== path.basename(entryFile)) {
      $main('#__all_pages__').append(`<div id="page-${fileName.replace('.html', '')}">${content}</div>`);
    }
  });

  // 添加页面切换逻辑
  $main('body').append(`
    <script>
      function showPage(pageId) {
        // 隐藏所有内容
        const mainContent = document.querySelector('.main-content');
        const targetPage = document.getElementById('page-' + pageId);
        
        if (mainContent && targetPage) {
          mainContent.innerHTML = targetPage.innerHTML;
          
          // 更新导航状态
          document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
          });
          const activeBtn = document.querySelector(\`button[onclick*="'\${pageId}'"]\`);
          if (activeBtn) activeBtn.classList.add('active');
        }
        
        // 重新执行内联脚本
        const scripts = mainContent.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const oldScript = scripts[i];
          const newScript = document.createElement('script');
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
        }
      }
    </script>
  `);

  // 写入最终文件
  fs.writeFileSync('complete_bundle.html', $main.html());
  console.log('打包完成！生成文件：complete_bundle.html');
}

// 执行打包
bundleProject('main.html'); 