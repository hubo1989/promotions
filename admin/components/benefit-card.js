/**
 * Benefit Card Component
 * Reusable component for displaying benefit cards across the admin interface
 */

class BenefitCard {
    /**
     * Create a new benefit card
     * @param {Object} config - Card configuration
     * @param {string} config.id - Unique identifier for the card
     * @param {string} config.title - Card title
     * @param {string} config.type - Card type (e.g., "抵扣券", "服务权益")
     * @param {string} config.description - Short description
     * @param {string} config.icon - Font Awesome icon class (e.g., "fa-ticket-alt")
     * @param {string} config.iconColor - CSS color class for icon background (e.g., "amber", "blue")
     * @param {Object} config.properties - Key-value pairs of card properties
     * @param {boolean} config.editable - Whether the card is editable
     */
    constructor(config) {
        this.id = config.id || `benefit-${Math.random().toString(36).substr(2, 9)}`;
        this.title = config.title || 'Untitled Benefit';
        this.type = config.type || '未分类权益';
        this.description = config.description || '';
        this.icon = config.icon || 'fa-star';
        this.iconColor = config.iconColor || 'indigo';
        this.properties = config.properties || {};
        this.editable = config.editable !== undefined ? config.editable : true;
    }

    /**
     * Render card as HTML
     * @returns {string} HTML string for the card
     */
    render() {
        // Prepare properties section
        const propertiesHTML = Object.keys(this.properties).map(key => {
            return `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-circle text-xs text-${this.iconColor}-500 mr-2"></i>
                        <span class="text-gray-700">${key}</span>
                    </div>
                    <span class="text-gray-600">${this.properties[key]}</span>
                </div>
            `;
        }).join('');

        // Render full card
        return `
            <div class="border border-gray-200 rounded-lg p-4 benefit-card" id="${this.id}">
                <div class="flex justify-between items-start">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-${this.iconColor}-100 flex items-center justify-center mr-3">
                            <i class="fas ${this.icon} text-${this.iconColor}-600"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-800">${this.title}</h4>
                            <p class="text-sm text-gray-500">${this.description}</p>
                        </div>
                    </div>
                    ${this.editable ? `
                    <div class="flex space-x-2">
                        <button class="text-gray-400 hover:text-gray-600 edit-btn" data-id="${this.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-gray-400 hover:text-red-600 delete-btn" data-id="${this.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    ` : ''}
                </div>
                ${propertiesHTML ? `
                <div class="mt-4 space-y-2">
                    ${propertiesHTML}
                </div>` : ''}
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
        const editBtn = cardElement.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.onEdit(this.id);
            });
        }

        // Delete button
        const deleteBtn = cardElement.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.onDelete(this.id);
            });
        }
    }

    /**
     * Default edit handler - override this method to customize
     */
    onEdit(id) {
        console.log(`Edit card: ${id}`);
        // Should be overridden by implementation
    }

    /**
     * Default delete handler - override this method to customize
     */
    onDelete(id) {
        if (confirm('确定要删除此权益项吗？')) {
            console.log(`Delete card: ${id}`);
            // Should be overridden by implementation
        }
    }
}

// Sample usage:
/*
const card = new BenefitCard({
    title: '满5000-10元手续费抵扣券',
    type: '抵扣券',
    description: '单笔交易满5000元可抵扣10元手续费',
    icon: 'fa-ticket-alt',
    iconColor: 'amber',
    properties: {
        '数量': '30张',
        '使用限制': '每笔交易限用1张'
    }
});

// Render to DOM
document.getElementById('card-container').innerHTML = card.render();
card.attachEventListeners();
*/ 