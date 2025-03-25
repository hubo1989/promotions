/**
 * Admin UI Component Loader
 * This script loads shared resources and components for all admin pages
 */

// Load shared CSS
function loadSharedStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './shared-styles.css';
    document.head.appendChild(link);
}

// Load external dependencies
function loadExternalDependencies() {
    // TailwindCSS
    if (!document.querySelector('script[src*="tailwindcss"]')) {
        const tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwind);
    }
    
    // Font Awesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
}

// Load shared JS
function loadSharedScripts() {
    const script = document.createElement('script');
    script.src = './shared-scripts.js';
    document.body.appendChild(script);
}

// Load navigation components
function loadNavigation(containerId = 'navigation-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    fetch('./components/navigation.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            
            // Execute any scripts in the loaded HTML
            const scripts = container.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
        })
        .catch(error => {
            console.error('Failed to load navigation:', error);
        });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    loadExternalDependencies();
    loadSharedStyles();
    loadSharedScripts();
    loadNavigation();
}); 