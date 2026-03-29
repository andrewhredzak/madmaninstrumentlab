const assetBase = document.body.dataset.assetBase || "HREDZAK_designassets";
let galleryItems = [];

const resourceSections = [
    {
        title: "Documents",
        description: "Scanned family files ready for viewing or download.",
        items: [
            {
                label: "Parish history PDF",
                file: "documents/parish_history_thechurchofstanne.pdf",
                meta: "Historical document"
            }
        ]
    }
];

const storageKeys = {
    messages: "hredzakPrototypeMessages"
};

const seededMessages = [
    {
        author: "Andrew Hredzak",
        title: "Archive Prototype Online",
        body: "Initial layout is ready for browsing photos, repository sections, and shared family notes.",
        timestamp: "2026-03-22T09:00:00"
    },
    {
        author: "Marie Hredzak",
        title: "Photo Notes",
        body: "The Krcma and Old Country images should have short captions with dates and places when known.",
        timestamp: "2026-03-22T10:15:00"
    }
];

const resourceSectionsEl = document.getElementById("resourceSections");
const galleryGrid = document.getElementById("galleryGrid");
const messageForm = document.getElementById("messageForm");
const messageBoard = document.getElementById("messageBoard");
const messageAuthor = document.getElementById("messageAuthor");
const messageTitle = document.getElementById("messageTitle");
const messageBody = document.getElementById("messageBody");
const lightboxDialog = document.getElementById("lightboxDialog");
const closeLightbox = document.getElementById("closeLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxMeta = document.getElementById("lightboxMeta");

function getGalleryManifestUrl() {
    if (!galleryGrid) {
        return null;
    }

    return galleryGrid.dataset.galleryManifest || "gallery.json";
}

function buildAssetPath(file) {
    return `${assetBase}/${file.split("/").map((segment) => encodeURIComponent(segment)).join("/")}`;
}

function formatDate(value) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function getMessages() {
    const stored = localStorage.getItem(storageKeys.messages);
    if (!stored) {
        localStorage.setItem(storageKeys.messages, JSON.stringify(seededMessages));
        return [...seededMessages].reverse();
    }

    try {
        return JSON.parse(stored).reverse();
    } catch (error) {
        localStorage.setItem(storageKeys.messages, JSON.stringify(seededMessages));
        return [...seededMessages].reverse();
    }
}

function saveMessages(messages) {
    localStorage.setItem(storageKeys.messages, JSON.stringify(messages));
}

function renderResources() {
    if (!resourceSectionsEl) {
        return;
    }

    resourceSectionsEl.innerHTML = resourceSections
        .map((section) => {
            const itemsMarkup = section.items.length
                ? `<ul>${section.items
                    .map(
                        (item) => `
                            <li>
                                <a class="resource-link" href="${buildAssetPath(item.file)}" target="_blank" rel="noreferrer">${item.label}</a>
                                <span> - ${item.meta}</span>
                            </li>
                        `
                    )
                    .join("")}</ul>`
                : `<div class="empty-state">No items loaded yet.</div>`;

            return `
                <article class="resource-card">
                    <h3>${section.title}</h3>
                    <p>${section.description}</p>
                    ${itemsMarkup}
                </article>
            `;
        })
        .join("");
}

function openLightbox(item) {
    if (!lightboxDialog || !lightboxImage || !lightboxTitle || !lightboxMeta) {
        return;
    }

    lightboxImage.src = buildAssetPath(item.file);
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxMeta.textContent = item.tag;
    lightboxDialog.showModal();
}

function renderGallery() {
    if (!galleryGrid) {
        return;
    }

    galleryGrid.innerHTML = galleryItems
        .map(
            (item, index) => `
                <article class="gallery-card">
                    <button class="gallery-button" type="button" data-gallery-index="${index}">
                        <img class="gallery-image" src="${buildAssetPath(item.file)}" alt="${item.title}">
                        <div class="gallery-copy">
                            <h3>${item.title}</h3>
                            <p>${item.tag}</p>
                        </div>
                    </button>
                </article>
            `
        )
        .join("");

    galleryGrid.querySelectorAll("[data-gallery-index]").forEach((button) => {
        button.addEventListener("click", () => {
            const item = galleryItems[Number(button.dataset.galleryIndex)];
            openLightbox(item);
        });
    });
}

async function loadGallery() {
    if (!galleryGrid) {
        return;
    }

    const manifestUrl = getGalleryManifestUrl();
    if (!manifestUrl) {
        galleryGrid.innerHTML = `<div class="empty-state">Gallery manifest is not configured.</div>`;
        return;
    }

    try {
        const response = await fetch(manifestUrl);
        if (!response.ok) {
            throw new Error(`Failed to load gallery manifest: ${response.status}`);
        }

        const items = await response.json();
        galleryItems = Array.isArray(items) ? items : [];

        if (!galleryItems.length) {
            galleryGrid.innerHTML = `<div class="empty-state">No gallery images loaded yet.</div>`;
            return;
        }

        renderGallery();
    } catch (error) {
        console.error(error);
        galleryGrid.innerHTML = `<div class="empty-state">Unable to load gallery images.</div>`;
    }
}

function renderMessages() {
    if (!messageBoard) {
        return;
    }

    const messages = getMessages();
    if (!messages.length) {
        messageBoard.innerHTML = `<div class="empty-state">No messages yet.</div>`;
        return;
    }

    messageBoard.innerHTML = messages
        .map(
            (message) => `
                <article class="message-card">
                    <h3>${message.title}</h3>
                    <p class="message-meta">${message.author} - ${formatDate(message.timestamp)}</p>
                    <p>${message.body}</p>
                </article>
            `
        )
        .join("");
}

if (messageForm && messageAuthor && messageTitle && messageBody) {
    messageForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const author = messageAuthor.value.trim();
        const title = messageTitle.value.trim();
        const body = messageBody.value.trim();

        if (!author || !title || !body) {
            return;
        }

        const existing = getMessages().reverse();
        existing.push({
            author,
            title,
            body,
            timestamp: new Date().toISOString()
        });

        saveMessages(existing);
        messageForm.reset();
        renderMessages();
    });
}

if (closeLightbox && lightboxDialog) {
    closeLightbox.addEventListener("click", () => {
        lightboxDialog.close();
    });

    lightboxDialog.addEventListener("click", (event) => {
        const bounds = lightboxDialog.getBoundingClientRect();
        const clickedInside =
            bounds.top <= event.clientY &&
            event.clientY <= bounds.top + bounds.height &&
            bounds.left <= event.clientX &&
            event.clientX <= bounds.left + bounds.width;

        if (!clickedInside) {
            lightboxDialog.close();
        }
    });
}

renderResources();
loadGallery();
renderMessages();
