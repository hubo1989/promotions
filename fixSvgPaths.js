/**
 * SVG Path Fixer and Navigation Handler
 * 
 * This script solves two main issues with SVG navigation:
 * 1. Fixes relative paths when SVG is embedded in an iframe
 * 2. Enables navigation in both live server and local file modes
 * 
 * Usage: Include this script in the parent HTML that embeds the SVG
 */

(function() {
    // Configuration
    const svgIframeSelector = 'iframe[src*="system_architecture.svg"]';
    const debug = false; // Set to true for debugging output

    // Logging utility
    const log = (message, type = 'info') => {
        if (debug || type === 'error') {
            console[type === 'error' ? 'error' : 'log'](`[SVG Navigation] ${message}`);
        }
    };

    // Helper function to get base URL
    const getBaseUrl = () => {
        const isLocalFile = window.location.protocol === 'file:';
        if (isLocalFile) {
            // For local file, we want the directory the HTML is in
            const pathParts = window.location.pathname.split('/');
            pathParts.pop(); // Remove the HTML filename
            return `${window.location.protocol}//${pathParts.join('/')}/`;
        } else {
            // For server, use the origin as base
            return window.location.origin + '/';
        }
    };

    // Wait for DOM to be ready
    window.addEventListener('DOMContentLoaded', function() {
        const svgIframe = document.querySelector(svgIframeSelector);
        
        if (!svgIframe) {
            log('SVG iframe not found', 'error');
            return;
        }
        
        log('Found SVG iframe, waiting for it to load');
        
        // Wait for iframe to load
        svgIframe.addEventListener('load', function() {
            try {
                const iframeDoc = svgIframe.contentDocument || svgIframe.contentWindow.document;
                const svgLinks = iframeDoc.querySelectorAll('a');
                const baseUrl = getBaseUrl();
                
                log(`Found ${svgLinks.length} links in SVG, baseUrl: ${baseUrl}`);
                log(`Running in ${window.location.protocol === 'file:' ? 'local file' : 'server'} mode`);
                
                // Process all links in the SVG
                svgLinks.forEach((link, index) => {
                    // Skip links in the application service layer
                    const parentGroup = link.closest('g[transform*="translate(0,250)"]');
                    if (parentGroup) {
                        return;
                    }

                    // Get the original onclick handler
                    const originalOnclick = link.getAttribute('onclick');
                    
                    if (originalOnclick && originalOnclick.includes('window.location.href')) {
                        // Extract the target URL from the onclick attribute
                        const targetMatch = originalOnclick.match(/window\.location\.href=['"]([^'"]+)['"]/);
                        
                        if (targetMatch && targetMatch[1]) {
                            let targetUrl = targetMatch[1];
                            
                            // Remove any leading ../ as we'll use the base URL
                            if (targetUrl.startsWith('../')) {
                                targetUrl = targetUrl.substring(3);
                            }
                            
                            // Support for prototype_h5 directory structure
                            if (targetUrl.startsWith('prototype_h5/')) {
                                // Keep the directory structure for prototype files
                                targetUrl = baseUrl + targetUrl;
                            } else if (!targetUrl.startsWith('http') && !targetUrl.startsWith('/')) {
                                // For other non-absolute URLs
                                targetUrl = baseUrl + targetUrl;
                            }
                            
                            log(`Link ${index}: Original URL: ${targetMatch[1]}, Fixed URL: ${targetUrl}`);
                            
                            // Remove the original onclick handler
                            link.removeAttribute('onclick');
                            
                            // Add new click event handler that navigates the parent window
                            link.addEventListener('click', function(e) {
                                e.preventDefault();
                                log(`Navigating to: ${targetUrl}`);
                                window.parent.location.href = targetUrl;
                            });
                            
                            // Make sure cursor shows as pointer
                            link.style.cursor = 'pointer';
                        }
                    }
                });
                
                log('SVG navigation setup complete');
            } catch (e) {
                log(`Error initializing SVG navigation: ${e.message}`, 'error');
            }
        });
    });
})();

// 修复SVG文件中的路径
function fixSvgPaths(svgPath, pathPrefix = '') {
  console.log(`处理SVG文件: ${svgPath}`);
  
  try {
    // 读取SVG文件
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // 使用cheerio解析SVG (基于XML解析)
    const $ = cheerio.load(svgContent, {
      xmlMode: true,
      decodeEntities: false
    });
    
    // 找到所有链接节点
    $('a').each((_, elem) => {
      const href = $(elem).attr('href');
      
      if (href && href.startsWith('/')) {
        // 将相对路径替换为JavaScript函数调用
        const pageName = path.basename(href, '.html');
        $(elem).attr('href', `javascript:showPage('${pageName}')`);
        console.log(`  转换链接: ${href} -> javascript:showPage('${pageName}')`);
      }
    });
    
    // 保存修改后的SVG
    const outputPath = svgPath.replace('.svg', '_fixed.svg');
    fs.writeFileSync(outputPath, $.html());
    console.log(`SVG路径修复完成，保存至: ${outputPath}`);
    
    return outputPath;
  } catch (error) {
    console.error(`处理SVG文件错误: ${error.message}`);
    return svgPath; // 出错时返回原始路径
  }
}

// 集成到完整打包流程
function integrateWithBundler() {
  // 定位并修复所有SVG文件
  const svgFiles = findSvgFiles(process.cwd());
  console.log(`找到 ${svgFiles.length} 个SVG文件需要处理`);
  
  // 修复每个SVG文件中的路径
  const fixedSvgFiles = new Map();
  svgFiles.forEach(svgFile => {
    const fixedPath = fixSvgPaths(svgFile);
    fixedSvgFiles.set(svgFile, fixedPath);
  });
  
  return fixedSvgFiles;
}

// 查找所有SVG文件
function findSvgFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...findSvgFiles(filePath));
    } else if (file.endsWith('.svg')) {
      results.push(filePath);
    }
  });
  
  return results;
}

// 单独运行此脚本时执行
if (require.main === module) {
  if (process.argv.length > 2) {
    fixSvgPaths(process.argv[2]);
  } else {
    integrateWithBundler();
  }
}

module.exports = { fixSvgPaths, integrateWithBundler }; 