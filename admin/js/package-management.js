/**
 * Package Management Module
 * Handles all package-related operations in the admin console
 */

class PackageManager {
    constructor() {
        this.API_ENDPOINT = '/api/v1/packages';
    }

    /**
     * Create a new benefit package
     * @param {Object} packageData - Package data following the schema
     * @returns {Promise<Object>} Created package data
     */
    async createPackage(packageData) {
        try {
            // Validate required fields
            const requiredFields = ['title', 'description', 'price', 'validPeriod', 'benefits'];
            requiredFields.forEach(field => {
                if (!packageData[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            });

            // Mock API call
            console.log('Creating package:', packageData);
            return {
                id: `BP${Math.floor(10000 + Math.random() * 90000)}`,
                ...packageData,
                status: '待发布',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error creating package:', error);
            throw error;
        }
    }

    /**
     * Update an existing benefit package
     * @param {string} packageId - Package ID to update
     * @param {Object} updateData - Updated package data
     * @returns {Promise<Object>} Updated package data
     */
    async updatePackage(packageId, updateData) {
        try {
            // Validate package ID format
            if (!packageId.match(/^BP\d{5}$/)) {
                throw new Error('Invalid package ID format');
            }

            // Mock API call
            console.log('Updating package:', packageId, updateData);
            return {
                id: packageId,
                ...updateData,
                updatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error updating package:', error);
            throw error;
        }
    }

    /**
     * Export package data to CSV
     * @param {Array<string>} packageIds - Array of package IDs to export
     * @returns {Promise<Blob>} CSV file blob
     */
    async exportPackages(packageIds = []) {
        try {
            // Mock API call
            console.log('Exporting packages:', packageIds);
            
            // Generate CSV content
            const headers = ['Package ID', 'Title', 'Status', 'Price', 'Created At', 'Updated At'];
            const rows = [
                headers.join(','),
                'BP10001,黄金VIP会员,已上线,59.00,2023-06-15,2023-06-20',
                'BP10002,铂金VIP会员,已上线,109.00,2023-07-10,2023-07-15'
            ];
            
            // Create and return blob
            return new Blob([rows.join('\n')], { type: 'text/csv' });
        } catch (error) {
            console.error('Error exporting packages:', error);
            throw error;
        }
    }

    /**
     * Get detailed package information
     * @param {string} packageId - Package ID to retrieve
     * @returns {Promise<Object>} Package details
     */
    async getPackageDetails(packageId) {
        try {
            // Mock API call
            console.log('Getting package details:', packageId);
            return {
                id: packageId,
                title: '黄金VIP会员',
                description: 'VIP会员专享权益包',
                status: '已上线',
                price: 59.00,
                originalPrice: 99.00,
                validPeriod: {
                    type: 'fixed_days',
                    days: 90
                },
                benefits: [
                    {
                        id: 'BNF001',
                        name: '满5000-10元手续费抵扣券',
                        quantity: 30,
                        rules: [
                            { type: 'usage_limit', value: 1 }
                        ]
                    }
                ],
                stats: {
                    totalSales: 1234,
                    activeUsers: 956,
                    usageRate: '78.5%'
                },
                createdAt: '2023-06-15T00:00:00Z',
                updatedAt: '2023-06-20T00:00:00Z'
            };
        } catch (error) {
            console.error('Error getting package details:', error);
            throw error;
        }
    }

    /**
     * Change package online/offline status
     * @param {string} packageId - Package ID to update
     * @param {boolean} online - True to set online, false to set offline
     * @returns {Promise<Object>} Updated package data
     */
    async setPackageStatus(packageId, online) {
        try {
            // Mock API call
            console.log('Setting package status:', packageId, online ? 'online' : 'offline');
            return {
                id: packageId,
                status: online ? '已上线' : '已下线',
                updatedAt: new Date().toISOString(),
                [online ? 'publishedAt' : 'offlineAt']: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error setting package status:', error);
            throw error;
        }
    }

    /**
     * Delete a package (only allowed for unpublished packages)
     * @param {string} packageId - Package ID to delete
     * @returns {Promise<boolean>} Success status
     */
    async deletePackage(packageId) {
        try {
            // Mock API call
            console.log('Deleting package:', packageId);
            return true;
        } catch (error) {
            console.error('Error deleting package:', error);
            throw error;
        }
    }
}

// Event handlers for UI interactions
document.addEventListener('DOMContentLoaded', () => {
    const packageManager = new PackageManager();

    // Create package button handler
    const createBtn = document.getElementById('create-package-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            window.location.href = './admin_benefit_config.html?new=true';
        });
    }

    // Export data button handler
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            try {
                const csvBlob = await packageManager.exportPackages();
                const url = URL.createObjectURL(csvBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `benefit-packages-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showNotification('数据导出成功');
            } catch (error) {
                showNotification('导出失败：' + error.message, 'error');
            }
        });
    }

    // Package card event handlers
    document.querySelectorAll('.package-card').forEach(card => {
        const packageId = card.id;

        // View details button
        const viewBtn = card.querySelector('.view-details-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', async () => {
                try {
                    const details = await packageManager.getPackageDetails(packageId);
                    window.location.href = `./admin_benefit_config.html?id=${packageId}`;
                } catch (error) {
                    showNotification('获取详情失败：' + error.message, 'error');
                }
            });
        }

        // Online/Offline buttons
        const onlineBtn = card.querySelector('.online-btn');
        const offlineBtn = card.querySelector('.offline-btn');

        if (onlineBtn) {
            onlineBtn.addEventListener('click', async () => {
                try {
                    await packageManager.setPackageStatus(packageId, true);
                    showNotification('权益包已上线');
                    location.reload();
                } catch (error) {
                    showNotification('上线失败：' + error.message, 'error');
                }
            });
        }

        if (offlineBtn) {
            offlineBtn.addEventListener('click', async () => {
                if (confirm('确定要下线该权益包吗？已购买用户的权益将不受影响。')) {
                    try {
                        await packageManager.setPackageStatus(packageId, false);
                        showNotification('权益包已下线');
                        location.reload();
                    } catch (error) {
                        showNotification('下线失败：' + error.message, 'error');
                    }
                }
            });
        }
    });
}); 