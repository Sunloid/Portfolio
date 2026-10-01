/*
 * EDIT HERE: This object is the single source of truth for the project cards
 * and terminal links. Add, remove, or rewrite projects without touching HTML.
 */
const portfolio = {
  name: "Syed Ahmed Haider Rizavi",
  email: "syedrazvi.dev@gmail.com",
  phone: "+91 9059501891",
  location: "Hyderabad, India",
  links: {
    github: "https://github.com/Sunloid",
    linkedin: "https://www.linkedin.com/in/haider-rizavi",
    upwork: "https://www.upwork.com/freelancers/~01509716fd709e03b3",
    fiverr: "https://www.fiverr.com/sellers/sunloid",
    resume: "assets/Haider_Rizavi_Resume.pdf",
    uiux: "portfolio.html",
    portfolio: "portfolio.html",
  },
  // Projects now live in projects.json — this starts empty and gets filled
  // in by loadProjects() below. Don't add project objects here directly.
  projects: [],
};

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[character]));

function renderProjects() {
  const grid = document.querySelector("#project-grid");
  if (!grid) return;
  grid.innerHTML = portfolio.projects.map((project, index) => `
    <article class="project-card">
      <div class="project-card-top"><span>0${index + 1}</span><span>${escapeHtml(project.stack || "")}</span></div>
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="project-card-footer">
        <a href="${project.githubUrl}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(project.name)} on GitHub">GITHUB ↗</a>
        ${project.upworkUrl ? `<a href="${project.upworkUrl}" target="_blank" rel="noopener" aria-label="View ${escapeHtml(project.name)} on Upwork">UPWORK ↗</a>` : ""}
      </div>
    </article>
  `).join("");
}

// EDIT HERE: boot message shown before the terminal accepts input.
// Add a "rich" version of a line if you want bold/linked words once it
// finishes typing (see the last line for an example).
const WELCOME_LINES = [
  { plain: `Welcome to ${portfolio.name}'s Portfolio Terminal! 🗂️` },
  { plain: `Now with file system navigation!` },
  {
    plain: `Type 'help' to see available commands or try: uiux`,
    rich: `Type <strong>'help'</strong> to see available commands or try: <strong>uiux</strong>`,
  },
];

function typeWelcome(output, done, speed = 18, lineGap = 160) {
  const container = document.createElement("div");
  container.className = "terminal-welcome";
  output.appendChild(container);

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= WELCOME_LINES.length) {
      done();
      return;
    }
    const line = WELCOME_LINES[lineIndex];
    const p = document.createElement("p");
    container.appendChild(p);
    let charIndex = 0;

    function typeChar() {
      if (charIndex < line.plain.length) {
        p.textContent += line.plain[charIndex];
        charIndex++;
        output.scrollTop = output.scrollHeight;
        setTimeout(typeChar, speed);
      } else {
        if (line.rich) p.innerHTML = line.rich;
        lineIndex++;
        setTimeout(typeLine, lineGap);
      }
    }
    typeChar();
  }

  typeLine();
}

function setupTerminal() {
  const form = document.querySelector("#terminal-form");
  const input = document.querySelector("#terminal-input");
  const output = document.querySelector("#terminal-output");
  const prompt = document.querySelector("#terminal-prompt");
  if (!form || !input || !output || !prompt) return;

  typeWelcome(output, () => input.focus());

  let directory = "/";
  const showLine = (command) => {
    output.insertAdjacentHTML("beforeend", `<p class="terminal-line"><span>user@portfolio:${directory}$</span> <span class="command">${escapeHtml(command)}</span></p>`);
  };
  const showResponse = (html) => output.insertAdjacentHTML("beforeend", `<div class="terminal-response">${html}</div>`);
  const setDirectory = (next) => {
    directory = next;
    prompt.textContent = `user@portfolio:${directory}$`;
  };
  const projectList = () => `<div class="terminal-project-list">${portfolio.projects.map((project) => `<div class="terminal-project-item"><span>📁 ${escapeHtml(project.name)} <span class="muted">— ${escapeHtml(project.stack)}</span></span><span class="terminal-project-links"><a href="${project.githubUrl}" target="_blank" rel="noopener">GitHub ↗</a>${project.upworkUrl ? `<a href="${project.upworkUrl}" target="_blank" rel="noopener">Upwork ↗</a>` : ""}</span></div>`).join("")}</div>`;
  const help = () => `
    <h3>Available commands:</h3>
    <p><strong>File System:</strong><br>- ls [path]: List directory contents<br>- cd &lt;path&gt;: Change directory<br>- cat &lt;file&gt;: Display file contents<br>- tree: Show directory tree structure<br>- pwd: Show current directory path</p>
    <p><strong>Portfolio:</strong><br>- about: Information about me<br>- skills: My technical skills<br>- projects: My recent projects<br>- contact: Contact information<br>- socials: Links to my social media<br>- uiux: Open the visual portfolio (UI/UX)</p>
    <p><strong>System:</strong><br>- theme [light/dark]: Toggle terminal theme<br>- clear: Clear the terminal<br>- resume: Link to my resume<br>- blog: Link to my blog<br>- search: Search in portfolio (coming soon)</p>
    <p>Try: <span class="muted">cd projects &amp;&amp; ls &amp;&amp; cat README.md</span></p>`;
  const responses = {
    about: () => `<h3>ABOUT</h3><p>Aspiring Cloud / DevOps Engineer with hands-on experience in AWS, Linux, containerization, and CI/CD automation. Quick to learn, with a strong interest in cloud operations, infrastructure automation, and technical support.</p>`,
    skills: () => `<h3>SKILLS</h3><p><strong>Languages:</strong> JavaScript, Python</p><p><strong>DevOps:</strong> Linux, AWS (EC2, ECS, ECR), Docker, Kubernetes, Jenkins, Ansible, Terraform, Maven, Tomcat, Nexus, SonarQube, GitHub Actions, GHCR, Nginx, Minikube</p><p><strong>Other:</strong> Git, GitHub, CI/CD, IaC, Bash/Shell, YAML</p>`,
    projects: () => `<h3>PINNED PROJECTS</h3>${projectList()}`,
    contact: () => `<h3>CONTACT</h3><p>${portfolio.location}<br><a href="mailto:${portfolio.email}">${portfolio.email}</a><br><a href="tel:${portfolio.phone.replace(/\s/g, "")}">${portfolio.phone}</a></p>`,
    socials: () => `<h3>SOCIALS</h3><p><a href="${portfolio.links.github}" target="_blank" rel="noopener">GitHub ↗</a><br><a href="${portfolio.links.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a><br><a href="${portfolio.links.upwork}" target="_blank" rel="noopener">Upwork ↗</a><br><a href="${portfolio.links.fiverr}" target="_blank" rel="noopener">Fiverr ↗</a></p>`,
  };
  const runSingleCommand = (rawCommand) => {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;
    showLine(rawCommand.trim());
    if (command === "clear") { output.innerHTML = ""; return; }
    if (command === "help") { showResponse(help()); return; }
    if (command === "pwd") { showResponse(`<p>${directory}</p>`); return; }
    if (command === "ls") {
      showResponse(directory === "/projects" ? projectList() : `<p>about.txt&nbsp;&nbsp; skills.txt&nbsp;&nbsp; projects/&nbsp;&nbsp; resume.pdf&nbsp;&nbsp; uiux/&nbsp;&nbsp; contact.txt</p>`);
      return;
    }
    if (command === "tree") { showResponse(`<p>.<br>├── about.txt<br>├── skills.txt<br>├── projects/<br>${portfolio.projects.map((project, index) => `${index === portfolio.projects.length - 1 ? "└" : "├"}── ${escapeHtml(project.name)}`).join("<br>")}<br>├── resume.pdf<br>├── uiux/<br>└── contact.txt</p>`); return; }
    if (command.startsWith("cd ")) {
      const destination = command.slice(3).replace(/\/$/, "");
      if (["projects", "/projects"].includes(destination)) { setDirectory("/projects"); showResponse(`<p>Changed directory to <span class="muted">/projects</span></p>`); return; }
      if (["..", "/", "~"].includes(destination)) { setDirectory("/"); showResponse(`<p>Changed directory to <span class="muted">/</span></p>`); return; }
      if (["uiux", "ui-ux", "/ui-ux"].includes(destination)) { window.location.href = portfolio.links.uiux; return; }
      showResponse(`<p class="terminal-error">cd: ${escapeHtml(destination)}: No such directory</p>`); return;
    }
    if (command.startsWith("cat ")) {
      const file = command.slice(4);
      if (file === "readme.md" && directory === "/projects") { showResponse(`<h3>PROJECTS / README.md</h3><p>A selection of pinned Cloud and DevOps projects. Run <span class="muted">ls</span> to inspect the directory or <span class="muted">projects</span> to view links.</p>`); return; }
      if (["about.txt", "about"].includes(file)) { showResponse(responses.about()); return; }
      if (["skills.txt", "skills"].includes(file)) { showResponse(responses.skills()); return; }
      if (["contact.txt", "contact"].includes(file)) { showResponse(responses.contact()); return; }
      if (["resume.pdf", "resume"].includes(file)) { showResponse(`<p>Opening <a href="${portfolio.links.resume}" target="_blank" rel="noopener">Haider_Rizavi_Resume.pdf ↗</a></p>`); window.open(portfolio.links.resume, "_blank"); return; }
      showResponse(`<p class="terminal-error">cat: ${escapeHtml(file)}: No such file</p>`); return;
    }
    if (command === "resume") { showResponse(`<p>Opening <a href="${portfolio.links.resume}" target="_blank" rel="noopener">Haider_Rizavi_Resume.pdf ↗</a></p>`); window.open(portfolio.links.resume, "_blank"); return; }
    if (command === "portfolio" || command === "visual") { window.location.href = portfolio.links.portfolio; return; }
    if (command === "uiux" || command === "ui/ux") { window.location.href = portfolio.links.uiux; return; }
    if (command === "blog") { showResponse(`<p class="muted">Blog is coming soon. Check back after the next deployment.</p>`); return; }
    if (command === "search") { showResponse(`<p class="muted">Search is coming soon.</p>`); return; }
    if (command.startsWith("theme")) {
      const mode = command.split(/\s+/)[1];
      if (mode === "light") { document.body.classList.add("light-terminal"); showResponse(`<p>Terminal switched to <span class="muted">light</span> mode.</p>`); return; }
      document.body.classList.remove("light-terminal");
      showResponse(`<p>Terminal switched to <span class="muted">dark</span> mode.</p>`); return;
    }
    if (responses[command]) { showResponse(responses[command]()); return; }
    showResponse(`<p class="terminal-error">command not found: ${escapeHtml(command)}. Type 'help' to see available commands.</p>`);
  };
  const runCommand = (command) => command.split("&&").forEach((part) => runSingleCommand(part));
  form.addEventListener("submit", (event) => { event.preventDefault(); runCommand(input.value); input.value = ""; input.focus(); output.scrollTop = output.scrollHeight; });
  document.querySelectorAll("[data-command]").forEach((button) => button.addEventListener("click", () => { input.value = button.dataset.command; form.requestSubmit(); }));
}

async function loadProjects() {
  try {
    const response = await fetch(`projects.json?v=${Date.now()}`);
    if (!response.ok) throw new Error("projects.json request failed");
    portfolio.projects = await response.json();
  } catch (error) {
    // Falls back to an empty list rather than breaking the page.
    // Note: this fetch will fail if you open index.html directly as a
    // file:// URL — it needs to be served over http(s), which GitHub
    // Pages does automatically. Use a local server to test (see README).
    console.error("Could not load projects.json:", error);
    portfolio.projects = [];
  }
  renderProjects();
}

loadProjects();
setupTerminal();
document.querySelectorAll("#year").forEach((element) => { element.textContent = new Date().getFullYear(); });
