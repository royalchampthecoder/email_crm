/* ================================================
   UTILITIES.JS
   COMPLETE FIXED + MODERN VERSION
   ================================================= */

/* ================================================
   SAFE APP STATE
   ================================================= */

window.AppState = window.AppState || {
  theme: 'light'
};

/* ================================================
   HELPERS
   ================================================= */

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value == null ? '' : String(value);
  return div.innerHTML;
}

function parseAppDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const match = dateStr.trim().match(
    /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2})\s*(AM|PM))?$/i
  );

  if (!match) {
    const fallback = new Date(dateStr);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  let [, dd, mm, yyyy, hh = '0', min = '0', meridiem = ''] = match;

  dd = Number(dd);
  mm = Number(mm);
  yyyy = Number(yyyy);
  hh = Number(hh);
  min = Number(min);

  if (meridiem) {
    const upper = meridiem.toUpperCase();
    if (upper === 'PM' && hh < 12) hh += 12;
    if (upper === 'AM' && hh === 12) hh = 0;
  }

  const date = new Date(yyyy, mm - 1, dd, hh, min, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

/* ================================================
   TOAST NOTIFICATIONS
   ================================================= */

class Toast {
  constructor() {
    this.container = null;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.container = this.createContainer();
      });
    } else {
      this.container = this.createContainer();
    }
  }

  createContainer() {
    let container = document.getElementById('toastContainer');

    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    return container;
  }

  ensureContainer() {
    if (!this.container || !document.body.contains(this.container)) {
      this.container = this.createContainer();
    }
    return this.container;
  }

  show(message, type = 'info', duration = 3000) {
    const container = this.ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    toast.innerHTML = `
      <div class="toast-inner" style="display:flex;align-items:flex-start;gap:12px;width:100%;">
        <div class="toast-message" style="flex:1;">${escapeHtml(message)}</div>
        <button class="toast-close" type="button" aria-label="Close notification">&times;</button>
      </div>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.remove(toast);
      });
    }

    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }

    return toast;
  }

  remove(toast) {
    if (!toast) return;

    toast.classList.remove('show');

    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }

  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 3000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 3000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
}

window.toast = new Toast();

/* ================================================
   THEME MANAGER
   ================================================= */

class ThemeManager {
 constructor() {
  this.theme = localStorage.getItem('theme') || window.AppState?.theme || 'light';
  this.handleToggle = this.handleToggle.bind(this);
  this.bound = false;
  this.init();
}

  init() {
    this.apply(this.theme);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupToggle(), { once: true });
    } else {
      this.setupToggle();
    }
  }

  apply(theme) {
  this.theme = theme === 'dark' ? 'dark' : 'light';
  window.AppState.theme = this.theme;
  localStorage.setItem('theme', this.theme);

  if (this.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  this.updateToggleIcon();
}

  handleToggle(e) {
    if (e) e.preventDefault();
    this.apply(this.theme === 'dark' ? 'light' : 'dark');
  }

  setupToggle() {
    const toggle = document.getElementById('themeToggle');

    if (!toggle) {
      console.warn('themeToggle button not found on this page');
      return;
    }

    toggle.removeEventListener('click', this.handleToggle);
    toggle.addEventListener('click', this.handleToggle);
    this.bound = true;
    this.updateToggleIcon();
  }

  updateToggleIcon() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    if (this.theme === 'dark') {
      toggle.innerHTML = '<i class="fa fa-sun"></i>';
      toggle.setAttribute('aria-label', 'Switch to light mode');
      toggle.setAttribute('title', 'Switch to light mode');
    } else {
      toggle.innerHTML = '<i class="fa fa-moon"></i>';
      toggle.setAttribute('aria-label', 'Switch to dark mode');
      toggle.setAttribute('title', 'Switch to dark mode');
    }
  }
}

window.themeManager = new ThemeManager();

/* ================================================
   FORM VALIDATOR
   ================================================= */

class FormValidator {
  static email(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
  }

  static required(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  static minLength(value, min) {
    return this.required(value) && String(value).length >= min;
  }

  static validate(form) {
    const errors = {};
    if (!form) return errors;

    const fields = form.querySelectorAll('[required]');

    fields.forEach(field => {
      const name = field.name || field.id || 'Field';

      if (!this.required(field.value)) {
        errors[name] = `${name} is required`;
      }

      if (field.type === 'email' && field.value && !this.email(field.value)) {
        errors[name] = 'Invalid email address';
      }
    });

    return errors;
  }

  static showErrors(errors, form) {
    this.clearErrors(form);

    Object.keys(errors).forEach(key => {
      const field =
        form.querySelector(`[name="${key}"]`) ||
        form.querySelector(`#${CSS.escape(key)}`);

      if (!field) return;

      field.style.borderColor = 'var(--danger)';
      field.title = errors[key];
    });
  }

  static clearErrors(form) {
    if (!form) return;

    const fields = form.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
      field.style.borderColor = '';
      field.title = '';
    });
  }
}

window.FormValidator = FormValidator;

/* ================================================
   API HELPER
   ================================================= */

class API {
  static async fetch(url, options = {}) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error('API.fetch error:', error);
      throw error;
    }
  }

  static async post(url, data = {}) {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        return await response.json();
      }

      return await response.text();
    } catch (error) {
      console.error('API.post error:', error);
      throw error;
    }
  }

  static sanitize(text) {
    return escapeHtml(text);
  }
}

window.API = API;

/* ================================================
   DOM HELPER
   ================================================= */

class DOM {
  static query(selector, parent = document) {
    return parent.querySelector(selector);
  }

  static queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  static create(tag, options = {}) {
    const el = document.createElement(tag);

    if (options.class) el.className = options.class;
    if (options.id) el.id = options.id;
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;

    if (options.attrs && typeof options.attrs === 'object') {
      Object.entries(options.attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
      });
    }

    return el;
  }

  static resolve(el) {
    return typeof el === 'string' ? this.query(el) : el;
  }

  static remove(el) {
    const element = this.resolve(el);
    if (element) element.remove();
  }

  static show(el) {
    const element = this.resolve(el);
    if (!element) return;
    element.classList.remove('hidden');
  }

  static hide(el) {
    const element = this.resolve(el);
    if (!element) return;
    element.classList.add('hidden');
  }

  static addClass(el, className) {
    const element = this.resolve(el);
    if (element) element.classList.add(className);
  }

  static removeClass(el, className) {
    const element = this.resolve(el);
    if (element) element.classList.remove(className);
  }

  static toggleClass(el, className) {
    const element = this.resolve(el);
    if (element) element.classList.toggle(className);
  }
}

window.DOM = DOM;

/* ================================================
   SIDEBAR MANAGER
   ================================================= */

class SidebarManager {
  constructor() {
    this.sidebar = null;
    this.toggleBtn = null;
    this.layout = null;
    this.boundOutsideClick = this.handleOutsideClick.bind(this);
    this.boundToggleClick = this.handleToggleClick.bind(this);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init(), { once: true });
    } else {
      this.init();
    }
  }

  init() {
    this.sidebar = document.querySelector('.sidebar');
    this.toggleBtn = document.querySelector('.sidebar-toggle');
    this.layout = document.querySelector('.main-layout');

    if (!this.toggleBtn) return;

    this.toggleBtn.removeEventListener('click', this.boundToggleClick);
    this.toggleBtn.addEventListener('click', this.boundToggleClick);

    document.removeEventListener('click', this.boundOutsideClick);
    document.addEventListener('click', this.boundOutsideClick);
  }

  handleToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggleSidebar();
  }

  toggleSidebar() {
    if (this.sidebar) this.sidebar.classList.toggle('open');
    if (this.layout) this.layout.classList.toggle('sidebar-open');
  }

  handleOutsideClick(e) {
    if (!this.sidebar || !this.toggleBtn) return;

    const clickedInside =
      this.sidebar.contains(e.target) || this.toggleBtn.contains(e.target);

    if (!clickedInside) {
      this.closeSidebar();
    }
  }

  closeSidebar() {
    if (this.sidebar) this.sidebar.classList.remove('open');
    if (this.layout) this.layout.classList.remove('sidebar-open');
  }
}

window.sidebarManager = new SidebarManager();

/* ================================================
   MODAL MANAGER
   ================================================= */

class ModalManager {
  static lockScroll() {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  static unlockScrollIfNeeded() {
    const hasOpenModal = document.querySelector('.modal.show');
    if (!hasOpenModal) {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  static open(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) {
      console.error(`Modal not found: ${modalId}`);
      return;
    }

    modal.classList.add('show');
    this.lockScroll();
  }

  static close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('show');
    this.unlockScrollIfNeeded();
  }

  static closeElement(modal) {
    if (!modal) return;
    modal.classList.remove('show');
    this.unlockScrollIfNeeded();
  }

  static closeAll() {
    document.querySelectorAll('.modal.show').forEach(modal => {
      modal.classList.remove('show');
    });

    this.unlockScrollIfNeeded();
  }

  static setupCloseButtons() {
    document.querySelectorAll('.modal .close').forEach(btn => {
      btn.removeEventListener('click', btn.__modalCloseHandler);

      btn.__modalCloseHandler = () => {
        const modal = btn.closest('.modal');
        this.closeElement(modal);
      };

      btn.addEventListener('click', btn.__modalCloseHandler);
    });
  }

  static setupBackdropClose() {
    document.removeEventListener('click', this.__backdropHandler);

    this.__backdropHandler = e => {
      if (e.target.classList && e.target.classList.contains('modal')) {
        this.closeElement(e.target);
      }
    };

    document.addEventListener('click', this.__backdropHandler);
  }
}

window.ModalManager = ModalManager;

/* ================================================
   DATE HELPER
   ================================================= */

class DateHelper {
  static parse(date) {
    return parseAppDate(date);
  }

  static format(date) {
    const parsed = date instanceof Date ? date : this.parse(date);
    if (!parsed) return '';

    const d = String(parsed.getDate()).padStart(2, '0');
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const y = parsed.getFullYear();

    return `${d}-${m}-${y}`;
  }

  static isToday(dateStr) {
    const date = this.parse(dateStr);
    if (!date) return false;

    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  static daysAgo(dateStr) {
    const date = this.parse(dateStr);
    if (!date) return '';

    const now = new Date();
    const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = Math.floor((startNow - startDate) / (1000 * 60 * 60 * 24));

    if (diff <= 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;

    return this.format(date);
  }
}

window.DateHelper = DateHelper;

/* ================================================
   STORAGE
   ================================================= */

/* ================================================
   STORAGE
   ================================================= */

class Storage {
  static memory = {};

  static isLocalStorageAvailable() {
    try {
      const testKey = '__app_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  static set(key, value) {
    this.memory[key] = value;

    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn('Storage.set localStorage failed:', error);
      }
    }
  }

  static get(key) {
    if (this.isLocalStorageAvailable()) {
      try {
        const item = localStorage.getItem(key);
        if (item !== null) {
          return JSON.parse(item);
        }
      } catch (error) {
        console.warn('Storage.get localStorage failed:', error);
      }
    }

    return Object.prototype.hasOwnProperty.call(this.memory, key)
      ? this.memory[key]
      : null;
  }

  static remove(key) {
    delete this.memory[key];

    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Storage.remove localStorage failed:', error);
      }
    }
  }

  static clear() {
    this.memory = {};

    if (this.isLocalStorageAvailable()) {
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('Storage.clear localStorage failed:', error);
      }
    }
  }
}

window.Storage = Storage;

/* ================================================
   ESC CLOSE
   ================================================= */

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ModalManager.closeAll();
  }
});

/* ================================================
   GLOBAL INIT
   ================================================= */

document.addEventListener('DOMContentLoaded', () => {
  ModalManager.setupCloseButtons();
  ModalManager.setupBackdropClose();
});