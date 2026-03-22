const users = [
    {
        email: "ahredzak.com",
        password: "hredzak",
        name: "Andrew Hredzak",
        role: "Admin"
    },
    {
        email: "marie@hredzak.family",
        password: "family01",
        name: "Marie Hredzak",
        role: "User"
    },
    {
        email: "hredzak@gmail.com",
        password: "hredzak",
        name: "General Test User",
        role: "User"
    },
    {
        email: "john@hredzak.family",
        password: "family02",
        name: "John Hredzak",
        role: "User"
    },
    {
        email: "linda@hredzak.family",
        password: "family03",
        name: "Linda Hredzak",
        role: "User"
    },
    {
        email: "archive@hredzak.family",
        password: "family04",
        name: "Archive Guest",
        role: "User"
    }
];

const galleryItems = [
    { file: "Christmas at Frank_s.webp", title: "Christmas At Frank's", tag: "Gathering" },
    { file: "christmasatfranks_color.webp", title: "Frank's In Color", tag: "Color Restoration" },
    { file: "Copy of Old Country.webp", title: "Old Country Copy", tag: "Heritage" },
    { file: "Front of Krcma.webp", title: "Front Of Krcma", tag: "Location" },
    { file: "generation-3c0d6270-7582-4f7b-ada0-db57167a3750.webp", title: "Generation Portrait", tag: "Family Line" },
    { file: "Happy Trio.webp", title: "Happy Trio", tag: "Portrait" },
    { file: "Hredzak_beerlabel.webp", title: "Hredzak Beer Label", tag: "Artifact" },
    { file: "Igercich Headstone 2.webp", title: "Igercich Headstone", tag: "Record" },
    { file: "Inside Krcma.webp", title: "Inside Krcma", tag: "Interior" },
    { file: "insideKrcma_color.webp", title: "Inside Krcma In Color", tag: "Color Restoration" },
    { file: "Krcma Christmas.webp", title: "Krcma Christmas", tag: "Holiday" },
    { file: "Krcma.webp", title: "Krcma", tag: "Location" },
    { file: "Old Country.webp", title: "Old Country", tag: "Heritage" }
];

const resourceSections = [
    {
        title: "Documents",
        description: "Scanned family files ready for viewing or download.",
        items: [
            {
                label: "Parish history PDF",
                href: "HREDZAK_designassets/parish_history_thechurchofstanne.pdf",
                meta: "Historical document"
            }
        ]
    },
    {
        title: "Audio Records",
        description: "Reference recordings currently present in the prototype asset folder.",
        items: [
            {
                label: "Pittsburgh Hredzak recording 1",
                href: "HREDZAK_designassets/Pittsburgh%20hredzak%20rec1.m4a",
                meta: "Audio note"
            },
            {
                label: "Pittsburgh Hredzak recording 2",
                href: "HREDZAK_designassets/Pittsburgh%20hredzak%20rec2.m4a",
                meta: "Audio note"
            },
            {
                label: "Pittsburgh Hredzak recording 3",
                href: "HREDZAK_designassets/Pittsburgh%20hredzak%20rec3.m4a",
                meta: "Audio note"
            }
        ]
    },
    {
        title: "Video",
        description: "The repository is structured for video, but no local video files are loaded into this prototype yet.",
        items: []
    }
];

const storageKeys = {
    session: "hredzakPrototypeSession",
    messages: "hredzakPrototypeMessages"
};

const seededMessages = [
    {
        author: "Andrew Hredzak",
        role: "Admin",
        title: "Archive Prototype Online",
        body: "Initial layout is ready for family testing. Next step is deciding how documents should be tagged by branch, place, and year.",
        timestamp: "2026-03-22T09:00:00"
    },
    {
        author: "Marie Hredzak",
        role: "User",
        title: "Photo Notes",
        body: "The Krcma and Old Country images should probably live in a heritage collection with short captions for context.",
        timestamp: "2026-03-22T10:15:00"
    }
];

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginStatus = document.getElementById("loginStatus");
const seededUsersList = document.getElementById("seededUsersList");
const authPanel = document.getElementById("authPanel");
const dashboardPanel = document.getElementById("dashboardPanel");
const galleryPanel = document.getElementById("galleryPanel");
const welcomeLine = document.getElementById("welcomeLine");
const rolePill = document.getElementById("rolePill");
const logoutButton = document.getElementById("logoutButton");
const statsGrid = document.getElementById("statsGrid");
const messageForm = document.getElementById("messageForm");
const messageBoard = document.getElementById("messageBoard");
const resourceSectionsEl = document.getElementById("resourceSections");
const galleryGrid = document.getElementById("galleryGrid");
const messageTitle = document.getElementById("messageTitle");
const messageBody = document.getElementById("messageBody");
const lightboxDialog = document.getElementById("lightboxDialog");
const closeLightbox = document.getElementById("closeLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxMeta = document.getElementById("lightboxMeta");

function assetPath(file) {
    return `HREDZAK_designassets/${encodeURIComponent(file)}`;
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

function getCurrentUser() {
    const stored = localStorage.getItem(storageKeys.session);
    if (!stored) {
        return null;
    }

    try {
        return JSON.parse(stored);
    } catch (error) {
        localStorage.removeItem(storageKeys.session);
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem(storageKeys.session, JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem(storageKeys.session);
}

function renderSeededUsers() {
    seededUsersList.innerHTML = users
        .map((user) => `<li>${user.name} (${user.role}) - ${user.email}</li>`)
        .join("");
}

function renderStats() {
    const stats = [
        { label: "Users", value: users.length },
        { label: "Images", value: galleryItems.length },
        { label: "Documents", value: resourceSections[0].items.length },
        { label: "Posts", value: getMessages().length }
    ];

    statsGrid.innerHTML = stats
        .map(
            (item) => `
                <article class="stat-card">
                    <span>${item.label}</span>
                    <strong>${item.value}</strong>
                </article>
            `
        )
        .join("");
}

function renderMessages() {
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
                    <p class="message-meta">${message.author} · ${message.role} · ${formatDate(message.timestamp)}</p>
                    <p>${message.body}</p>
                </article>
            `
        )
        .join("");
}

function renderResources() {
    resourceSectionsEl.innerHTML = resourceSections
        .map((section) => {
            const itemsMarkup = section.items.length
                ? `<ul>${section.items
                    .map(
                        (item) => `
                            <li>
                                <a class="resource-link" href="${item.href}" target="_blank" rel="noreferrer">${item.label}</a>
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
    lightboxImage.src = assetPath(item.file);
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxMeta.textContent = item.tag;
    lightboxDialog.showModal();
}

function renderGallery() {
    galleryGrid.innerHTML = galleryItems
        .map(
            (item, index) => `
                <article class="gallery-card">
                    <button class="gallery-button" type="button" data-gallery-index="${index}">
                        <img class="gallery-image" src="${assetPath(item.file)}" alt="${item.title}">
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

function updateView() {
    const currentUser = getCurrentUser();
    const isLoggedIn = Boolean(currentUser);

    authPanel.classList.toggle("is-hidden", isLoggedIn);
    dashboardPanel.classList.toggle("is-hidden", !isLoggedIn);
    galleryPanel.classList.toggle("is-hidden", !isLoggedIn);

    if (!isLoggedIn) {
        loginStatus.textContent = "Use one of the seeded accounts to enter the prototype.";
        return;
    }

    welcomeLine.textContent = `${currentUser.name} Archive Dashboard`;
    rolePill.textContent = currentUser.role;
    loginStatus.textContent = "";
    renderStats();
    renderMessages();
    renderResources();
    renderGallery();
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = users.find(
        (entry) =>
            entry.email.toLowerCase() === emailInput.value.trim().toLowerCase() &&
            entry.password === passwordInput.value
    );

    if (!user) {
        loginStatus.textContent = "Login failed. Check the seeded credentials list.";
        return;
    }

    setCurrentUser({
        name: user.name,
        email: user.email,
        role: user.role
    });

    passwordInput.value = "";
    updateView();
});

logoutButton.addEventListener("click", () => {
    clearSession();
    passwordInput.value = "hredzak";
    updateView();
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return;
    }

    const title = messageTitle.value.trim();
    const body = messageBody.value.trim();
    if (!title || !body) {
        return;
    }

    const existing = getMessages().reverse();
    existing.push({
        author: currentUser.name,
        role: currentUser.role,
        title,
        body,
        timestamp: new Date().toISOString()
    });
    saveMessages(existing);
    messageForm.reset();
    renderStats();
    renderMessages();
});

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

renderSeededUsers();
renderResources();
renderGallery();
updateView();
