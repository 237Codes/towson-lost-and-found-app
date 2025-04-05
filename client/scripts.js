function submitItem(event, key) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const itemName = document.getElementById("item").value.trim();
    const category = document.getElementById("category").value.trim();
    const color = document.getElementById("color").value.trim();
    const description = document.getElementById("description").value.trim();
    const photo = document.getElementById("photo").files[0]
        ? URL.createObjectURL(document.getElementById("photo").files[0])
        : "assets/placeholder.png";
    const location = document.getElementById("location").value.trim();
    const date = document.getElementById("date").value.trim();
    const dropoff = document.getElementById("dropoff")?.value.trim() || "Not specified";
    const contactMethod = document.getElementById("contact-method").value.trim();
    const canContact = document.getElementById("can-contact")?.checked || false;
    const verificationTip = document.getElementById("verification-tip")?.value.trim() || "None";

    if (!name || !email || !itemName || !category || !description || !location || !date) {
        alert("Please fill in all required fields.");
        return;
    }

    const newItem = {
        name,
        email,
        phone,
        itemName,
        category,
        color,
        description,
        photo,
        location,
        date,
        dropoff,
        contactMethod,
        canContact,
        verificationTip,
    };

    const items = JSON.parse(localStorage.getItem(key)) || [];

    const exists = items.some(
        (item) => item.itemName === newItem.itemName && item.date === newItem.date && item.location === newItem.location
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

function renderItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<p>No items to display.</p>";
        return;
    }

    items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("reported-item");
        itemDiv.innerHTML = `
            <h3>${item.itemName}</h3>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Date Found:</strong> ${item.date}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Color:</strong> ${item.color || "Not specified"}</p>
            <p><strong>Dropoff Location:</strong> ${item.dropoff}</p>
            <p><strong>Contact Method:</strong> ${item.contactMethod}</p>
            <p><strong>Verification Tip:</strong> ${item.verificationTip}</p>
            <img src="${item.photo}" alt="Uploaded photo" style="max-width: 100px; max-height: 100px;">
        `;
        container.appendChild(itemDiv);
    });
}

function applyFilter() {
    const category = document.getElementById("categories").value.toLowerCase();
    const date = document.getElementById("filter-found").value;

    const lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
    const foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
    const allItems = [...lostItems, ...foundItems];

    const filteredItems = allItems.filter((item) => {
        const categoryMatch = category === "all" || item.category.toLowerCase() === category;
        const dateMatch = !date || item.date === date;
        return categoryMatch && dateMatch;
    });

    renderItems(filteredItems, "reported-items-container");
}

document.addEventListener("DOMContentLoaded", () => {
    const lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
    const foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
    renderItems([...lostItems, ...foundItems], "reported-items-container");

    const filterButton = document.getElementById("apply-filter-btn");
    if (filterButton) {
        filterButton.addEventListener("click", applyFilter);
    }
});

if (document.getElementById("lost-item-form")) {
    document.getElementById("lost-item-form").addEventListener("submit", (event) =>
        submitItem(event, "lostItems")
    );
}

if (document.getElementById("found-item-form")) {
    document.getElementById("found-item-form").addEventListener("submit", (event) =>
        submitItem(event, "foundItems")
    );
}