/**
 * Social Media Post Management Dashboard — Frontend Interactive Controller
 * Handles Navigation, Theme Toggling, Composer Interactions, Modals, Toasts, and Component Showcases.
 * Strictly visual & UX interactions (No real backend, validation logic, or API calls).
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Navigation & View Switching ---
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const pageViews = document.querySelectorAll('.page-view');
  const sidebar = document.getElementById('sidebar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  function switchView(viewId) {
    // Hide all views
    pageViews.forEach(view => {
      view.classList.remove('active');
    });

    // Show selected view
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update active state on sidebar items
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // On tablet/mobile, close sidebar after navigating
    if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }

    // Scroll top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Attach click listeners to nav items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.getAttribute('data-view');
      switchView(viewId);
    });
  });

  // Also handle links/buttons with [data-goto-view] across the dashboard
  document.querySelectorAll('[data-goto-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = btn.getAttribute('data-goto-view');
      switchView(targetView);
    });
  });

  // --- 2. Mobile Hamburger Sidebar Controller ---
  if (hamburgerBtn && sidebar) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    // Close sidebar on outside click (when open on mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });
  }

  // --- 3. Theme Toggling (Light / Dark Mode) ---
  const themeToggleBtn = document.getElementById('navbarThemeToggle');
  const themeSwitchToggle = document.getElementById('themeSwitchToggle');
  const themeOptionCards = document.querySelectorAll('.theme-option-card');

  function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Update navbar toggle icon and tooltip
    if (themeToggleBtn) {
      if (themeName === 'light') {
        themeToggleBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      } else {
        themeToggleBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      }
    }

    // Update settings toggle switch if present
    if (themeSwitchToggle) {
      themeSwitchToggle.checked = (themeName === 'light');
    }

    // Update active state on theme option cards in Settings
    themeOptionCards.forEach(card => {
      if (card.getAttribute('data-set-theme') === themeName) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Navbar button toggle
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast('info', 'Theme Updated', `Switched interface to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode.`);
    });
  }

  // Settings toggle switch
  if (themeSwitchToggle) {
    themeSwitchToggle.addEventListener('change', () => {
      const nextTheme = themeSwitchToggle.checked ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast('info', 'Theme Updated', `Switched interface to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode.`);
    });
  }

  // Settings theme cards click
  themeOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      const themeName = card.getAttribute('data-set-theme');
      setTheme(themeName);
      showToast('info', 'Theme Preference Set', `Default theme preference locked to ${themeName.toUpperCase()}`);
    });
  });

  // --- 4. Post Composer Interactions ---
  const postTextarea = document.getElementById('postTextarea');
  const charCounter = document.getElementById('composerCharCounter');
  const maxChars = 2200;

  if (postTextarea && charCounter) {
    postTextarea.addEventListener('input', () => {
      const currentLength = postTextarea.value.length;
      charCounter.textContent = `${currentLength.toLocaleString()} / ${maxChars.toLocaleString()} characters`;

      // Update styling based on thresholds
      charCounter.classList.remove('warning', 'danger');
      if (currentLength > maxChars) {
        charCounter.classList.add('danger');
      } else if (currentLength > maxChars * 0.85) {
        charCounter.classList.add('warning');
      }
    });
  }

  // Platform selection pills toggle
  const platformPills = document.querySelectorAll('.platform-pill');
  platformPills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('selected');
      const platformName = pill.querySelector('.platform-pill-name').textContent;
      const isSelected = pill.classList.contains('selected');
      // Subtle visual feedback
      if (isSelected) {
        showToast('info', 'Platform Selected', `Targeting ${platformName} for distribution.`);
      }
    });
  });

  // Media preview remove simulation
  const removeMediaBtns = document.querySelectorAll('.media-remove-btn');
  removeMediaBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.media-preview-card');
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => card.remove(), 200);
        showToast('info', 'Media Removed', 'Attachment removed from composer preview.');
      }
    });
  });

  // Drag & drop zone simulation
  const dropzone = document.getElementById('composerDropzone');
  if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      showToast('success', 'File Attached Preview', 'Mock file successfully added to media preview area.');
    });
    dropzone.addEventListener('click', () => {
      showToast('info', 'File Browser Simulated', 'Opening system file selector... (Frontend Visual Demo)');
    });
  }

  // Composer Bottom Action Buttons
  const composerPublishBtn = document.getElementById('composerPublishBtn');
  const composerSaveDraftBtn = document.getElementById('composerSaveDraftBtn');
  const composerClearBtn = document.getElementById('composerClearBtn');

  if (composerPublishBtn) {
    composerPublishBtn.addEventListener('click', () => {
      openModal('modalPublishConfirm');
    });
  }

  if (composerSaveDraftBtn) {
    composerSaveDraftBtn.addEventListener('click', () => {
      showToast('success', 'Draft Saved', 'Your post has been saved to your recent drafts list.');
    });
  }

  if (composerClearBtn) {
    composerClearBtn.addEventListener('click', () => {
      openModal('modalDiscardConfirm');
    });
  }

  // --- 5. Toast Notifications System ---
  const toastContainer = document.getElementById('toastContainer');

  window.showToast = function(type, title, message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" title="Dismiss">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 20);

    // Close button click
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    });

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }
    }, 5000);
  };

  // Interactive triggers for Toast Showcase
  document.querySelectorAll('[data-trigger-toast]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-trigger-toast');
      if (type === 'success') {
        showToast('success', 'Post Published Successfully', 'Your announcement post is now live across 4 selected platforms.');
      } else if (type === 'error') {
        showToast('error', 'Publishing Failed', 'Threads API limit exceeded. Please verify video bitrate under 30MB.');
      } else if (type === 'warning') {
        showToast('warning', 'Aspect Ratio Notice', 'Instagram preview recommends 4:5 vertical crop for optimal mobile engagement.');
      } else {
        showToast('info', 'Analytics Report Ready', 'Weekly performance summary for July 2026 has been generated.');
      }
    });
  });

  // --- 6. Reusable Modal Dialog System ---
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  };

  // Close when clicking modal overlay backdrop or cancel/close buttons inside
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });

    overlay.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.classList.remove('active');
      });
    });
  });

  // ESC key closes any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => overlay.classList.remove('active'));
    }
  });

  // Interactive triggers for Modal Showcase
  document.querySelectorAll('[data-trigger-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetModal = btn.getAttribute('data-trigger-modal');
      openModal(targetModal);
    });
  });

  // Specific modal confirm actions simulation
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      closeModal('modalDeleteConfirm');
      showToast('success', 'Item Deleted', 'The selected draft has been permanently removed.');
    });
  }

  const confirmDiscardBtn = document.getElementById('confirmDiscardBtn');
  if (confirmDiscardBtn) {
    confirmDiscardBtn.addEventListener('click', () => {
      if (postTextarea) postTextarea.value = '';
      if (charCounter) charCounter.textContent = '0 / 2,200 characters';
      closeModal('modalDiscardConfirm');
      showToast('info', 'Composer Cleared', 'All draft content and attachments have been reset.');
    });
  }

  const confirmPublishBtn = document.getElementById('confirmPublishBtn');
  if (confirmPublishBtn) {
    confirmPublishBtn.addEventListener('click', () => {
      closeModal('modalPublishConfirm');
      showToast('success', 'Published to 3 Platforms', 'Post distributed to Twitter/X, LinkedIn, and Instagram.');
    });
  }

  // --- 7. Search Component Overlay Trigger ---
  const navSearchInput = document.getElementById('navSearchInput');
  const searchModalOverlay = document.getElementById('modalSearchOverlay');
  const searchModalInput = document.getElementById('searchModalInput');

  if (navSearchInput && searchModalOverlay) {
    navSearchInput.addEventListener('focus', () => {
      navSearchInput.blur();
      openModal('modalSearchOverlay');
      if (searchModalInput) {
        setTimeout(() => searchModalInput.focus(), 100);
      }
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openModal('modalSearchOverlay');
      if (searchModalInput) {
        setTimeout(() => searchModalInput.focus(), 100);
      }
    }
  });

  // Search filter typing simulation inside modal
  if (searchModalInput) {
    const resultItems = document.querySelectorAll('.search-result-item');
    searchModalInput.addEventListener('input', () => {
      const query = searchModalInput.value.toLowerCase();
      resultItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // --- 8. Login & Signup Toggle Logic ---
  const loginToggleBtn = document.getElementById('loginToggleBtn');
  const loginTitle = document.getElementById('loginTitle');
  const loginSubtitle = document.getElementById('loginSubtitle');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const loginToggleText = document.getElementById('loginToggleText');
  let isSignupMode = false;

  if (loginToggleBtn) {
    loginToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isSignupMode = !isSignupMode;

      if (isSignupMode) {
        loginTitle.textContent = 'Create an account';
        loginSubtitle.textContent = 'Join PulseFlow to manage your socials.';
        loginSubmitBtn.textContent = 'Sign Up';
        loginToggleText.innerHTML = `Already have an account? <a href="#" id="loginToggleBtn" style="color: var(--primary); font-weight: 600;">Log in</a>`;
      } else {
        loginTitle.textContent = 'Welcome back';
        loginSubtitle.textContent = 'Log in to access your PulseFlow dashboard.';
        loginSubmitBtn.textContent = 'Log In';
        loginToggleText.innerHTML = `Don't have an account? <a href="#" id="loginToggleBtn" style="color: var(--primary); font-weight: 600;">Sign up</a>`;
      }
      
      // Re-attach listener since we replaced the HTML
      document.getElementById('loginToggleBtn').addEventListener('click', arguments.callee);
    });
  }

  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener('click', () => {
      showToast('success', isSignupMode ? 'Account Created' : 'Authentication Successful', isSignupMode ? 'Welcome to PulseFlow!' : 'Welcome back to your dashboard.');
    });
  }
});
