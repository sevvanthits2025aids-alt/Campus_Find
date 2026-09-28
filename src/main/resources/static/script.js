console.log("CampusFind script loaded successfully");

const API = "http://localhost:8080";


// ======================================================
// SHOW SECTION
// ======================================================

function showSection(sectionId) {

    document.querySelectorAll(".content-section").forEach(section => {
        section.classList.remove("active-section");
    });

    const section = document.getElementById(sectionId);

    if (section) {
        section.classList.add("active-section");
    }

    const titles = {
        dashboard: "Dashboard",
        users: "Users",
        "add-user": "Add User",
        categories: "Categories",
        "add-category": "Add Category",
        "lost-reports": "Lost Reports",
        "add-lost": "Report Lost Item",
        "found-items": "Found Items",
        "add-found": "Report Found Item"
    };

    const descriptions = {
        dashboard: "Campus Lost & Found Management System",
        users: "Manage students, staff and admins.",
        "add-user": "Create a new CampusFind user.",
        categories: "Manage item categories.",
        "add-category": "Create a new item category.",
        "lost-reports": "View all reported lost items.",
        "add-lost": "Enter details about the lost item.",
        "found-items": "View and manage found items.",
        "add-found": "Enter details about the found item."
    };

    const pageTitle = document.getElementById("pageTitle");
    const pageDescription = document.getElementById("pageDescription");

    if (pageTitle) {
        pageTitle.textContent = titles[sectionId] || "CampusFind";
    }

    if (pageDescription) {
        pageDescription.textContent = descriptions[sectionId] || "";
    }

    if (sectionId === "dashboard") {
        loadDashboard();
    }

    if (sectionId === "users") {
        loadUsers();
    }

    if (sectionId === "categories") {
        loadCategories();
    }

    if (sectionId === "lost-reports") {
        loadLostReports();
    }

    if (sectionId === "found-items") {
        loadFoundItems();
    }
}


// ======================================================
// SIDEBAR DROPDOWN
// ======================================================

document.querySelectorAll(".dropdown-btn").forEach(button => {

    button.addEventListener("click", function () {

        const group = this.parentElement;
        const submenu = group.querySelector(".submenu");
        const arrow = group.querySelector(".arrow");

        document.querySelectorAll(".menu-group").forEach(otherGroup => {

            if (otherGroup !== group) {

                const otherSubmenu =
                    otherGroup.querySelector(".submenu");

                const otherArrow =
                    otherGroup.querySelector(".arrow");

                if (otherSubmenu) {
                    otherSubmenu.classList.remove("open");
                }

                if (otherArrow) {
                    otherArrow.classList.remove("rotate");
                }
            }
        });

        if (submenu) {
            submenu.classList.toggle("open");
        }

        if (arrow) {
            arrow.classList.toggle("rotate");
        }
    });
});


// ======================================================
// SUBMENU BUTTONS
// ======================================================

document.querySelectorAll(".submenu-item").forEach(button => {

    button.addEventListener("click", function () {

        const section = this.getAttribute("data-section");

        if (section) {
            showSection(section);
        }
    });
});


// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const usersResponse =
            await fetch(API + "/users");

        const categoriesResponse =
            await fetch(API + "/categories");

        const lostResponse =
            await fetch(API + "/lost-reports");

        const foundResponse =
            await fetch(API + "/found-items");


        const users = await usersResponse.json();
        const categories = await categoriesResponse.json();
        const lostReports = await lostResponse.json();
        const foundItems = await foundResponse.json();


        const userCount =
            document.getElementById("userCount");

        const categoryCount =
            document.getElementById("categoryCount");

        const lostCount =
            document.getElementById("lostCount");

        const foundCount =
            document.getElementById("foundCount");


        if (userCount) {
            userCount.textContent = users.length;
        }

        if (categoryCount) {
            categoryCount.textContent = categories.length;
        }

        if (lostCount) {
            lostCount.textContent = lostReports.length;
        }

        if (foundCount) {
            foundCount.textContent = foundItems.length;
        }

    } catch (error) {

        console.error("Dashboard error:", error);

    }
}


// ======================================================
// USERS - LOAD
// ======================================================

async function loadUsers() {

    try {

        const response =
            await fetch(API + "/users");

        if (!response.ok) {
            throw new Error("Unable to load users");
        }

        const users = await response.json();

        const table =
            document.getElementById("usersTable");

        if (!table) return;

        table.innerHTML = "";

        if (users.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        No users found
                    </td>
                </tr>
            `;

            return;
        }


        users.forEach(user => {

            table.innerHTML += `
                <tr>

                    <td>${user.id}</td>

                    <td>${user.name || "-"}</td>

                    <td>${user.email || "-"}</td>

                    <td>
                        <span class="badge">
                            ${user.role || "-"}
                        </span>
                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editUser(${user.id})">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteUser(${user.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error("Users error:", error);

    }
}


// ======================================================
// USERS - SAVE
// ======================================================

const userForm =
    document.getElementById("userForm");

if (userForm) {

    userForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const id =
            document.getElementById("userId").value;

        const user = {

            name:
                document.getElementById("userName").value.trim(),

            email:
                document.getElementById("userEmail").value.trim(),

            password:
            document.getElementById("userPassword").value,

            role:
            document.getElementById("userRole").value
        };


        try {

            const url =
                id
                    ? `${API}/users/${id}`
                    : `${API}/users`;

            const method =
                id ? "PUT" : "POST";


            const response =
                await fetch(url, {

                    method: method,

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(user)
                });


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText || "User save failed"
                );
            }


            alert(
                id
                    ? "User updated successfully!"
                    : "User added successfully!"
            );


            resetUserForm();

            await loadUsers();
            await loadDashboard();

            showSection("users");


        } catch (error) {

            console.error("USER ERROR:", error);

            alert(
                "Unable to save user.\n\n" +
                error.message
            );
        }

    });
}


// ======================================================
// USERS - EDIT
// ======================================================

async function editUser(id) {

    try {

        const response =
            await fetch(`${API}/users/${id}`);

        if (!response.ok) {
            throw new Error("Unable to load user");
        }

        const user =
            await response.json();


        document.getElementById("userId").value =
            user.id;

        document.getElementById("userName").value =
            user.name || "";

        document.getElementById("userEmail").value =
            user.email || "";

        document.getElementById("userPassword").value =
            user.password || "";

        document.getElementById("userRole").value =
            user.role || "";


        showSection("add-user");


    } catch (error) {

        console.error(error);

        alert("Unable to load user.");

    }
}


// ======================================================
// USERS - DELETE
// ======================================================

async function deleteUser(id) {

    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/users/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error("Delete failed");
        }


        alert("User deleted successfully!");

        await loadUsers();
        await loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete user.\n\n" +
            error.message
        );
    }
}


// ======================================================
// USERS - RESET
// ======================================================

function resetUserForm() {

    const form =
        document.getElementById("userForm");

    const id =
        document.getElementById("userId");

    if (form) {
        form.reset();
    }

    if (id) {
        id.value = "";
    }
}


// ======================================================
// CATEGORIES - LOAD
// ======================================================

async function loadCategories() {

    try {

        const response =
            await fetch(API + "/categories");

        if (!response.ok) {
            throw new Error("Unable to load categories");
        }

        const categories =
            await response.json();

        const table =
            document.getElementById("categoriesTable");

        if (!table) return;

        table.innerHTML = "";


        if (categories.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="3" class="empty">
                        No categories found
                    </td>
                </tr>
            `;

            return;
        }


        categories.forEach(category => {

            table.innerHTML += `
                <tr>

                    <td>${category.id}</td>

                    <td>${category.name || "-"}</td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editCategory(${category.id})">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteCategory(${category.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `;
        });


    } catch (error) {

        console.error(
            "Category error:",
            error
        );
    }
}


// ======================================================
// CATEGORY - SAVE
// ======================================================

const categoryForm =
    document.getElementById("categoryForm");

if (categoryForm) {

    categoryForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("categoryId").value;

        const name =
            document.getElementById("categoryName").value.trim();


        if (!name) {

            alert("Please enter category name.");

            return;
        }


        try {

            const url =
                id
                    ? `${API}/categories/${id}`
                    : `${API}/categories`;

            const method =
                id ? "PUT" : "POST";


            const response =
                await fetch(url, {

                    method: method,

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name
                    })
                });


            if (!response.ok) {
                throw new Error("Category save failed");
            }


            alert(
                id
                    ? "Category updated successfully!"
                    : "Category added successfully!"
            );


            resetCategoryForm();

            await loadCategories();
            await loadDashboard();

            showSection("categories");


        } catch (error) {

            console.error(error);

            alert(
                "Unable to save category.\n\n" +
                error.message
            );
        }

    });
}


// ======================================================
// CATEGORY - EDIT
// ======================================================

async function editCategory(id) {

    try {

        const response =
            await fetch(`${API}/categories/${id}`);

        if (!response.ok) {
            throw new Error("Unable to load category");
        }

        const category =
            await response.json();


        document.getElementById("categoryId").value =
            category.id;

        document.getElementById("categoryName").value =
            category.name || "";


        showSection("add-category");


    } catch (error) {

        console.error(error);

        alert("Unable to load category.");

    }
}


// ======================================================
// CATEGORY - DELETE
// ======================================================

async function deleteCategory(id) {

    if (!confirm("Delete this category?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/categories/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error("Delete failed");
        }


        alert("Category deleted successfully!");

        await loadCategories();
        await loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete category.\n\n" +
            error.message
        );
    }
}


// ======================================================
// CATEGORY - RESET
// ======================================================

function resetCategoryForm() {

    const form =
        document.getElementById("categoryForm");

    const id =
        document.getElementById("categoryId");

    if (form) {
        form.reset();
    }

    if (id) {
        id.value = "";
    }
}


// ======================================================
// LOST REPORTS - LOAD
// ======================================================

async function loadLostReports() {

    try {

        const response =
            await fetch(API + "/lost-reports");

        if (!response.ok) {
            throw new Error("Unable to load lost reports");
        }

        const reports =
            await response.json();

        const table =
            document.getElementById("lostTable");

        if (!table) return;

        table.innerHTML = "";


        if (reports.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="7" class="empty">
                        No lost reports found
                    </td>
                </tr>
            `;

            return;
        }


        reports.forEach(report => {

            table.innerHTML += `
                <tr>

                    <td>${report.id}</td>

                    <td>${report.description || "-"}</td>

                    <td>${report.brand || "-"}</td>

                    <td>${report.color || "-"}</td>

                    <td>${report.location || "-"}</td>

                    <td>${report.date || "-"}</td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editLost(${report.id})">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteLost(${report.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `;
        });


    } catch (error) {

        console.error(
            "Lost report error:",
            error
        );
    }
}


// ======================================================
// LOST REPORT - SAVE
// ======================================================

const lostForm =
    document.getElementById("lostForm");

if (lostForm) {

    lostForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("lostId").value;


        const categoryId =
            Number(
                document.getElementById("lostCategory").value
            );


        const userId =
            Number(
                document.getElementById("lostUser").value
            );


        const report = {

            description:
                document
                    .getElementById("lostDescription")
                    .value
                    .trim(),

            brand:
                document
                    .getElementById("lostBrand")
                    .value
                    .trim(),

            color:
                document
                    .getElementById("lostColor")
                    .value
                    .trim(),

            identifyingDetails:
                document
                    .getElementById("lostDetails")
                    .value
                    .trim(),

            location:
                document
                    .getElementById("lostLocation")
                    .value
                    .trim(),

            date:
            document
                .getElementById("lostDate")
                .value,

            category: {
                id: categoryId
            },

            user: {
                id: userId
            }
        };


        console.log(
            "Sending Lost Report:",
            report
        );


        try {

            const url =
                id
                    ? `${API}/lost-reports/${id}`
                    : `${API}/lost-reports`;

            const method =
                id ? "PUT" : "POST";


            const response =
                await fetch(url, {

                    method: method,

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(report)
                });


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Lost report save failed"
                );
            }


            alert(
                id
                    ? "Lost report updated successfully!"
                    : "Lost report added successfully!"
            );


            resetLostForm();

            await loadLostReports();
            await loadDashboard();

            showSection("lost-reports");


        } catch (error) {

            console.error(
                "LOST REPORT ERROR:",
                error
            );

            alert(
                "Unable to save lost report.\n\n" +
                error.message
            );
        }

    });
}


// ======================================================
// LOST REPORT - EDIT
// ======================================================

async function editLost(id) {

    try {

        const response =
            await fetch(`${API}/lost-reports/${id}`);

        if (!response.ok) {
            throw new Error("Unable to load lost report");
        }

        const report =
            await response.json();


        document.getElementById("lostId").value =
            report.id;

        document.getElementById("lostDescription").value =
            report.description || "";

        document.getElementById("lostBrand").value =
            report.brand || "";

        document.getElementById("lostColor").value =
            report.color || "";

        document.getElementById("lostDetails").value =
            report.identifyingDetails || "";

        document.getElementById("lostLocation").value =
            report.location || "";

        document.getElementById("lostDate").value =
            report.date || "";


        document.getElementById("lostCategory").value =
            report.category
                ? report.category.id
                : "";


        document.getElementById("lostUser").value =
            report.user
                ? report.user.id
                : "";


        showSection("add-lost");


    } catch (error) {

        console.error(error);

        alert("Unable to load lost report.");

    }
}


// ======================================================
// LOST REPORT - DELETE
// ======================================================

async function deleteLost(id) {

    if (!confirm("Delete this lost report?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/lost-reports/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error("Delete failed");
        }


        alert("Lost report deleted successfully!");

        await loadLostReports();
        await loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete lost report.\n\n" +
            error.message
        );
    }
}


// ======================================================
// LOST REPORT - RESET
// ======================================================

function resetLostForm() {

    const form =
        document.getElementById("lostForm");

    const id =
        document.getElementById("lostId");

    if (form) {
        form.reset();
    }

    if (id) {
        id.value = "";
    }
}


// ======================================================
// FOUND ITEMS - LOAD
// ======================================================

async function loadFoundItems() {

    try {

        const response =
            await fetch(API + "/found-items");

        if (!response.ok) {
            throw new Error("Unable to load found items");
        }

        const items =
            await response.json();

        const table =
            document.getElementById("foundTable");

        if (!table) return;

        table.innerHTML = "";


        if (items.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="7" class="empty">
                        No found items found
                    </td>
                </tr>
            `;

            return;
        }


        items.forEach(item => {

            const status =
                item.status || "AVAILABLE";


            let actions = "";


            if (status === "AVAILABLE") {

                actions = `

                    <button
                        class="claim-btn"
                        onclick="claimFoundItem(${item.id})">
                        Claim
                    </button>

                    <button
                        class="edit-btn"
                        onclick="editFound(${item.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteFound(${item.id})">
                        Delete
                    </button>

                `;

            } else if (status === "CLAIMED") {

                actions = `

                    <button
                        class="return-btn"
                        onclick="returnFoundItem(${item.id})">
                        Return
                    </button>

                    <button
                        class="edit-btn"
                        onclick="editFound(${item.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteFound(${item.id})">
                        Delete
                    </button>

                `;

            } else if (status === "RETURNED") {

                actions = `

                    <span class="returned-text">
                        Returned
                    </span>

                    <button
                        class="delete-btn"
                        onclick="deleteFound(${item.id})">
                        Delete
                    </button>

                `;
            }


            table.innerHTML += `
                <tr>

                    <td>${item.id}</td>

                    <td>${item.description || "-"}</td>

                    <td>${item.brand || "-"}</td>

                    <td>${item.color || "-"}</td>

                    <td>${item.location || "-"}</td>

                    <td>
                        <span class="status-badge ${status}">
                            ${status}
                        </span>
                    </td>

                    <td class="action-buttons">
                        ${actions}
                    </td>

                </tr>
            `;
        });


    } catch (error) {

        console.error(
            "Found item error:",
            error
        );
    }
}


// ======================================================
// FOUND ITEM - SAVE
// ======================================================

const foundForm =
    document.getElementById("foundForm");

if (foundForm) {

    foundForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("foundId").value;


        const categoryId =
            Number(
                document.getElementById("foundCategory").value
            );


        const userId =
            Number(
                document.getElementById("foundUser").value
            );


        const item = {

            description:
                document
                    .getElementById("foundDescription")
                    .value
                    .trim(),

            brand:
                document
                    .getElementById("foundBrand")
                    .value
                    .trim(),

            color:
                document
                    .getElementById("foundColor")
                    .value
                    .trim(),

            identifyingDetails:
                document
                    .getElementById("foundDetails")
                    .value
                    .trim(),

            location:
                document
                    .getElementById("foundLocation")
                    .value
                    .trim(),

            date:
            document
                .getElementById("foundDate")
                .value,

            category: {
                id: categoryId
            },

            user: {
                id: userId
            }
        };


        console.log(
            "Sending Found Item:",
            item
        );


        try {

            const url =
                id
                    ? `${API}/found-items/${id}`
                    : `${API}/found-items`;

            const method =
                id ? "PUT" : "POST";


            const response =
                await fetch(url, {

                    method: method,

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(item)
                });


            const responseText =
                await response.text();


            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Found item save failed"
                );
            }


            alert(
                id
                    ? "Found item updated successfully!"
                    : "Found item added successfully!"
            );


            resetFoundForm();

            await loadFoundItems();
            await loadDashboard();

            showSection("found-items");


        } catch (error) {

            console.error(
                "FOUND ITEM ERROR:",
                error
            );

            alert(
                "Unable to save found item.\n\n" +
                error.message
            );
        }

    });
}


// ======================================================
// FOUND ITEM - EDIT
// ======================================================

async function editFound(id) {

    try {

        const response =
            await fetch(`${API}/found-items/${id}`);

        if (!response.ok) {
            throw new Error("Unable to load found item");
        }

        const item =
            await response.json();


        document.getElementById("foundId").value =
            item.id;

        document.getElementById("foundDescription").value =
            item.description || "";

        document.getElementById("foundBrand").value =
            item.brand || "";

        document.getElementById("foundColor").value =
            item.color || "";

        document.getElementById("foundDetails").value =
            item.identifyingDetails || "";

        document.getElementById("foundLocation").value =
            item.location || "";

        document.getElementById("foundDate").value =
            item.date || "";


        document.getElementById("foundCategory").value =
            item.category
                ? item.category.id
                : "";


        document.getElementById("foundUser").value =
            item.user
                ? item.user.id
                : "";


        showSection("add-found");


    } catch (error) {

        console.error(error);

        alert("Unable to load found item.");

    }
}


// ======================================================
// FOUND ITEM - DELETE
// ======================================================

async function deleteFound(id) {

    if (!confirm("Delete this found item?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/found-items/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error("Delete failed");
        }


        alert("Found item deleted successfully!");

        await loadFoundItems();
        await loadDashboard();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete found item.\n\n" +
            error.message
        );
    }
}


// ======================================================
// FOUND ITEM - CLAIM
// ======================================================

async function claimFoundItem(id) {

    if (!confirm("Do you want to claim this item?")) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/found-items/${id}/status?status=CLAIMED`,
                {
                    method: "PUT"
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Claim failed"
            );
        }


        alert("Item claimed successfully!");

        await loadFoundItems();
        await loadDashboard();


    } catch (error) {

        console.error(
            "CLAIM ERROR:",
            error
        );


        alert(
            "Unable to claim item.\n\n" +
            error.message
        );
    }
}


// ======================================================
// FOUND ITEM - RETURN
// ======================================================

async function returnFoundItem(id) {

    if (
        !confirm(
            "Do you want to mark this item as returned?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/found-items/${id}/status?status=RETURNED`,
                {
                    method: "PUT"
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            throw new Error(
                responseText ||
                "Return failed"
            );
        }


        alert("Item returned successfully!");

        await loadFoundItems();
        await loadDashboard();


    } catch (error) {

        console.error(
            "RETURN ERROR:",
            error
        );


        alert(
            "Unable to return item.\n\n" +
            error.message
        );
    }
}


// ======================================================
// FOUND ITEM - RESET
// ======================================================

function resetFoundForm() {

    const form =
        document.getElementById("foundForm");

    const id =
        document.getElementById("foundId");

    if (form) {
        form.reset();
    }

    if (id) {
        id.value = "";
    }
}


// ======================================================
// INITIAL LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function() {

    showSection("dashboard");

    loadDashboard();

});