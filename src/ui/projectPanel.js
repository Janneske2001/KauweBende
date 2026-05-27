// ui/projectPanel.js
export function showProject(project) {
    if (window.controls) {
        window.controls.enablePan = false;
        window.controls.enableZoom = false;
    }

    // Clear previous dynamic content
    const contentContainer = document.getElementById("project-content");
    if (contentContainer) contentContainer.innerHTML = "";

    // Static fields
    document.getElementById("project-title").textContent = project.title;

    const roleElem = document.getElementById("project-role");
    if (roleElem) roleElem.textContent = project.role ? "Role: " + project.role : "";

    const techContainer = document.getElementById("project-tech");
    if (techContainer) {
        techContainer.innerHTML = "";
        if (project.tech && project.tech.length) {
            project.tech.forEach(t => {
                const tag = document.createElement("span");
                tag.textContent = t;
                tag.classList.add("tech-tag");
                techContainer.appendChild(tag);
            });
        }
    }

    const linkElem = document.getElementById("project-link");
    if (linkElem) linkElem.href = project.link;

    // --- Flexible content rendering ---
    if (project.content && Array.isArray(project.content)) {
        project.content.forEach(item => {
            if (item.type === "image") {
                const img = document.createElement("img");
                img.src = item.src;
                img.alt = item.alt || "";
                img.classList.add("project-dynamic-image", "panel-item");
                contentContainer.appendChild(img);
            } else if (item.type === "text") {
                const div = document.createElement("div");
                div.innerHTML = item.html;   // can contain HTML like <h3>, <p>, etc.
                div.classList.add("project-dynamic-text", "panel-item");
                contentContainer.appendChild(div);
            }
        });
    } else {
        // Backward compatibility: single image + description
        const oldImg = document.createElement("img");
        oldImg.src = project.image;
        oldImg.classList.add("project-dynamic-image", "panel-item");
        contentContainer.appendChild(oldImg);

        const oldDesc = document.createElement("div");
        oldDesc.innerHTML = `<p>${project.description || ""}</p>`;
        oldDesc.classList.add("project-dynamic-text", "panel-item");
        contentContainer.appendChild(oldDesc);
    }

    // Animate panel
    const panel = document.getElementById("project-panel");
    panel.classList.remove("hidden");
    setTimeout(() => panel.classList.add("active"), 10);

    // Reset animation for new items
    const items = document.querySelectorAll("#project-panel .panel-item");
    items.forEach(item => { item.style.transition = ""; });
}

export function closeProject() {
    const panel = document.getElementById("project-panel");
    panel.classList.remove("active");
    setTimeout(() => {
        panel.classList.add("hidden");
        if (window.controls) {
            window.controls.enablePan = true;
            window.controls.enableZoom = true;
        }
        if (window.setProjectOpen) window.setProjectOpen(false);
    }, 300);
}