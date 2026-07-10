<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
})
</script>
<template>
  <div class="landing-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <div class="logo-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="logo-icon"><circle cx="12" cy="12" r="10"></circle><path d="M8 15V9l4 4 4-4v6"></path></svg>
          </div>
          <span class="logo-text">MyTodo</span>
        </div>
        
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
        </div>

        <div class="nav-actions">
          <router-link to="/login" class="login-btn">Log in</router-link>
          <router-link to="/register" class="btn-primary-nav">Get Started Free</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero animate-on-scroll">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Organize your tasks.<br/><span class="text-blue">Achieve more</span> every day.</h1>
          <p class="hero-subtitle">MyTodo helps you stay focused, manage your tasks and get things done—simply and beautifully.</p>
          
          <div class="hero-buttons">
            <router-link to="/register" class="btn-primary-large">
              Get Started Free 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </router-link>
            <button class="btn-secondary-large">
              Watch Demo
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
            </button>
          </div>

          <div class="hero-features">
            <div class="hero-feature">
              <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>Free to get started</span>
            </div>
            <div class="hero-feature">
              <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>No credit card required</span>
            </div>
            <div class="hero-feature">
              <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>Works on all devices</span>
            </div>
          </div>
        </div>

        <div class="hero-image">
          <div class="dashboard-mockup">
            <div class="mockup-sidebar">
              <div class="mockup-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"></circle><path d="M8 15V9l4 4 4-4v6"></path></svg>
                <span style="font-weight:700; color:#1E3A8A; font-size:14px;">MyTodo</span>
              </div>
              <div class="mockup-nav-item active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Dashboard</div>
              <div class="mockup-nav-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> My Tasks</div>
              <div class="mockup-nav-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Calendar</div>
              <div class="mockup-nav-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> Reports</div>
              <div class="mockup-nav-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> Settings</div>
            </div>
            <div class="mockup-main">
              <div class="mockup-header">
                <div class="mockup-menu-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></div>
                <div class="mockup-profile">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  <div class="mockup-avatar"></div>
                  <span style="font-size: 11px; font-weight: 500; color: #374151;">Qaal Tewfa</span>
                </div>
              </div>
              <div class="mockup-content">
                <h3 style="margin:0 0 4px 0; font-size:16px; font-weight:600;">Dashboard</h3>
                <p style="margin:0 0 16px 0; font-size:10px; color:#6B7280;">Welcome back, Qaal Tewfa! Here's your overview.</p>
                <div class="mockup-stats">
                  <div class="mockup-stat">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                      <div class="stat-icon blue"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg></div>
                      <span style="font-size:9px; color:#6B7280;">Total Tasks</span>
                    </div>
                    <div style="font-size:18px; font-weight:700;">12</div>
                  </div>
                  <div class="mockup-stat">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                      <div class="stat-icon green"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
                      <span style="font-size:9px; color:#6B7280;">Completed</span>
                    </div>
                    <div style="font-size:18px; font-weight:700; color:#10B981;">5</div>
                  </div>
                  <div class="mockup-stat">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                      <div class="stat-icon orange"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                      <span style="font-size:9px; color:#6B7280;">Pending</span>
                    </div>
                    <div style="font-size:18px; font-weight:700; color:#F59E0B;">7</div>
                  </div>
                  <div class="mockup-stat">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                      <div class="stat-icon yellow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg></div>
                      <span style="font-size:9px; color:#6B7280;">Completion rate</span>
                    </div>
                    <div style="font-size:18px; font-weight:700;">62%</div>
                  </div>
                </div>
                <div class="mockup-bottom-grid">
                  <div class="mockup-chart-card">
                    <h4 style="margin:0 0 12px 0; font-size:11px; font-weight:600;">Tasks by Priority</h4>
                    <div class="mockup-chart">
                      <div class="mockup-donut">
                        <div class="donut-inner"><span style="font-size:12px; font-weight:700;">12</span><span style="font-size:8px; color:#6B7280;">Total</span></div>
                      </div>
                      <div class="mockup-legend">
                        <div class="legend-item"><span style="font-size:9px; color:#6B7280;">High</span><div style="font-size:10px; font-weight:700; color:#EF4444;">4</div></div>
                        <div class="legend-item"><span style="font-size:9px; color:#6B7280;">Medium</span><div style="font-size:10px; font-weight:700; color:#F59E0B;">5</div></div>
                        <div class="legend-item"><span style="font-size:9px; color:#6B7280;">Low</span><div style="font-size:10px; font-weight:700; color:#10B981;">3</div></div>
                      </div>
                    </div>
                  </div>
                  <div class="mockup-recent-card">
                    <h4 style="margin:0 0 12px 0; font-size:11px; font-weight:600;">Recent Tasks</h4>
                    <div class="mockup-task-list">
                      <div class="mockup-task-item">
                        <div class="task-icon blue"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                        <div class="task-details">
                          <div style="font-size:10px; font-weight:600;">Design new landing page</div>
                          <div style="font-size:8px; color:#6B7280;">Web Design</div>
                        </div>
                        <div style="font-size:9px; color:#6B7280;">Today</div>
                      </div>
                      <div class="mockup-task-item">
                        <div class="task-icon pink"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                        <div class="task-details">
                          <div style="font-size:10px; font-weight:600;">Develop authentication flow</div>
                          <div style="font-size:8px; color:#6B7280;">Development</div>
                        </div>
                        <div style="font-size:9px; color:#6B7280;">Tomorrow</div>
                      </div>
                      <div class="mockup-task-item">
                        <div class="task-icon blue-solid"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
                        <div class="task-details">
                          <div style="font-size:10px; font-weight:600; text-decoration:line-through; color:#9CA3AF;">Fix dashboard bugs</div>
                          <div style="font-size:8px; color:#9CA3AF;">Bug fixes</div>
                        </div>
                        <div style="font-size:9px; color:#9CA3AF;">May 24</div>
                      </div>
                    </div>
                    <div style="text-align:right; margin-top:8px;">
                      <a href="#" style="font-size:9px; color:#6B7280; text-decoration:none;">View all tasks →</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Decorative arrow -->
          <svg class="decorative-arrow" width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M80,20 Q10,20 20,80 Q25,95 40,85"></path>
            <polyline points="30,80 40,85 35,95"></polyline>
          </svg>
        </div>
      </div>
    </header>

    <!-- Trusted By -->
    <section class="trusted-by">
      <p>Trusted by thousands of productive teams and individuals</p>
      <div class="logos">
        <div class="company-logo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg> slack</div>
        <div class="company-logo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="9" y2="15"></line><line x1="15" y1="9" x2="15" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg> Notion</div>
        <div class="company-logo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> Microsoft</div>
        <div class="company-logo" style="font-weight: 500;">Google</div>
        <div class="company-logo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"></path></svg> airbnb</div>
        <div class="company-logo" style="font-weight: 700;">stripe</div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="features-section animate-on-scroll">
      <div class="section-tag">FEATURES</div>
      <h2 class="section-title">Everything you need to<br/>stay <span class="text-blue">organized</span></h2>
      <p class="section-subtitle">Powerful features to help you plan, focus, and get more done.</p>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon-box bg-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3>Smart Task Management</h3>
          <p>Create, organize, and prioritize tasks with ease. Stay on top of what matters most.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box bg-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h3>Track Progress</h3>
          <p>Visualize your progress and stay motivated with beautiful charts and insights.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box bg-purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
          <h3>Stay Reminded</h3>
          <p>Never miss a deadline with smart reminders and notifications.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon-box bg-orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3>Access Anywhere</h3>
          <p>Use MyTodo on any device. Your tasks sync everywhere, anytime.</p>
        </div>
      </div>
      
      <div class="explore-actions">
        <button class="btn-secondary-outline">Explore All Features <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></button>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="how-it-works animate-on-scroll">
      <div class="section-tag">HOW IT WORKS</div>
      <h2 class="section-title">Get started in <span class="text-blue">3 simple steps</span></h2>
      <p class="section-subtitle">Start being more productive in minutes.</p>

      <div class="steps-container">
        <div class="step-connector"></div>
        <div class="step">
          <div class="step-number bg-blue-light text-blue">1</div>
          <div class="step-icon-wrapper bg-blue-faded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <h3>Create your tasks</h3>
          <p>Add tasks in seconds and organize them your way.</p>
        </div>
        
        <div class="step">
          <div class="step-number bg-green-light text-green">2</div>
          <div class="step-icon-wrapper bg-green-faded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </div>
          <h3>Prioritize & organize</h3>
          <p>Set priorities, due dates, and categories to stay focused.</p>
        </div>
        
        <div class="step">
          <div class="step-number bg-purple-light text-purple">3</div>
          <div class="step-icon-wrapper bg-purple-faded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3>Get things done</h3>
          <p>Track progress and complete tasks with satisfaction.</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="pricing-section animate-on-scroll">
      <div class="pricing-header">
        <h2 class="section-title">Simple, transparent pricing</h2>
        <p class="section-subtitle">Choose the perfect plan for your needs. Always know what you'll pay.</p>
      </div>
      
      <div class="pricing-cards">
        <!-- Basic -->
        <div class="pricing-card">
          <div class="pricing-card-header">
            <h3>Starter</h3>
            <div class="price"><span>$0</span>/mo</div>
            <p>Perfect for individuals starting out</p>
          </div>
          <ul class="pricing-features">
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Up to 50 tasks</li>
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Basic reporting</li>
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Community support</li>
          </ul>
          <button class="btn btn-outline btn-full">Get Started</button>
        </div>

        <!-- Pro -->
        <div class="pricing-card popular">
          <div class="popular-badge">Most Popular</div>
          <div class="pricing-card-header">
            <h3>Professional</h3>
            <div class="price"><span>$9</span>/mo</div>
            <p>For power users who need more</p>
          </div>
          <ul class="pricing-features">
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Unlimited tasks</li>
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Advanced analytics</li>
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Priority support</li>
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Custom categories</li>
          </ul>
          <button class="btn btn-primary btn-full">Start Free Trial</button>
        </div>

        <!-- Team -->
        <div class="pricing-card">
          <div class="pricing-card-header">
            <h3>Team</h3>
            <div class="price"><span>$29</span>/mo</div>
            <p>For teams that need to collaborate</p>
          </div>
          <ul class="pricing-features">
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Everything in Professional</li>
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Team sharing & workspaces</li>
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>Admin controls</li>
            <li><svg class="check-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>SSO & advanced security</li>
          </ul>
          <button class="btn btn-outline btn-full">Contact Sales</button>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="testimonials animate-on-scroll">
      <div class="section-tag">TESTIMONIALS</div>
      <h2 class="section-title">Loved by <span class="text-blue">productive people</span></h2>
      <p class="section-subtitle">See what our users have to say about MyTodo.</p>

      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="stars">
            <svg v-for="n in 5" :key="n" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <p class="quote">"MyTodo has completely changed the way I manage my work. It's simple, beautiful, and incredibly powerful."</p>
          <div class="author">
            <div class="avatar-small bg-blue-light text-blue">SJ</div>
            <div class="author-info">
              <strong>Sarah Johnson</strong>
              <span>Product Designer</span>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="stars">
            <svg v-for="n in 5" :key="n" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <p class="quote">"Finally, a task manager that's clean and easy to use. It helps me stay focused and get more done daily."</p>
          <div class="author">
            <div class="avatar-small bg-green-light text-green">MC</div>
            <div class="author-info">
              <strong>Michael Chen</strong>
              <span>Software Engineer</span>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="stars">
            <svg v-for="n in 5" :key="n" width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <p class="quote">"The reports and insights help our team stay aligned and productive. Highly recommended!"</p>
          <div class="author">
            <div class="avatar-small bg-purple-light text-purple">ED</div>
            <div class="author-info">
              <strong>Emily Davis</strong>
              <span>Project Manager</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="pagination-dots">
        <div class="dot"></div>
        <div class="dot active"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="faq-section animate-on-scroll">
      <div class="faq-header">
        <h2 class="section-title">Frequently asked questions</h2>
        <p class="section-subtitle">Everything you need to know about the product and billing.</p>
      </div>

      <div class="faq-grid">
        <div class="faq-item">
          <h4>Is there a free trial available?</h4>
          <p>Yes, you can try our Professional plan for free for 14 days. No credit card required. You can downgrade to the free Starter plan at any time.</p>
        </div>
        <div class="faq-item">
          <h4>Can I change my plan later?</h4>
          <p>Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your account settings.</p>
        </div>
        <div class="faq-item">
          <h4>What happens to my data if I cancel?</h4>
          <p>Your data is yours. If you decide to cancel, you can export all your tasks and reports before your account is closed.</p>
        </div>
        <div class="faq-item">
          <h4>Do you offer discounts for non-profits?</h4>
          <p>Yes! We offer a 50% discount for qualified non-profit organizations and educational institutions. Please contact our support team to apply.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section animate-on-scroll">
      <div class="cta-container">
        <div class="cta-content">
          <h2>Ready to boost your productivity?</h2>
          <p>Join thousands of users who are getting things done with MyTodo.</p>
        </div>
        <div class="cta-buttons">
          <router-link to="/register" class="btn-primary-large bg-white text-blue" style="color: #3B82F6;">Get Started Free</router-link>
          <button class="btn-secondary-large border-white text-white">Talk to Sales</button>
        </div>
        <div class="cta-decorations">
          <div class="dec-dot" style="top: 20px; left: 20px;"></div>
          <div class="dec-dot" style="top: 40px; left: 40px;"></div>
          <div class="dec-dot" style="top: 20px; left: 60px;"></div>
          <!-- More dots can go here -->
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <div class="logo">
            <div class="logo-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="logo-icon"><circle cx="12" cy="12" r="10"></circle><path d="M8 15V9l4 4 4-4v6"></path></svg>
            </div>
            <span class="logo-text">MyTodo</span>
          </div>
          <p>The simple yet powerful to-do list app to help you stay organized and achieve more every day.</p>
          <div class="social-links">
            <a href="#" class="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
            <a href="#" class="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
            <a href="#" class="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
          </div>
        </div>
        
        <div class="footer-links">
          <h4>Product</h4>
          <a href="#">Features</a>
          <a href="#">How It Works</a>
          <a href="#">Pricing</a>
          <a href="#">Updates</a>
        </div>
        
        <div class="footer-links">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </div>
        
        <div class="footer-links">
          <h4>Resources</h4>
          <a href="#">Help Center</a>
          <a href="#">Guides</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        
        <div class="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Stay updated with productivity tips and product updates.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2024 MyTodo. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing-page {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #1F2937;
  background-color: #FFFFFF;
  overflow-x: hidden;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Utilities */
.text-blue { color: #3B82F6; }
.text-green { color: #10B981; }
.text-purple { color: #8B5CF6; }

.bg-blue { background-color: #3B82F6; }
.bg-green { background-color: #10B981; }
.bg-purple { background-color: #8B5CF6; }
.bg-orange { background-color: #F97316; }

.bg-blue-light { background-color: #DBEAFE; }
.bg-green-light { background-color: #D1FAE5; }
.bg-purple-light { background-color: #EDE9FE; }

.bg-blue-faded { background-color: #EFF6FF; }
.bg-green-faded { background-color: #ECFDF5; }
.bg-purple-faded { background-color: #F5F3FF; }

/* Navbar */
.navbar {
  padding: 20px 0;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 1000;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-icon-wrap {
  width: 32px;
  height: 32px;
  color: #3B82F6;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1E3A8A;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  text-decoration: none;
  color: #4B5563;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #111827;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.login-btn {
  text-decoration: none;
  color: #1F2937;
  font-weight: 600;
  font-size: 14px;
}

.btn-primary-nav {
  background-color: #3B82F6;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary-nav:hover {
  background-color: #2563EB;
}

/* Hero Section */
.hero {
  padding: 160px 0 100px;
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.05), transparent 50%);
}

.hero-container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.hero-content {
  max-width: 500px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  color: #111827;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 18px;
  color: #4B5563;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.btn-primary-large {
  background-color: #3B82F6;
  color: white;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary-large:hover {
  background-color: #2563EB;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary-large {
  background-color: white;
  color: #1F2937;
  border: 1px solid #E5E7EB;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary-large:hover {
  background-color: #F9FAFB;
}

.hero-features {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.hero-feature {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #3B82F6;
}

/* Dashboard Mockup */
.hero-image {
  position: relative;
  max-width: 1440px;
  width: 100%;
}

.dashboard-mockup {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  height: 420px;
  overflow: hidden;
  border: 1px solid #F3F4F6;
  position: relative;
  z-index: 2;
}

.mockup-sidebar {
  width: 160px;
  background-color: white;
  border-right: 1px solid #F3F4F6;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mockup-logo {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
  padding-left: 8px;
}

.mockup-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #6B7280;
  font-weight: 500;
}

.mockup-nav-item.active {
  background-color: #EFF6FF;
  color: #3B82F6;
  font-weight: 600;
}

.mockup-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #F9FAFB;
}

.mockup-header {
  height: 48px;
  background-color: white;
  border-bottom: 1px solid #F3F4F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.mockup-menu-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mockup-profile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mockup-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #3B82F6;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
}

.mockup-content {
  padding: 16px;
  flex-grow: 1;
}

.mockup-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.mockup-stat {
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #F3F4F6;
}

.stat-icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon.blue { background-color: #DBEAFE; color: #3B82F6; }
.stat-icon.green { background-color: #D1FAE5; color: #10B981; }
.stat-icon.orange { background-color: #FEF3C7; color: #F59E0B; }
.stat-icon.yellow { background-color: #FEF08A; color: #CA8A04; }

.mockup-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 12px;
}

.mockup-chart-card, .mockup-recent-card {
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #F3F4F6;
  height: 180px;
}

.mockup-chart {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 120px;
}

.mockup-donut {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: conic-gradient(#EF4444 0% 33%, #F59E0B 33% 75%, #10B981 75% 100%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.donut-inner {
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mockup-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  flex-direction: column;
}

.mockup-task-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
}
.mockup-task-item:last-child {
  border-bottom: none;
}

.task-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}
.task-icon.blue { color: #3B82F6; background-color: #DBEAFE; }
.task-icon.pink { color: #EC4899; background-color: #FCE7F3; }
.task-icon.blue-solid { color: white; background-color: #3B82F6; }

.task-details {
  flex-grow: 1;
}

.decorative-arrow {
  position: absolute;
  bottom: -40px;
  left: -40px;
  z-index: 1;
}

/* Trusted By */
.trusted-by {
  padding: 40px 0 80px;
  text-align: center;
  background-color: #FFFFFF;
}

.trusted-by p {
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
}

.logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  flex-wrap: wrap;
}

.company-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #6B7280;
  opacity: 0.8;
  filter: grayscale(100%);
  transition: all 0.3s;
}

.company-logo:hover {
  opacity: 1;
  filter: grayscale(0%);
}

/* Sections Common */
.section-tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: #EFF6FF;
  color: #3B82F6;
  font-size: 12px;
  font-weight: 700;
  border-radius: 99px;
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 16px;
  color: #6B7280;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Features */
.features-section {
  padding: 100px 48px;
  text-align: center;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.feature-card {
  padding: 32px 24px;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
}

.feature-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 24px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
}

.feature-card p {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
}

.btn-secondary-outline {
  background: transparent;
  border: 1px solid #E5E7EB;
  color: #1F2937;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary-outline:hover {
  background-color: #F9FAFB;
}

/* How It Works */
.how-it-works {
  padding: 100px 48px;
  text-align: center;
  background-color: #F9FAFB;
}

.steps-container {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  position: relative;
}

.step-connector {
  position: absolute;
  top: 64px;
  left: 15%;
  right: 15%;
  height: 2px;
  background-image: linear-gradient(to right, #D1D5DB 50%, transparent 50%);
  background-size: 12px 2px;
  background-repeat: repeat-x;
  z-index: 1;
}

.step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
}

.step-icon-wrapper {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.step h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
}

.step p {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
}

/* Pricing Section */
.pricing-section {
  padding: 100px 48px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.pricing-header {
  text-align: center;
  margin-bottom: 60px;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  align-items: center;
}

.pricing-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 40px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.pricing-card.popular {
  border: 2px solid #3B82F6;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
  z-index: 10;
}

.pricing-card.popular:hover {
  transform: scale(1.05) translateY(-5px);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #3B82F6;
  color: white;
  padding: 4px 16px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pricing-card-header {
  margin-bottom: 32px;
}

.pricing-card-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 16px;
}

.price {
  font-size: 16px;
  color: #6B7280;
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
}

.price span {
  font-size: 48px;
  font-weight: 800;
  color: #1F2937;
  line-height: 1;
  margin-right: 4px;
}

.pricing-card-header p {
  color: #6B7280;
  font-size: 14px;
  margin: 0;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #4B5563;
}

.pricing-features .check-icon {
  width: 20px;
  height: 20px;
  color: #3B82F6;
  flex-shrink: 0;
}

/* Testimonials */
.testimonials {
  padding: 100px 48px;
  text-align: center;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.testimonial-card {
  padding: 32px;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  text-align: left;
  background-color: white;
}

.stars {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.quote {
  font-size: 15px;
  color: #4B5563;
  line-height: 1.6;
  margin-bottom: 24px;
  font-style: italic;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-info strong {
  font-size: 14px;
  color: #111827;
}

.author-info span {
  font-size: 12px;
  color: #6B7280;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #D1D5DB;
  cursor: pointer;
}

.dot.active {
  background-color: #3B82F6;
}

/* FAQ Section */
.faq-section {
  padding: 100px 48px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  background-color: #F9FAFB;
}

.faq-header {
  text-align: center;
  margin-bottom: 60px;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}

.faq-item h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 0 0 12px;
}

.faq-item p {
  color: #4B5563;
  line-height: 1.6;
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: 80px 48px 100px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.cta-container {
  background: linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%);
  border-radius: 24px;
  padding: 60px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-content {
  max-width: 500px;
  position: relative;
  z-index: 2;
}

.cta-content h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
}

.cta-content p {
  font-size: 16px;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  position: relative;
  z-index: 2;
}

.bg-white { background-color: white !important; }
.border-white { border-color: rgba(255,255,255,0.3) !important; background: transparent !important; }

/* Footer */
.footer {
  border-top: 1px solid #E5E7EB;
  padding: 80px 48px 40px;
  background-color: #FFFFFF;
}

.footer-container {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 40px;
  margin-bottom: 60px;
}

.footer-brand p {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
  margin: 16px 0;
  max-width: 250px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4B5563;
  transition: all 0.2s;
}

.social-icon:hover {
  background-color: #E5E7EB;
  color: #111827;
}

.footer-links h4, .footer-newsletter h4 {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
}

.footer-links a {
  display: block;
  font-size: 14px;
  color: #6B7280;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #111827;
}

.footer-newsletter p {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
}

.newsletter-form input {
  flex-grow: 1;
  padding: 10px 16px;
  border: 1px solid #E5E7EB;
  border-right: none;
  border-radius: 8px 0 0 8px;
  font-size: 14px;
  outline: none;
}

.newsletter-form button {
  background-color: #3B82F6;
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.footer-bottom {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #E5E7EB;
  font-size: 14px;
  color: #9CA3AF;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-content {
    margin: 0 auto;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-features {
    justify-content: center;
  }
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .steps-container {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  .step-connector {
    display: none;
  }
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  .cta-container {
    flex-direction: column;
    text-align: center;
    gap: 32px;
  }
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .nav-container,
  .hero-container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .hero {
    padding: 120px 0 60px;
  }
  
  .hero-title {
    font-size: 32px;
  }

  .section-title {
    font-size: 28px;
  }
  
  .hero-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .hero-buttons .btn {
    width: 100%;
    text-align: center;
  }

  .features-section,
  .how-it-works,
  .pricing-section,
  .testimonials,
  .faq-section {
    padding: 60px 20px;
  }
  
  .cta-section {
    padding: 40px 20px 60px;
  }

  .footer {
    padding: 60px 20px 40px;
  }

  .features-grid,
  .pricing-cards,
  .faq-grid,
  .footer-container {
    grid-template-columns: 1fr;
  }
  
  .price span {
    font-size: 40px;
  }
}

/* Scroll Animations */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.animate-in {
  opacity: 1;
  transform: translateY(0);
}
</style>
