const fs = require('fs');

function replaceColors(path) {
  let content = fs.readFileSync(path, 'utf8');
  const repl = [
    // Backgrounds
    { from: /background-color:\s*white;/gi, to: 'background-color: var(--card-bg);' },
    { from: /background:\s*white;/gi, to: 'background: var(--card-bg);' },
    { from: /background-color:\s*#FFFFFF;/gi, to: 'background-color: var(--card-bg);' },
    { from: /background-color:\s*#F9FAFB;/gi, to: 'background-color: var(--hover-bg);' },
    { from: /background:\s*#F9FAFB;/gi, to: 'background: var(--hover-bg);' },
    { from: /background-color:\s*#F3F4F6;/gi, to: 'background-color: var(--hover-bg);' },
    { from: /background:\s*#F3F4F6;/gi, to: 'background: var(--hover-bg);' },
    { from: /background-color:\s*#F8FAFC;/gi, to: 'background-color: var(--hover-bg);' },
    { from: /background-color:\s*#FAFAFA;/gi, to: 'background-color: var(--hover-bg);' },
    { from: /background:\s*#E5E7EB;/gi, to: 'background: var(--active-bg);' },
    { from: /background:\s*#EFF6FF;/gi, to: 'background: var(--stat-blue-bg);' },
    { from: /background-color:\s*#E5E7EB;/gi, to: 'background-color: var(--active-bg);' },
    { from: /background-color:\s*#E0E7FF;/gi, to: 'background-color: var(--stat-purple-bg);' },
    { from: /background-color:\s*#EFF6FF;/gi, to: 'background-color: var(--stat-blue-bg);' },
    { from: /background:\s*#DBEAFE;/gi, to: 'background: var(--stat-blue-bg);' },
    { from: /background-color:\s*#FEF2F2;/gi, to: 'background-color: var(--stat-red-bg);' },
    { from: /background:\s*#FEF2F2;/gi, to: 'background: var(--stat-red-bg);' },
    { from: /background-color:\s*#FEE2E2;/gi, to: 'background-color: var(--stat-red-bg);' },
    { from: /background-color:\s*#FFEDD5;/gi, to: 'background-color: var(--stat-orange-bg);' },
    { from: /background-color:\s*#DCFCE7;/gi, to: 'background-color: var(--stat-green-bg);' },
    { from: /background-color:\s*#10B981;/gi, to: 'background-color: var(--stat-green-text);' },

    // Borders
    { from: /border:\s*1px solid #F3F4F6;/gi, to: 'border: 1px solid var(--border-light);' },
    { from: /border:\s*1px solid #E5E7EB;/gi, to: 'border: 1px solid var(--border-light);' },
    { from: /border:\s*1px solid #BFDBFE;/gi, to: 'border: 1px solid var(--primary);' },
    { from: /border-bottom:\s*1px solid #F3F4F6;/gi, to: 'border-bottom: 1px solid var(--border-light);' },
    { from: /border-top:\s*1px solid #F3F4F6;/gi, to: 'border-top: 1px solid var(--border-light);' },
    { from: /border-top:\s*1px solid #E5E7EB;/gi, to: 'border-top: 1px solid var(--border-light);' },
    { from: /border-color:\s*#3B82F6;/gi, to: 'border-color: var(--primary);' },
    { from: /border-color:\s*#BFDBFE;/gi, to: 'border-color: var(--primary);' },
    { from: /border-color:\s*#E5E7EB;/gi, to: 'border-color: var(--border-light);' },
    { from: /border-color:\s*#D1D5DB;/gi, to: 'border-color: var(--border-light);' },
    { from: /border-color:\s*#93C5FD;/gi, to: 'border-color: var(--primary);' },

    // Text colors
    { from: /color:\s*#1F2937;/gi, to: 'color: var(--text-dark);' },
    { from: /color:\s*#111827;/gi, to: 'color: var(--text-dark);' },
    { from: /color:\s*#374151;/gi, to: 'color: var(--text-dark);' },
    { from: /color:\s*#4B5563;/gi, to: 'color: var(--text-muted);' },
    { from: /color:\s*#6B7280;/gi, to: 'color: var(--text-muted);' },
    { from: /color:\s*#9CA3AF;/gi, to: 'color: var(--text-muted);' },
    { from: /color:\s*#475569;/gi, to: 'color: var(--text-muted);' },
    { from: /color:\s*#94A3B8;/gi, to: 'color: var(--text-muted);' },
    { from: /color:\s*#CBD5E1;/gi, to: 'color: var(--text-muted);' },
    { from: /color:\s*#3B82F6;/gi, to: 'color: var(--primary);' },
    { from: /color:\s*#4F46E5;/gi, to: 'color: var(--primary);' },
    { from: /color:\s*#DC2626;/gi, to: 'color: var(--danger-text);' },
    { from: /color:\s*#EF4444;/gi, to: 'color: var(--stat-red-text);' },
    { from: /color:\s*#F87171;/gi, to: 'color: var(--stat-red-text);' },
    { from: /color:\s*#EA580C;/gi, to: 'color: var(--stat-orange-text);' },
    { from: /color:\s*#16A34A;/gi, to: 'color: var(--stat-green-text);' },
    { from: /color:\s*#10B981;/gi, to: 'color: var(--stat-green-text);' },
    { from: /color:\s*#B45309;/gi, to: 'color: var(--stat-yellow-text);' },
    { from: /color:\s*#D97706;/gi, to: 'color: var(--stat-yellow-text);' },

    // Stroke
    { from: /stroke:\s*#D1D5DB;/gi, to: 'stroke: var(--text-muted);' },
    { from: /stroke:\s*#10B981;/gi, to: 'stroke: var(--stat-green-text);' },

    // LanguageSwitcher fallbacks
    { from: /background-color:\s*#F3F4F6;/gi, to: 'background-color: var(--hover-bg);' },
    { from: /background-color:\s*#EFF6FF;/gi, to: 'background-color: var(--stat-blue-bg);' },
  ];

  for (const r of repl) {
    content = content.replace(r.from, r.to);
  }

  // Fix LanguageSwitcher fallback patterns
  content = content.replace(/var\(--bg-white, #FFFFFF\)/gi, 'var(--card-bg)');
  content = content.replace(/var\(--border-light, #E5E7EB\)/gi, 'var(--border-light)');
  content = content.replace(/var\(--text-dark, #1F2937\)/gi, 'var(--text-dark)');
  content = content.replace(/var\(--text-muted, #6B7280\)/gi, 'var(--text-muted)');
  content = content.replace(/var\(--primary, #3B82F6\)/gi, 'var(--primary)');

  // SkeletonLoader
  content = content.replace(/background-color:\s*#E5E7EB;\s*\/\*\s*tailwind gray-200\s*\*\//gi, 'background-color: var(--active-bg); /* adapts to theme */');

  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed: ' + path);
}

replaceColors('client/src/components/NewTaskModal.vue');
replaceColors('client/src/components/LogoutConfirmation.vue');
replaceColors('client/src/components/common/LanguageSwitcher.vue');
replaceColors('client/src/components/common/SkeletonLoader.vue');

console.log('All component colors fixed');
