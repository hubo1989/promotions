/**
 * Package Card Component
 * Reusable component for displaying benefit packages across the admin interface
 */

class PackageCard {
    /**
     * Create a new package card
     * @param {Object} config - Card configuration
     * @param {string} config.id - Unique identifier for the package
     * @param {string} config.title - Package title
     * @param {string} config.status - Package status (e.g., "已上线", "待发布")
     * @param {string} config.packageId - Package ID code
     * @param {string} config.icon - Font Awesome icon class
     * @param {string} config.iconBg - CSS color class for icon background
     * @param {Object} config.stats - Key-value pairs of package statistics
     * @param {Array} config.benefits - Array of benefit items in the package
     * @param {Object} config.dates - Key-value pairs of date information
     * @param {boolean} config.editable - Whether the package is editable
     */
    constructor(config) {
        this.id = config.id || `package-${Math.random().toString(36).substr(2, 9)}`;
        this.title = config.title || 'Untitled Package';
        this.status = config.status || '待发布';
        this.packageId = config.packageId || `BP${Math.floor(10000 + Math.random() * 90000)}`;
        this.icon = config.icon || 'fa-gift';
        this.iconBg = config.iconBg || 'blue';
        this.stats = config.stats || {};
        this.benefits = config.benefits || [];
        this.dates = config.dates || {};
        this.editable = config.editable !== undefined ? config.editable : true;
        
        // Map status to colors
        this.statusColors = {
            '已上线': 'green',
            '待发布': 'yellow',
            '已下线': 'gray',
            '已过期': 'red'
        };
    }

    /**
     * Render card as HTML
     * @returns {string} HTML string for the card
     */
    render() {
        // Prepare stats section
        const statsHTML = Object.keys(this.stats).map((key, index) => {
            return `
                <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-sm text-gray-500 mb-1">${key}</p>
                    <p class="text-lg font-bold text-gray-800">${this.stats[key]}</p>
                </div>
            `;
        }).join('');
        
        // Prepare benefits section
        const benefitsHTML = this.benefits.map(benefit => {
            return `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas ${benefit.icon || 'fa-check'} text-indigo-500 mr-2"></i>
                        <span class="text-gray-700">${benefit.name}</span>
                    </div>
                    <span class="text-gray-600">${benefit.value}</span>
                </div>
            `;
        }).join('');
        
        // Prepare dates section
        const datesHTML = Object.keys(this.dates).map(key => `<span>${key}: ${this.dates[key]}</span>`).join('<span class="mx-2">|</span>');
        
        // Get status color
        const statusColor = this.statusColors[this.status] || 'gray';
        
        // Render full card
        return `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden package-card" id="${this.id}">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center">
                            <div class="w-12 h-12 rounded-full bg-${this.iconBg}-100 flex items-center justify-center mr-4">
                                <i class="fas ${this.icon} text-${this.iconBg}-600 text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-1">${this.title}</h3>
                                <div class="flex items-center">
                                    <span class="bg-${statusColor}-100 text-${statusColor}-800 text-xs px-2 py-1 rounded-full mr-2">${this.status}</span>
                                    <span class="text-gray-500 text-sm">ID: ${this.packageId}</span>
                                </div>
                            </div>
                        </div>
                        ${this.editable ? `
                        <div class="flex space-x-2">
                            <button class="text-gray-500 hover:text-gray-700 p-2 edit-package-btn" data-id="${this.id}" data-status="${this.status}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="text-gray-500 hover:text-gray-700 p-2 copy-package-btn" data-id="${this.id}">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="text-gray-500 hover:text-red-600 p-2 delete-package-btn" data-id="${this.id}" data-status="${this.status}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                        ` : ''}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        ${statsHTML}
                    </div>
                    ${this.benefits.length > 0 ? `
                    <div class="border-t border-gray-100 pt-4">
                        <h4 class="font-bold text-gray-700 mb-2">包含权益项</h4>
                        <div class="space-y-2">
                            ${benefitsHTML}
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="bg-gray-50 px-6 py-3 flex justify-between items-center">
                    <div class="text-sm text-gray-500">
                        ${datesHTML}
                    </div>
                    <div class="flex space-x-2">
                        ${this.status === '已上线' ? `
                        <button class="bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded hover:bg-red-100 text-sm offline-btn" data-id="${this.id}">
                            下线
                        </button>
                        ` : this.status === '待发布' || this.status === '已下线' ? `
                        <button class="bg-green-50 border border-green-200 text-green-600 px-3 py-1 rounded hover:bg-green-100 text-sm online-btn" data-id="${this.id}">
                            上线
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Add event listeners to the card after it's rendered to the DOM
     */
    attachEventListeners() {
        const cardElement = document.getElementById(this.id);
        if (!cardElement) return;

        // Edit button
        const editBtn = cardElement.querySelector('.edit-package-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (event) => {
                event.preventDefault();
                const status = editBtn.getAttribute('data-status');
                if (status !== '已下线') {
                    this.showStatusNotification('只有已下线的权益包才能修改');
                    return;
                }
                this.onEdit(this.id);
            });
        }

        // Copy button
        const copyBtn = cardElement.querySelector('.copy-package-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', (event) => {
                event.preventDefault();
                this.onCopy(this.id);
            });
        }

        // Delete button
        const deleteBtn = cardElement.querySelector('.delete-package-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (event) => {
                event.preventDefault();
                const status = deleteBtn.getAttribute('data-status');
                if (status !== '已下线') {
                    this.showStatusNotification('只有已下线的权益包才能删除');
                    return;
                }
                this.onDelete(this.id);
            });
        }

        // Online button
        const onlineBtn = cardElement.querySelector('.online-btn');
        if (onlineBtn) {
            onlineBtn.addEventListener('click', (event) => {
                event.preventDefault();
                this.onSetOnline(this.id);
            });
        }

        // Offline button
        const offlineBtn = cardElement.querySelector('.offline-btn');
        if (offlineBtn) {
            offlineBtn.addEventListener('click', (event) => {
                event.preventDefault();
                this.onSetOffline(this.id);
            });
        }
    }

    // 显示状态相关的通知
    showStatusNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded shadow-md z-50';
        notification.innerHTML = `
            <div class="flex items-center">
                <div class="py-1"><svg class="h-6 w-6 text-amber-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg></div>
                <div>${message}</div>
            </div>
        `;
        document.body.appendChild(notification);
        
        // 3秒后自动消失
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Event handlers - should be overridden by implementation
    onEdit(id) {
        console.log(`Edit package: ${id}`);
    }

    onCopy(id) {
        console.log(`Copy package: ${id}`);
    }

    onDelete(id) {
        console.log(`Delete package: ${id}`);
    }

    onSetOnline(id) {
        console.log(`Set package online: ${id}`);
    }

    onSetOffline(id) {
        console.log(`Set package offline: ${id}`);
    }
}

// Sample usage:
/*
const package = new PackageCard({
    title: '黄金VIP会员',
    status: '已上线',
    packageId: 'BP10023',
    icon: 'fa-crown',
    iconBg: 'amber',
    stats: {
        '价格': '¥59.00',
        '有效期': '90天',
        '销售量': '1,234',
        '使用率': '78.5%'
    },
    benefits: [
        { name: '满5000-10元手续费抵扣券', value: '30张', icon: 'fa-ticket-alt' },
        { name: '信用卡评测权益', value: '无限次', icon: 'fa-chart-line' },
        { name: '专属一对一客服支持', value: '包含', icon: 'fa-headset' }
    ],
    dates: {
        '创建时间': '2023-06-15',
        '上线时间': '2023-06-20'
    }
});

// Render to DOM
document.getElementById('package-container').innerHTML = package.render();
package.attachEventListeners();
*/ 