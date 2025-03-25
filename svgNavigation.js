/**
 * SVG Navigation Helper - Works with both local files and server
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're running from file:// protocol
    const isLocalFile = window.location.protocol === 'file:';
    
    if (isLocalFile) {
        // Local file approach: Replace object with inline SVG
        const objectElem = document.querySelector('object[data$=".svg"]');
        const svgPath = objectElem.getAttribute('data');
        
        // Create an iframe as fallback that will handle navigation properly
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', svgPath);
        iframe.style.width = '100%';
        iframe.style.height = '1800px';
        iframe.style.border = 'none';
        
        // Replace the object with the iframe
        objectElem.parentNode.replaceChild(iframe, objectElem);
    } else {
        // Server approach: Use the existing script logic
        const svgObjects = document.querySelectorAll('object[data$=".svg"], embed[src$=".svg"]');
        
        svgObjects.forEach(svgObject => {
            svgObject.addEventListener('load', function() {
                const svgDoc = svgObject.contentDocument;
                
                if (svgDoc) {
                    const links = svgDoc.querySelectorAll('a');
                    
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href) {
                            // 修改链接行为
                            link.addEventListener('click', function(e) {
                                e.preventDefault();
                                // 在顶层窗口导航到文件
                                window.top.location.href = href;
                                
                                // 如果需要记录点击统计，可以在这里添加代码
                                console.log('导航到:', href);
                            });
                            
                            // 添加视觉提示，让用户知道这是可点击的
                            link.style.cursor = 'pointer';
                        }
                    });
                }
            });
        });
    }
}); 