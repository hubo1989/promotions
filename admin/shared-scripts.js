/**
 * Shared JavaScript functions for admin interfaces
 */

// Common event handler initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeButtonHandlers();
    initializeEditHandlers();
});

// Initialize click handlers for common buttons
function initializeButtonHandlers() {
    // Preview button
    const previewBtn = document.querySelector('button[data-action="preview"]');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const target = this.getAttribute('data-target') || '';
            if (target) {
                window.open(target, '_blank');
            }
        });
    }

    // Save configuration button
    const saveBtn = document.querySelector('button[data-action="save"]');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            showNotification('配置已保存成功！');
        });
    }
}

// Initialize edit handlers for editable components
function initializeEditHandlers() {
    // Edit buttons for cards and sections
    document.querySelectorAll('.fa-edit').forEach(icon => {
        icon.addEventListener('click', function() {
            const card = this.closest('.border.border-gray-200') || this.closest('.editable-section');
            if (card) {
                const firstInput = card.querySelector('input, select, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        });
    });
}

// Show notification message
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 bg-${type === 'success' ? 'green' : 'red'}-100 border-l-4 border-${type === 'success' ? 'green' : 'red'}-500 text-${type === 'success' ? 'green' : 'red'}-700 p-4 rounded shadow-md z-50`;
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="py-1"><svg class="h-6 w-6 text-${type === 'success' ? 'green' : 'red'}-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}" />
            </svg></div>
            <div>${message}</div>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
} 