function submitItem(event, key) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const itemName = document.getElementById("item").value.trim();
    const category = document.getElementById("category").value.trim();
    const selectedColors = Array.from(document.querySelectorAll('#color-filter input:checked'))
    .map(cb => cb.value.toLowerCase());
    const description = document.getElementById("description").value.trim();
    const locationInput = document.getElementById("location");
    const location = locationInput ? locationInput.value : "";  
    const date = document.getElementById("date").value.trim();
    const dropoff = document.getElementById("dropoff")?.value.trim() || "Not specified";
    const contactMethod = document.getElementById("contact-method").value.trim();
    const canContact = document.getElementById("can-contact")?.checked || false;
    const verificationTip = document.getElementById("verification-tip")?.value.trim() || "None";
    const file = document.getElementById("photo").files[0];

    // Validate required fields
    if (!name || !email || !itemName || !category || !description || !location || !date) {
        alert("Please fill in all required fields.");
        return;
    }

    // Helper to store the item
    function storeItem(photo) {
        const newItem = {
            name,
            email,
            phone,
            itemName,
            category,
            color: selectedColors.join(', '),
            description,
            photo: photo || "assets/placeholder.png",
            location,
            date,
            dropoff,
            contactMethod,
            canContact,
            verificationTip,
        };

        const items = JSON.parse(localStorage.getItem(key)) || [];
        const exists = items.some(
            (item) =>
                item.itemName === newItem.itemName &&
                item.date === newItem.date &&
                item.location === newItem.location
        );
        if (exists) {
            alert("This item has already been reported.");
            return;
        }

        items.push(newItem);
        localStorage.setItem(key, JSON.stringify(items));

        event.target.reset();
        renderItems(items, "reported-items-container");
        alert(`${key === "lostItems" ? "Lost" : "Found"} item successfully reported!`);
    }

    // Handle image upload or use fallback
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            storeItem(reader.result);
        };
        reader.readAsDataURL(file);
    } else {
        storeItem(null);
    }
}

function renderItems(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<p>No items to display.</p>";
        return;
    }

    items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("reported-item");

        const status = (localStorage.getItem("lostItems") || "").includes(JSON.stringify(item)) ? "lost" : "found";
        const dateLabel = status === "found" ? "Date Found" : "Date Lost";
        const actionLabel = status === "lost" ? "Mark as Found" : "Claim Item";

        itemDiv.innerHTML = `
            <div class="reported-item-inner">
                <div class="reported-item-front">
                    <div class="item-image-wrapper">
                        <img src="${item.photo}" alt="${item.itemName}">
                    </div>
                    <div class="item-front-details">
                        <p class="item-title">${item.itemName}</p>
                        <p class="item-location">${item.location}</p>
                    </div>
                </div>
                <div class="reported-item-back">
                    <h3>${item.itemName}</h3>
                    <p><strong>Category:</strong> ${item.category}</p>
                    <p><strong>${dateLabel}:</strong> ${item.date}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Color:</strong> ${item.color || "Not specified"}</p>
                    <p><strong>Dropoff Location:</strong> ${item.dropoff}</p>
                    <p><strong>Contact Method:</strong> ${item.contactMethod}</p>
                    <p><strong>Verification Tip:</strong> ${item.verificationTip}</p>
                    <button class="action-btn">${actionLabel}</button>
                </div>
            </div>
        `;

        container.appendChild(itemDiv);
    });
}

function applyFilter() {
    const status = document.getElementById("status").value.toLowerCase();
    const category = document.getElementById("categories").value.toLowerCase();
    const selectedColors = Array.from(document.querySelectorAll('#color-filter input:checked'))
        .map(cb => cb.value.toLowerCase());
    const location = document.getElementById("location-filter").value;
    const date = document.getElementById("filter-date").value;

    const lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
    const foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];

    let allItems = [];
    if (status === "lost") {
        allItems = lostItems;
    } else if (status === "found") {
        allItems = foundItems;
    } else {
        allItems = [...lostItems, ...foundItems];
    }

    const filteredItems = allItems.filter((item) => {
        const categoryMatch = category === "all" || item.category.toLowerCase() === category;
        const colorMatch = selectedColors.length === 0 || (item.color && selectedColors.includes(item.color.toLowerCase()));
        const locationMatch = location === "all" || item.location === location;
        const dateMatch = !date || item.date === date;
        return categoryMatch && colorMatch && locationMatch && dateMatch;
    });

    renderItems(filteredItems, "reported-items-container");
}

document.addEventListener("DOMContentLoaded", () => {
    const lostForm = document.getElementById("lost-item-form");
    const foundForm = document.getElementById("found-item-form");

    if (lostForm) {
        lostForm.addEventListener("submit", (event) => submitItem(event, "lostItems"));
    }

    if (foundForm) {
        foundForm.addEventListener("submit", (event) => submitItem(event, "foundItems"));
    }

    const filterButton = document.getElementById("apply-filter-btn");
    if (filterButton) {
        filterButton.addEventListener("click", applyFilter);
    }

    // Render all on index only
    const itemsContainer = document.getElementById("reported-items-container");
    if (itemsContainer) {
        const lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
        const foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
        renderItems([...lostItems, ...foundItems], "reported-items-container");
    }
});