<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import Button from "primevue/button";
import Card from "primevue/card";
import Chip from "primevue/chip";
import InputText from "primevue/inputtext";
import SelectButton from "primevue/selectbutton";
import { emptySpotifyTrack, getNowPlaying } from "./lib/spotify";
import {
  AtSign,
  BookOpen,
  Box,
  BriefcaseBusiness,
  Disc3,
  ExternalLink,
  Gamepad2,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  X,
} from "lucide-vue-next";

const activeSection = ref("Past Projects");
const command = ref("");
const revealed = ref([]);
const selectedModel = ref(null);
const selectedModelView = ref(0);
const activeDesktopWindow = ref(null);
const spotifyTrack = ref({ ...emptySpotifyTrack });
let spotifyTimer;

const currentVibeTrack = {
  connected: true,
  isPlaying: false,
  isVibe: true,
  title: "Midnight Sun - Super Loud",
  artist: "Zara Larsson",
  album: "Midnight Sun (+ more)",
  albumArt: "https://i.scdn.co/image/ab67616d0000b273ee8c1079ecfcf30f6836b9f7",
  spotifyUrl: "https://open.spotify.com/track/69psOP7O7y7QOV0dVisyNk",
};

const displayedSpotifyTrack = computed(() => {
  const track = spotifyTrack.value;
  const hasLiveTrack =
    track.connected &&
    track.title !== "Nothing playing right now" &&
    track.title !== emptySpotifyTrack.title &&
    (track.spotifyUrl || track.albumArt || track.isPlaying);

  return hasLiveTrack ? { ...track, isVibe: false } : currentVibeTrack;
});

const sections = ["Past Projects", "3D Modeling", "Education", "Bio"];
const sectionTargets = {
  "Past Projects": "projects",
  "3D Modeling": "modeling",
  Education: "education",
  Bio: "bio",
};

const tickerOptions = [
  "im cool I promise, just look at my projects",
  "product engineering is the goalll",
  "im also proficient in system design, ask me about my backend work",
];

const tickerMessage =
  tickerOptions[Math.floor(Math.random() * tickerOptions.length)];
const tickerBinary = tickerMessage
  .split("")
  .map((character) => character.charCodeAt(0).toString(2).padStart(8, "0"))
  .join(" ");

const projects = [
  {
    title: "Yale Butteries",
    role: "Project Lead",
    year: "2023 - 2025",
    description:
      "Led a team of four developers building a full-stack order-ahead mobile app for 14 student-run Yale restaurants. Built custom REST API, Redux store, integrated payment system underneath a React Native interface.",
    tools: ["React Native", "Redux", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    title: "Universal Studios Roblox",
    role: "Game Engineer",
    year: "2020 - 2024",
    description:
      "Contributed game assets and programmed in-game experiences for Universal Studios Roblox, supporting monetized gameplay and helping the experience reach 120M+ player visits.",
    tools: ["Roblox Studio", "TypeScript", "Blender", "Game Design"],
    url: "https://www.roblox.com/games/523707617/Universal-Roblox-Theme-Park",
  },
  {
    title: "Intelligent Music Discovery Engine",
    role: "Full-Stack ML Project",
    repo: "contemporary-songs",
    year: "2024",
    description:
      "Built a Spotify-powered recommendation service that maps legacy playlists to contemporary tracks using audio features and low-latency k-nearest-neighbor retrieval.",
    tools: ["Flask", "NumPy", "Scikit-learn", "Spotify API"],
    url: "https://github.com/apalmm/contemporary-songs",
  },
  {
    title: "Neural Signal Analysis App",
    role: "Research Programming",
    year: "2025",
    description:
      "Processed 1024+ EEG channels with MNE-Python and built internal tooling for cortical speech prosthetics research at the Rockefeller Neuroscience Institute.",
    tools: ["Python", "MNE", "Deep Learning", "Signal Analysis"],
  },
  {
    title: "Interactive Behavioral Experiments",
    role: "Yale Programmer",
    year: "2024 - 2025",
    description:
      "Built 10+ behavioral experiments for the Levy Neuroscience Decision Lab, pairing PsychoPy, React, JATOS deployment, and research data pipelines.",
    tools: ["PsychoPy", "React", "JATOS", "Data Pipelines"],
  },
  {
    title: "R Dependency Visualizer",
    repo: "manage-deps",
    role: "Open Source Tool",
    year: "2025 - 2026",
    description:
      "Built a tool for visualizing and managing R package dependencies at the function-level, combining Python, R, and JavaScript to make package relationships easier to inspect.",
    tools: ["Python", "R", "JavaScript", "Dependency Graphs"],
    url: "https://github.com/apalmm/manage-deps",
  },
  {
    title: "Terrain Fence Builder",
    repo: "fence-plugin",
    role: "Lua Plugin",
    year: "2023",
    description:
      "Created a custom Lua plugin for modeling fences across different terrain types, focused on fast environment-building workflows.",
    tools: ["Lua", "Terrain Tools", "Plugin Development"],
    url: "https://github.com/apalmm/fence-plugin",
  },
];

const degrees = [
  {
    title: "B.S. Cognitive Science",
    detail: "Yale University",
    date: "December 2025",
  },
  {
    title: "B.A. Computer Science",
    detail: "Yale University",
    date: "December 2025",
  },
];

const desktopApps = [
  {
    id: "hobbies",
    label: "Hobbies",
    icon: Gamepad2,
  },
  {
    id: "spotify",
    label: "Now Playing",
    icon: Disc3,
  },
  {
    id: "contact",
    label: "Contact Card",
    icon: Mail,
  },
];

const desktopWindowTitles = {
  hobbies: "after_hours.txt",
  spotify: "spotify.signal",
  contact: "contact.card",
};

const hobbies = [
  {
    name: "Roblox",
    detail: "Worldbuilding, game systems, and low-poly environment work.",
    links: [
      {
        label: "@apalmmmmm",
        href: "https://www.roblox.com/users/35267779/profile",
      },
    ],
  },
  {
    name: "Drawing",
    detail: "Sketches, studies, concept art, and visual experiments.",
    links: [{ label: "Add drawing archive", href: "" }],
  },
  {
    name: "Coffee",
    detail: "Favorite cafes, beans, rituals, and productive corners.",
    links: [{ label: "Add coffee notes", href: "" }],
  },
  {
    name: "Singing",
    detail: "A place for recordings, performances, or favorite repertoire.",
    links: [{ label: "Add singing clips", href: "" }],
  },
];

const modelingPieces = [
  {
    title: "Not enough space",
    note: "Blender",
    image: "/modeling/week14_5.png",
    webp: "/modeling/week14_5.webp",
    alt: "Low-poly cyber sleep lab scene with server racks, bed, backpack, and glowing overhead light in a dark field.",
    views: [
      {
        label: "front view",
        image: "/modeling/week14_5.png",
        webp: "/modeling/week14_5.webp",
      },
      {
        label: "wide view",
        image: "/modeling/week14_6.png",
        webp: "/modeling/week14_6.webp",
      },
    ],
    palette: ["#74d8f6", "#fa5aa8", "#101827"],
    featured: true,
  },
  {
    title: "Great Hall Interior",
    note: "The great hall, but make it low-poly. Focused on scale, mood, and triangle count.",
    image: "/modeling/blue.png",
    webp: "/modeling/blue.webp",
    alt: "Low-poly great hall interior with tall windows, hanging candles, warm wall lighting, and long banquet tables.",
    palette: ["#2b2455", "#d88734", "#111423"],
  },
  {
    title: "Campus Walkway",
    note: "An outdoor space with an emphasis on reusable assets and contrasting elements / textures.",
    image: "/modeling/green.png",
    webp: "/modeling/green.webp",
    alt: "Low-poly campus walkway with stylized trees, string lights, benches, and warm cobblestone path.",
    palette: ["#6bc04c", "#f2c13f", "#5eb6c4"],
  },
  {
    title: "The Slums",
    note: "A sunset urban scene with warm color grading also with a focus on contrasting materials and shapes.",
    image: "/modeling/orange.png",
    webp: "/modeling/orange.webp",
    alt: "Low-poly sunset urban rooftop scene with chain-link fence, glowing sign, and warm orange lighting.",
    palette: ["#ff7b24", "#f6c06b", "#6d3323"],
  },
  {
    title: "Hotel Lobby",
    note: "A moody interior lighting study with strong symmetry and stylized set dressing. Evil lair.",
    image: "/modeling/red.png",
    webp: "/modeling/red.webp",
    alt: "Low-poly red hotel lobby with glowing elevators, lounge chairs, pillars, and dramatic symmetrical lighting.",
    palette: ["#ff2b2b", "#7b0f15", "#1b0710"],
  },
  {
    title: "Wind Farm Terrain",
    note: "Landscape composition with working turbines, power lines, terrain, and winding fences. I used my fence plugin to quickly place fences across different terrain types.",
    image: "/modeling/turquoise.png",
    webp: "/modeling/turquoise.webp",
    alt: "Low-poly wind farm terrain with turbines, power lines, grassy hills, and winding fence paths.",
    palette: ["#5ed4e3", "#c4c356", "#37523e"],
  },
  {
    title: "Great Hall Detail",
    note: "Close-up pass emphasizing wall mounts and repeated architectural forms.",
    image: "/modeling/yellow.png",
    webp: "/modeling/yellow.webp",
    alt: "Low-poly great hall detail with deer wall mounts, warm golden light, tall windows, and long tables.",
    palette: ["#f3a72e", "#7a4b19", "#183240"],
  },
  {
    title: "Quiet Room",
    note: "Realistic room study with an emphasis on natural lighting, moody color grading, and material contrast.",
    image: "/modeling/week12_3png.png",
    webp: "/modeling/week12_3png.webp",
    alt: "Moody CRT room render with a hanging lamp, television static, table, chair, and green-tinted concrete walls.",

    views: [
      {
        label: "front view",
        image: "/modeling/week12_3png.png",
        webp: "/modeling/week12_3png.webp",
      },
      {
        label: "wide view",
        image: "/modeling/week12_1.png",
        webp: "/modeling/week12_1.webp",
      },
    ],
    palette: ["#c7d37a", "#273013", "#f04fc2"],
  },
];

const commandResponse = computed(() => {
  const value = command.value.trim().toLowerCase();
  if (!value)
    return "Type bio, projects, models, education, skills, or contact.";
  if (value.includes("bio"))
    return "Yale CS builder working across games, mobile, full-stack products, and research tools";
  if (value.includes("project"))
    return `${projects.length} resume-backed builds are loaded in the past projects section`;
  if (value.includes("model"))
    return "3D modeling gallery is ready for Blender, Roblox, and environment work";
  if (value.includes("education"))
    return "B.S. Cognitive Science and B.A. Computer Science at Yale University";
  if (value.includes("skill"))
    return "javascript/typescript, python, c/c++, sql, swift, react native, node, flask, unity, docker, aws";
  if (value.includes("contact")) return "aidan.palmer@yale.edu";
  return "no match, but this profile is extremely customizable";
});

function revealOnScroll() {
  document.querySelectorAll("[data-reveal]").forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    if (
      rect.top < window.innerHeight * 0.82 &&
      !revealed.value.includes(index)
    ) {
      revealed.value.push(index);
      element.classList.add("is-visible");
    }
  });
}

function openModel(piece) {
  selectedModel.value = piece;
  selectedModelView.value = 0;
}

function closeModel() {
  selectedModel.value = null;
}

function activeModelImage(model = selectedModel.value) {
  return model?.views?.[selectedModelView.value]?.image || model?.image;
}

function activeModelWebp(model = selectedModel.value) {
  return model?.views?.[selectedModelView.value]?.webp || model?.webp;
}

function openDesktopWindow(windowId) {
  activeDesktopWindow.value =
    activeDesktopWindow.value === windowId ? null : windowId;
}

function closeDesktopWindow() {
  activeDesktopWindow.value = null;
}

async function refreshSpotifyTrack() {
  try {
    spotifyTrack.value = await getNowPlaying();
  } catch {
    spotifyTrack.value = { ...emptySpotifyTrack };
  }
}

function handleKeydown(event) {
  if (event.key === "Escape") closeModel();
}

onMounted(() => {
  refreshSpotifyTrack();
  spotifyTimer = window.setInterval(refreshSpotifyTrack, 45000);
  revealOnScroll();
  requestAnimationFrame(revealOnScroll);
  window.setTimeout(revealOnScroll, 160);
  window.addEventListener("scroll", revealOnScroll, { passive: true });
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.clearInterval(spotifyTimer);
  window.removeEventListener("scroll", revealOnScroll);
  window.removeEventListener("keydown", handleKeydown);
});

watch(activeSection, async (section) => {
  await nextTick();
  document
    .getElementById(sectionTargets[section])
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
});
</script>

<template>
  <main class="page-shell">
    <nav class="topbar" aria-label="Portfolio navigation">
      <a class="brand" href="#home">
        <span>Aidan Palmer</span>
      </a>
      <div class="topbar-actions">
        <SelectButton
          v-model="activeSection"
          :options="sections"
          aria-label="Section picker"
        />
      </div>
    </nav>

    <section id="home" class="hero">
      <div class="profile-card" data-reveal>
        <div class="profile-header"></div>

        <div class="photo-slot">
          <picture>
            <source srcset="/profile_pic.webp" type="image/webp" />
            <img src="/profile_pic.jpg" alt="Aidan Palmer profile photo" />
          </picture>
        </div>

        <div class="profile-copy">
          <p class="status">
            Yale CS / software engineer / interactive systems
          </p>
          <h2>Hi, i'm Aidan</h2>
          <p>
            I build full-stack projects, mobile experiences, online worlds, and
            neuroscience-oriented research tools.
          </p>
        </div>
      </div>

      <div class="intro-panel" data-reveal>
        <h2>Full-stack software, games, and research tools.</h2>
        <p>
          I am a recent Yale computer science graduate building mobile apps,
          immersive game environments, startup interfaces, and experimental
          research software with a product-minded edge.
        </p>
        <div class="hero-actions">
          <Button label="Past Projects" as="a" href="#projects" />
          <Button
            label="Contact"
            severity="secondary"
            outlined
            as="a"
            href="mailto:aidan.palmer@yale.edu"
          />
        </div>
      </div>
    </section>

    <section class="marquee" aria-label="Profile highlights">
      <div :title="tickerMessage">
        <span>{{ tickerBinary }}</span>
        <span>{{ tickerBinary }}</span>
      </div>
    </section>

    <section class="content-grid">
      <aside class="sidebar" data-reveal>
        <Card>
          <template #title>
            <span class="card-title"
              ><Sparkles :size="18" /> Profile Details</span
            >
          </template>
          <template #content>
            <dl class="details-list">
              <div>
                <dt>Location</dt>
                <dd>New Haven, CT</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Full-stack, mobile, games, research</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>JavaScript, Python, C++/C#, Swift</dd>
              </div>
            </dl>
          </template>
        </Card>
        <Card class="mini-desktop-card">
          <template #title>
            <span class="card-title desktop-title">My Desktop</span>
          </template>
          <template #content>
            <div
              class="mini-desktop"
              :class="{ expanded: activeDesktopWindow }"
              aria-label="Interactive desktop panel"
            >
              <div class="desktop-icons">
                <button
                  v-for="app in desktopApps"
                  :key="app.id"
                  type="button"
                  :data-app="app.id"
                  :class="{ active: activeDesktopWindow === app.id }"
                  @click="openDesktopWindow(app.id)"
                >
                  <component :is="app.icon" :size="22" />
                  <span>{{ app.label }}</span>
                </button>
              </div>

              <article v-if="activeDesktopWindow" class="desktop-window">
                <header>
                  <span>{{ desktopWindowTitles[activeDesktopWindow] }}</span>
                  <button
                    type="button"
                    aria-label="Close mini desktop window"
                    @click="closeDesktopWindow"
                  >
                    <X :size="14" />
                  </button>
                </header>

                <div v-if="activeDesktopWindow === 'hobbies'">
                  <div class="hobby-list">
                    <article v-for="hobby in hobbies" :key="hobby.name">
                      <div>
                        <h3>{{ hobby.name }}</h3>
                        <p>{{ hobby.detail }}</p>
                      </div>
                      <div class="hobby-links">
                        <template
                          v-for="link in hobby.links"
                          :key="`${hobby.name}-${link.label}`"
                        >
                          <a
                            v-if="link.href"
                            :href="link.href"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {{ link.label }}
                          </a>
                          <span v-else>{{ link.label }}</span>
                        </template>
                      </div>
                    </article>
                  </div>
                </div>

                <div
                  v-else-if="activeDesktopWindow === 'spotify'"
                  class="spotify-widget"
                >
                  <div class="music-visual">
                    <div class="album-cover">
                      <img
                        v-if="displayedSpotifyTrack.albumArt"
                        :src="displayedSpotifyTrack.albumArt"
                        :alt="`${displayedSpotifyTrack.album} album cover`"
                      />
                      <span v-else>vibe</span>
                    </div>
                    <div
                      class="record-player"
                      :class="{ playing: displayedSpotifyTrack.isPlaying }"
                      aria-hidden="true"
                    >
                      <div class="record">
                        <img
                          v-if="displayedSpotifyTrack.albumArt"
                          :src="displayedSpotifyTrack.albumArt"
                          alt=""
                        />
                        <span v-else></span>
                      </div>
                      <div class="tonearm"></div>
                    </div>
                  </div>
                  <div>
                    <small>{{
                      displayedSpotifyTrack.isVibe
                        ? "current vibe"
                        : displayedSpotifyTrack.connected
                          ? displayedSpotifyTrack.isPlaying
                            ? "currently spinning"
                            : "paused"
                          : "spotify not connected yet"
                    }}</small>
                    <h3>{{ displayedSpotifyTrack.title }}</h3>
                    <p>{{ displayedSpotifyTrack.artist }}</p>
                    <span>{{ displayedSpotifyTrack.album }}</span>
                    <a
                      v-if="displayedSpotifyTrack.spotifyUrl"
                      :href="displayedSpotifyTrack.spotifyUrl"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open on Spotify
                    </a>
                  </div>
                </div>

                <div v-else class="contact-card-window">
                  <p>
                    Best places to reach me or see what I am building.
                  </p>
                  <div class="contact-card-links">
                    <a href="mailto:aidan.palmer@yale.edu">
                      <Mail :size="16" />
                      <span>aidan.palmer@yale.edu</span>
                    </a>
                    <a
                      href="https://github.com/apalmm"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github :size="16" />
                      <span>github.com/apalmm</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/aidan-palmer-1003bb225/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Linkedin :size="16" />
                      <span>linkedin.com/in/aidan-palmer</span>
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </template>
        </Card>
        <!-- <Card>
          <template #title>
            <span class="card-title"><Sparkles :size="18" />Interests</span>
          </template>
          <template #content>
            <dl class="details-list">
              <div>
                <dt>Location</dt>
                <dd>New Haven, CT</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Full-stack, mobile, games, research</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>JavaScript, Python, C/C++, Swift</dd>
              </div>
            </dl>
          </template>
        </Card> -->

        <!-- Guestbook parked here in case it comes back later.
        <Card class="terminal-card">
          <template #title>Guestbook</template>
          <template #content>
            <small
              >Quickly query the portfolio like an old-school profile
              widget.</small
            >
            <p>{{ commandResponse }}</p>
            <span class="command-row">
              <strong>&gt;</strong>
              <InputText
                v-model="command"
                aria-label="Profile console command"
              />
            </span>
          </template>
        </Card> -->
      </aside>

      <div class="main-column">
        <section id="projects" class="section-panel" data-reveal>
          <header class="section-heading">
            <h2><BriefcaseBusiness :size="20" /> Past Projects</h2>
            <Chip label="Featured" />
          </header>

          <div class="project-list">
            <article
              v-for="project in projects"
              :key="project.title"
              class="project-row"
            >
              <div>
                <span class="project-year">{{ project.year }}</span>
                <h3>
                  <a
                    v-if="project.url"
                    :href="project.url"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ project.title }}
                  </a>
                  <template v-else>{{ project.title }}</template>
                </h3>
                <small v-if="project.repo" class="repo-name">{{
                  project.repo
                }}</small>
                <p>{{ project.description }}</p>
              </div>
              <div class="project-meta">
                <strong>{{ project.role }}</strong>
                <div>
                  <Chip
                    v-for="tool in project.tools"
                    :key="tool"
                    :label="tool"
                  />
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="modeling" class="section-panel modeling-panel" data-reveal>
          <header class="section-heading">
            <h2><Box :size="20" /> 3D Modeling</h2>
            <Chip label="Renders" />
          </header>
          <p class="modeling-intro">
            I specialize in low-poly environment modeling, lighting studies, and
            realistic rendered scenes working across stylized interiors, outdoor
            worlds, and game assets.
          </p>
          <div class="modeling-grid">
            <article
              v-for="piece in modelingPieces"
              :key="piece.title"
              class="modeling-card"
              :class="{ featured: piece.featured }"
              :style="{
                '--c1': piece.palette[0],
                '--c2': piece.palette[1],
                '--c3': piece.palette[2],
              }"
            >
              <button
                class="modeling-slot"
                type="button"
                @click="openModel(piece)"
              >
                <picture>
                  <source
                    v-if="piece.webp"
                    :srcset="piece.webp"
                    type="image/webp"
                  />
                  <img :src="piece.image" :alt="piece.alt" loading="lazy" />
                </picture>
              </button>
              <h3>{{ piece.title }}</h3>
              <div class="palette" aria-label="Render color palette">
                <span
                  v-for="color in piece.palette"
                  :key="`${piece.title}-${color}`"
                  :style="{ background: color }"
                ></span>
              </div>
              <p>{{ piece.note }}</p>
              <small v-if="piece.views" class="view-count"
                >{{ piece.views.length }} views</small
              >
            </article>
          </div>
        </section>

        <section
          id="education"
          class="section-panel education-panel"
          data-reveal
        >
          <header class="section-heading">
            <h2><BookOpen :size="25" /> Education</h2>
          </header>
          <div class="yale-banner">
            <div>
              <p>Yale University</p>
              <h3>New Haven, Connecticut</h3>
            </div>
          </div>
          <div class="degree-grid">
            <article
              v-for="degree in degrees"
              :key="degree.title"
              class="degree-card"
            >
              <span>{{ degree.date }}</span>
              <h2>{{ degree.title }}</h2>
              <p>{{ degree.detail }}</p>
            </article>
          </div>
        </section>

        <section id="bio" class="section-panel bio-panel" data-reveal>
          <header class="section-heading">
            <h2><AtSign :size="25" /> Bio</h2>
          </header>
          <p>
            I am a recent Yale computer science graduate and software engineer
            who likes projects with a real-world surface area: mobile apps
            people use, game environments people explore, and research tools
            that help teams reason through complex data.<br /><br />
            Would love to connect!
          </p>
          <div class="bio-actions">
            <Button
              label="Open Resume"
              icon-pos="right"
              as="a"
              href="/Aidan_Palmer_Resume.pdf"
              target="_blank"
              text
            >
              <template #icon>
                <ExternalLink :size="16" />
              </template>
            </Button>
            <Button
              label="Email"
              as="a"
              href="mailto:aidan.palmer@yale.edu"
              text
            />
            <Button
              label="LinkedIn"
              as="a"
              href="https://www.linkedin.com/in/aidan-palmer-1003bb225/"
              target="_blank"
              rel="noreferrer"
              text
            />
            <Button
              label="GitHub"
              as="a"
              href="https://github.com/apalmm"
              target="_blank"
              rel="noreferrer"
              text
            />
          </div>
        </section>
      </div>
    </section>

    <div
      v-if="selectedModel"
      class="model-lightbox"
      :style="{
        '--c1': selectedModel.palette[0],
        '--c2': selectedModel.palette[1],
        '--c3': selectedModel.palette[2],
        '--image': `url(${activeModelWebp() || activeModelImage()})`,
      }"
      role="dialog"
      aria-modal="true"
      :aria-label="selectedModel.title"
      @click.self="closeModel"
    >
      <div class="lightbox-backdrop"></div>
      <figure class="lightbox-panel">
        <button
          class="lightbox-close"
          type="button"
          aria-label="Close render preview"
          @click="closeModel"
        >
          x
        </button>
        <picture>
          <source
            v-if="activeModelWebp()"
            :srcset="activeModelWebp()"
            type="image/webp"
          />
          <img :src="activeModelImage()" :alt="selectedModel.alt" />
        </picture>
        <figcaption>
          <div>
            <p>low-poly render</p>
            <h2>{{ selectedModel.title }}</h2>
            <span>{{ selectedModel.note }}</span>
            <div
              v-if="selectedModel.views"
              class="view-switcher"
              aria-label="Render views"
            >
              <button
                v-for="(view, index) in selectedModel.views"
                :key="view.image"
                type="button"
                :class="{ active: selectedModelView === index }"
                @click="selectedModelView = index"
              >
                {{ view.label }}
              </button>
            </div>
          </div>
          <div class="palette">
            <span
              v-for="color in selectedModel.palette"
              :key="`active-${color}`"
              :style="{ background: color }"
            ></span>
          </div>
        </figcaption>
      </figure>
    </div>
  </main>
</template>
