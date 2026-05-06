<script setup>
import { computed, ref } from 'vue';

const pointer = ref({ x: 50, y: 50 });
const activeFilter = ref('All');
const activePanel = ref('Projects');
const command = ref('');
const selectedProject = ref(0);
const highContrast = ref(false);

const projects = [
  {
    title: 'Packet Garden',
    type: 'Interface',
    year: '2026',
    stack: ['Vue', 'WebGL', 'Realtime'],
    description: 'A live telemetry dashboard that turns noisy ops data into a calm, zoomable garden of signals.',
    accent: '#00f0ff'
  },
  {
    title: 'Mixtape Studio',
    type: 'Brand',
    year: '2025',
    stack: ['Design Systems', 'Motion', 'CMS'],
    description: 'A modular launch site for a music-tech studio with editorial pages and kinetic release cards.',
    accent: '#ff4fd8'
  },
  {
    title: 'Neon Ledger',
    type: 'Product',
    year: '2025',
    stack: ['Vue', 'Charts', 'UX'],
    description: 'A finance workspace that makes forecasting feel fast, tactile, and less like spreadsheet archaeology.',
    accent: '#ffd166'
  },
  {
    title: 'Pixel Courier',
    type: 'Experiment',
    year: '2024',
    stack: ['Canvas', 'AI', 'Audio'],
    description: 'A tiny browser game where messages become delivery routes through procedural city blocks.',
    accent: '#7cff6b'
  }
];

const filters = ['All', ...new Set(projects.map((project) => project.type))];
const panels = ['Projects', 'About', 'Contact'];

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return projects;
  return projects.filter((project) => project.type === activeFilter.value);
});

const featuredProject = computed(() => projects[selectedProject.value]);

const commandResponse = computed(() => {
  const value = command.value.trim().toLowerCase();
  if (!value) return 'type: hire, stack, vibe, contact';
  if (value.includes('hire')) return 'available for sharp web builds, design systems, and interactive product work';
  if (value.includes('stack')) return 'vue, motion, design systems, accessible UI, dashboards, prototypes';
  if (value.includes('vibe')) return 'sleek modern craft wearing a translucent 1997 windbreaker';
  if (value.includes('contact')) return 'hello@aidanpalmer.dev';
  return 'command not found, but the cursor respects the ambition';
});

function updatePointer(event) {
  pointer.value = {
    x: Math.round((event.clientX / window.innerWidth) * 100),
    y: Math.round((event.clientY / window.innerHeight) * 100)
  };
}
</script>

<template>
  <main
    class="site-shell"
    :class="{ 'high-contrast': highContrast }"
    :style="{ '--px': `${pointer.x}%`, '--py': `${pointer.y}%` }"
    @pointermove="updatePointer"
  >
    <div class="scanline"></div>

    <nav class="topbar" aria-label="Primary navigation">
      <a class="brand" href="#top" aria-label="Aidan Palmer home">
        <span class="brand-mark">AP</span>
        <span>Aidan Palmer</span>
      </a>

      <div class="nav-tabs" role="tablist" aria-label="Portfolio panels">
        <button
          v-for="panel in panels"
          :key="panel"
          type="button"
          :class="{ active: activePanel === panel }"
          @click="activePanel = panel"
        >
          {{ panel }}
        </button>
      </div>

      <label class="switch">
        <input v-model="highContrast" type="checkbox" />
        <span></span>
      </label>
    </nav>

    <section id="top" class="hero">
      <div class="hero-copy">
        <p class="eyebrow">portfolio.exe / now loading</p>
        <h1>Interactive product design with a dial-up soul.</h1>
        <p class="lede">
          I build sleek Vue interfaces, expressive systems, and web moments that feel precise,
          tactile, and a little impossible to forget.
        </p>
        <div class="hero-actions" aria-label="Portfolio actions">
          <a href="#work">View Work</a>
          <a href="mailto:hello@aidanpalmer.dev">Email</a>
        </div>
      </div>

      <div class="hero-stage" aria-label="Retro interactive portfolio desktop">
        <img src="/retro-hero.png" alt="Retro neon browser desktop artwork" />
        <div class="desktop-window window-a">
          <div class="chrome"><span></span><span></span><span></span></div>
          <strong>{{ featuredProject.title }}</strong>
          <small>{{ featuredProject.type }} / {{ featuredProject.year }}</small>
        </div>
        <div class="desktop-window window-b">
          <div class="meter"><i :style="{ width: `${pointer.x}%` }"></i></div>
          <span>x: {{ pointer.x }} y: {{ pointer.y }}</span>
        </div>
      </div>
    </section>

    <section id="work" class="workspace">
      <aside class="dock" aria-label="Project filters">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </aside>

      <div class="main-window">
        <header class="window-title">
          <div>
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <p>{{ activePanel.toLowerCase() }}.html</p>
          <span>100%</span>
        </header>

        <div v-if="activePanel === 'Projects'" class="project-grid">
          <article
            v-for="(project, index) in filteredProjects"
            :key="project.title"
            class="project-card"
            :class="{ selected: featuredProject.title === project.title }"
            :style="{ '--accent': project.accent }"
            @mouseenter="selectedProject = projects.findIndex((item) => item.title === project.title)"
            @focusin="selectedProject = projects.findIndex((item) => item.title === project.title)"
            tabindex="0"
          >
            <span class="project-index">0{{ index + 1 }}</span>
            <h2>{{ project.title }}</h2>
            <p>{{ project.description }}</p>
            <div class="chips">
              <span v-for="item in project.stack" :key="item">{{ item }}</span>
            </div>
          </article>
        </div>

        <div v-else-if="activePanel === 'About'" class="about-panel">
          <p>
            I work where product strategy, interface craft, and playful interaction overlap.
            The sweet spot is a serious tool that still feels alive under your hand.
          </p>
          <div class="stats">
            <span><strong>08</strong> launches</span>
            <span><strong>04</strong> systems</span>
            <span><strong>99%</strong> polish</span>
          </div>
        </div>

        <div v-else class="contact-panel">
          <a href="mailto:hello@aidanpalmer.dev">hello@aidanpalmer.dev</a>
          <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>

      <aside class="terminal">
        <header>guest@portfolio:~</header>
        <div class="terminal-body">
          <p>{{ commandResponse }}</p>
          <label>
            <span>&gt;</span>
            <input v-model="command" type="text" autocomplete="off" aria-label="Portfolio command" />
          </label>
        </div>
      </aside>
    </section>

    <footer class="statusbar">
      <div>
        <span>ready</span>
        <span>vue.js</span>
        <span>90s mode</span>
        <span>{{ new Date().getFullYear() }}</span>
      </div>
    </footer>
  </main>
</template>
