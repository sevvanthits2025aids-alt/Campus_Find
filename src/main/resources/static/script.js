// =====================================================
// NAVIGATION
// =====================================================

function showSection(sectionId, button) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");


    const buttons = document.querySelectorAll(".menu-btn");

    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }


    if (sectionId === "users") {
        loadUsers();
    }

    if (sectionId === "categories") {
        loadCategories();
    }

    if (sectionId === "lost") {
        loadCategoriesForForms();
        loadUsersForForms();
        loadLostReports();
    }

    if (sectionId === "found") {
        loadCategoriesForForms();
        loadUsersForForms();
        loadFoundItems();
    }

    if (sectionId === "dashboard") {
        loadDashboard();
    }
}


// =====================================================
// DASHBOARD
// =====================================================

function loadDashboard() {

    fetch("/users")
        .then(response => response.json())
        .then(data => {
            document.getElementById("userCount").innerText = data.length;
        });


    fetch("/categories")
        .then(response => response.json())
        .then(data => {
            document.getElementById("categoryCount").innerText = data.length;
        });


    fetch("/lost-reports")
        .then(response => response.json())
        .then(data => {
            document.getElementById("lostCount").innerText = data.length;
        });


    fetch("/found-items")
        .then(response => response.json())
        .then(data => {
            document.getElementById("foundCount").innerText = data.length;
        });
}


// =====================================================
// USERS - ADD / UPDATE
// =====================================================

function saveUser() {

    const id = document.getElementById("userId").value;

    const user = {

        name: document.getElementById("userName").value,

        email: document.getElementById("userEmail").value,

        password: document.getElementById("userPassword").value,

        role: document.getElementById("userRole").value
    };


    if (!user.name ||
        !user.email ||
        !user.password ||
        !user.role) {

        alert("Please fill all user fields");

        return;
    }


    let url = "/users";

    let method = "POST";


    if (id) {

        url = `/users/${id}`;

        method = "PUT";
    }


    fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)

    })
        .then(response => {

            if (!response.ok) {
                throw new Error("User operation failed");
            }

            return response.json();
        })

        .then(data => {

            alert(
                id
                    ? "User updated successfully!"
                    : "User added successfully!"
            );

            clearUserForm();

            loadUsers();

            loadDashboard();
        })

        .catch(error => {

            console.error(error);

            alert("Error saving user");
        });
}


// =====================================================
// USERS - VIEW
// =====================================================

function loadUsers() {

    fetch("/users")

        .then(response => response.json())

        .then(users => {

            let html = "";


            if (users.length === 0) {

                html = `
                    <div class="empty-message">
                        No users found
                    </div>
                `;

            } else {

                html = `
                    <table class="data-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>
                `;


                users.forEach(user => {

                    html += `

                        <tr>

                            <td>${user.id}</td>

                            <td>${user.name}</td>

                            <td>${user.email}</td>

                            <td>${user.role}</td>

                            <td>

                                <button class="edit-btn"
                                    onclick="editUser(
                                        ${user.id},
                                        '${escapeText(user.name)}',
                                        '${escapeText(user.email)}',
                                        '${escapeText(user.password)}',
                                        '${user.role}'
                                    )">
                                    Edit
                                </button>

                                <button class="delete-btn"
                                    onclick="deleteUser(${user.id})">
                                    Delete
                                </button>

                            </td>

                        </tr>

                    `;
                });


                html += `
                        </tbody>
                    </table>
                `;
            }


            document.getElementById("userList").innerHTML = html;
        });
}


// =====================================================
// USERS - EDIT
// =====================================================

function editUser(id, name, email, password, role) {

    document.getElementById("userId").value = id;

    document.getElementById("userName").value = name;

    document.getElementById("userEmail").value = email;

    document.getElementById("userPassword").value = password;

    document.getElementById("userRole").value = role;


    document.getElementById("userFormTitle").innerText =
        "Update User";


    document.querySelector("#users .primary-btn").innerText =
        "Update User";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// USERS - DELETE
// =====================================================

function deleteUser(id) {

    if (!confirm("Are you sure you want to delete this user?")) {
        return;
    }


    fetch(`/users/${id}`, {

        method: "DELETE"

    })

        .then(response => {

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            return response.text();
        })

        .then(data => {

            alert("User deleted successfully!");

            loadUsers();

            loadDashboard();
        })

        .catch(error => {

            console.error(error);

            alert("Error deleting user");
        });
}


// =====================================================
// USERS - CLEAR
// =====================================================

function clearUserForm() {

    document.getElementById("userId").value = "";

    document.getElementById("userName").value = "";

    document.getElementById("userEmail").value = "";

    document.getElementById("userPassword").value = "";

    document.getElementById("userRole").value = "";


    document.getElementById("userFormTitle").innerText =
        "Add New User";


    document.querySelector("#users .primary-btn").innerText =
        "Add User";
}


// =====================================================
// CATEGORY - ADD / UPDATE
// =====================================================

function saveCategory() {

    const id = document.getElementById("categoryId").value;

    const category = {

        name:
        document.getElementById("categoryName").value
    };


    if (!category.name) {

        alert("Please enter category name");

        return;
    }


    let url = "/categories";

    let method = "POST";


    if (id) {

        url = `/categories/${id}`;

        method = "PUT";
    }


    fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(category)

    })

        .then(response => response.json())

        .then(data => {

            alert(
                id
                    ? "Category updated successfully!"
                    : "Category added successfully!"
            );

            clearCategoryForm();

            loadCategories();

            loadDashboard();
        })

        .catch(error => {

            console.error(error);

            alert("Error saving category");
        });
}


// =====================================================
// CATEGORY - VIEW
// =====================================================

function loadCategories() {

    fetch("/categories")

        .then(response => response.json())

        .then(categories => {

            let html = "";


            if (categories.length === 0) {

                html = `
                    <div class="empty-message">
                        No categories found
                    </div>
                `;

            } else {

                html = `
                    <table class="data-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>
                `;


                categories.forEach(category => {

                    html += `

                        <tr>

                            <td>${category.id}</td>

                            <td>${category.name}</td>

                            <td>

                                <button class="edit-btn"
                                    onclick="editCategory(
                                        ${category.id},
                                        '${escapeText(category.name)}'
                                    )">
                                    Edit
                                </button>

                                <button class="delete-btn"
                                    onclick="deleteCategory(${category.id})">
                                    Delete
                                </button>

                            </td>

                        </tr>

                    `;
                });


                html += `
                        </tbody>
                    </table>
                `;
            }


            document.getElementById("categoryList").innerHTML =
                html;
        });
}


// =====================================================
// CATEGORY - EDIT
// =====================================================

function editCategory(id, name) {

    document.getElementById("categoryId").value = id;

    document.getElementById("categoryName").value = name;


    document.getElementById("categoryFormTitle").innerText =
        "Update Category";


    document.querySelector("#categories .primary-btn").innerText =
        "Update Category";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// CATEGORY - DELETE
// =====================================================

function deleteCategory(id) {

    if (!confirm("Are you sure you want to delete this category?")) {
        return;
    }


    fetch(`/categories/${id}`, {

        method: "DELETE"

    })

        .then(response => response.text())

        .then(data => {

            alert("Category deleted successfully!");

            loadCategories();

            loadDashboard();

        })

        .catch(error => {

            console.error(error);

            alert("Error deleting category");
        });
}


// =====================================================
// CATEGORY - CLEAR
// =====================================================

function clearCategoryForm() {

    document.getElementById("categoryId").value = "";

    document.getElementById("categoryName").value = "";


    document.getElementById("categoryFormTitle").innerText =
        "Add New Category";


    document.querySelector("#categories .primary-btn").innerText =
        "Add Category";
}


// =====================================================
// LOAD USERS INTO DROPDOWN
// =====================================================

function loadUsersForForms() {

    fetch("/users")

        .then(response => response.json())

        .then(users => {

            const lostSelect =
                document.getElementById("lostUser");

            const foundSelect =
                document.getElementById("foundUser");


            let options = `
                <option value="">
                    Select User
                </option>
            `;


            users.forEach(user => {

                options += `
                    <option value="${user.id}">
                        ${user.name} - ${user.role}
                    </option>
                `;
            });


            lostSelect.innerHTML = options;

            foundSelect.innerHTML = options;
        });
}


// =====================================================
// LOAD CATEGORIES INTO DROPDOWN
// =====================================================

function loadCategoriesForForms() {

    fetch("/categories")

        .then(response => response.json())

        .then(categories => {

            const lostSelect =
                document.getElementById("lostCategory");

            const foundSelect =
                document.getElementById("foundCategory");


            let options = `
                <option value="">
                    Select Category
                </option>
            `;


            categories.forEach(category => {

                options += `
                    <option value="${category.id}">
                        ${category.name}
                    </option>
                `;
            });


            lostSelect.innerHTML = options;

            foundSelect.innerHTML = options;
        });
}


// =====================================================
// LOST REPORT - ADD / UPDATE
// =====================================================

function saveLostReport() {

    const id =
        document.getElementById("lostId").value;


    const lostReport = {

        description:
        document.getElementById("lostDescription").value,

        location:
        document.getElementById("lostLocation").value,

        date:
        document.getElementById("lostDate").value,

        category: {

            id:
            document.getElementById("lostCategory").value
        },

        user: {

            id:
            document.getElementById("lostUser").value
        }
    };


    if (
        !lostReport.description ||
        !lostReport.location ||
        !lostReport.date ||
        !lostReport.category.id ||
        !lostReport.user.id
    ) {

        alert("Please fill all lost report fields");

        return;
    }


    let url = "/lost-reports";

    let method = "POST";


    if (id) {

        url = `/lost-reports/${id}`;

        method = "PUT";
    }


    fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(lostReport)

    })

        .then(response => response.json())

        .then(data => {

            alert(
                id
                    ? "Lost report updated successfully!"
                    : "Lost report added successfully!"
            );

            clearLostForm();

            loadLostReports();

            loadDashboard();
        })

        .catch(error => {

            console.error(error);

            alert("Error saving lost report");
        });
}


// =====================================================
// LOST REPORT - VIEW
// =====================================================

function loadLostReports() {

    fetch("/lost-reports")

        .then(response => response.json())

        .then(reports => {

            let html = "";


            if (reports.length === 0) {

                html = `
                    <div class="empty-message">
                        No lost reports found
                    </div>
                `;

            } else {

                html = `
                    <table class="data-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Description</th>

                                <th>Location</th>

                                <th>Date</th>

                                <th>Category</th>

                                <th>User</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>
                `;


                reports.forEach(report => {

                    html += `

                        <tr>

                            <td>${report.id}</td>

                            <td>${report.description}</td>

                            <td>${report.location}</td>

                            <td>${report.date}</td>

                            <td>
                                ${report.category
                        ? report.category.name
                        : "-"}
                            </td>

                            <td>
                                ${report.user
                        ? report.user.name
                        : "-"}
                            </td>

                            <td>

                                <button class="edit-btn"
                                    onclick='editLostReport(${JSON.stringify(report)})'>
                                    Edit
                                </button>

                                <button class="delete-btn"
                                    onclick="deleteLostReport(${report.id})">
                                    Delete
                                </button>

                            </td>

                        </tr>

                    `;
                });


                html += `
                        </tbody>
                    </table>
                `;
            }


            document.getElementById("lostList").innerHTML =
                html;
        });
}


// =====================================================
// LOST REPORT - EDIT
// =====================================================

function editLostReport(report) {

    document.getElementById("lostId").value =
        report.id;

    document.getElementById("lostDescription").value =
        report.description;

    document.getElementById("lostLocation").value =
        report.location;

    document.getElementById("lostDate").value =
        report.date;

    document.getElementById("lostCategory").value =
        report.category.id;

    document.getElementById("lostUser").value =
        report.user.id;


    document.getElementById("lostFormTitle").innerText =
        "Update Lost Report";


    document.querySelector("#lost .primary-btn").innerText =
        "Update Lost Report";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// LOST REPORT - DELETE
// =====================================================

function deleteLostReport(id) {

    if (!confirm("Are you sure you want to delete this lost report?")) {
        return;
    }


    fetch(`/lost-reports/${id}`, {

        method: "DELETE"

    })

        .then(response => response.text())

        .then(data => {

            alert("Lost report deleted successfully!");

            loadLostReports();

            loadDashboard();

        })

        .catch(error => {

            console.error(error);

            alert("Error deleting lost report");
        });
}


// =====================================================
// LOST REPORT - CLEAR
// =====================================================

function clearLostForm() {

    document.getElementById("lostId").value = "";

    document.getElementById("lostDescription").value = "";

    document.getElementById("lostLocation").value = "";

    document.getElementById("lostDate").value = "";

    document.getElementById("lostCategory").value = "";

    document.getElementById("lostUser").value = "";


    document.getElementById("lostFormTitle").innerText =
        "Add Lost Report";


    document.querySelector("#lost .primary-btn").innerText =
        "Add Lost Report";
}


// =====================================================
// FOUND ITEM - ADD / UPDATE
// =====================================================

function saveFoundItem() {

    const id =
        document.getElementById("foundId").value;


    const foundItem = {

        description:
        document.getElementById("foundDescription").value,

        location:
        document.getElementById("foundLocation").value,

        date:
        document.getElementById("foundDate").value,

        category: {

            id:
            document.getElementById("foundCategory").value
        },

        user: {

            id:
            document.getElementById("foundUser").value
        }
    };


    if (
        !foundItem.description ||
        !foundItem.location ||
        !foundItem.date ||
        !foundItem.category.id ||
        !foundItem.user.id
    ) {

        alert("Please fill all found item fields");

        return;
    }


    let url = "/found-items";

    let method = "POST";


    if (id) {

        url = `/found-items/${id}`;

        method = "PUT";
    }


    fetch(url, {

        method: method,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(foundItem)

    })

        .then(response => response.json())

        .then(data => {

            alert(
                id
                    ? "Found item updated successfully!"
                    : "Found item added successfully!"
            );

            clearFoundForm();

            loadFoundItems();

            loadDashboard();
        })

        .catch(error => {

            console.error(error);

            alert("Error saving found item");
        });
}


// =====================================================
// FOUND ITEM - VIEW
// =====================================================

function loadFoundItems() {

    fetch("/found-items")

        .then(response => response.json())

        .then(items => {

            let html = "";


            if (items.length === 0) {

                html = `
                    <div class="empty-message">
                        No found items available
                    </div>
                `;

            } else {

                html = `
                    <table class="data-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Description</th>

                                <th>Location</th>

                                <th>Date</th>

                                <th>Category</th>

                                <th>User</th>

                                <th>Status</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>
                `;


                items.forEach(item => {

                    html += `

                        <tr>

                            <td>${item.id}</td>

                            <td>${item.description}</td>

                            <td>${item.location}</td>

                            <td>${item.date}</td>

                            <td>
                                ${item.category
                        ? item.category.name
                        : "-"}
                            </td>

                            <td>
                                ${item.user
                        ? item.user.name
                        : "-"}
                            </td>

                            <td>

                                <span class="status status-${item.status.toLowerCase()}">

                                    ${item.status}

                                </span>

                            </td>

                            <td>

                                <button class="edit-btn"
                                    onclick='editFoundItem(${JSON.stringify(item)})'>
                                    Edit
                                </button>

                                <button class="delete-btn"
                                    onclick="deleteFoundItem(${item.id})">
                                    Delete
                                </button>

                                ${
                        item.status === "AVAILABLE"
                            ? `
                                            <button class="status-btn"
                                                onclick="changeFoundStatus(${item.id}, 'CLAIMED')">
                                                Claim
                                            </button>
                                          `
                            : ""
                    }

                                ${
                        item.status === "CLAIMED"
                            ? `
                                            <button class="status-btn"
                                                onclick="changeFoundStatus(${item.id}, 'RETURNED')">
                                                Return
                                            </button>
                                          `
                            : ""
                    }

                            </td>

                        </tr>

                    `;
                });


                html += `
                        </tbody>
                    </table>
                `;
            }


            document.getElementById("foundList").innerHTML =
                html;
        });
}


// =====================================================
// FOUND ITEM - EDIT
// =====================================================

function editFoundItem(item) {

    document.getElementById("foundId").value =
        item.id;

    document.getElementById("foundDescription").value =
        item.description;

    document.getElementById("foundLocation").value =
        item.location;

    document.getElementById("foundDate").value =
        item.date;

    document.getElementById("foundCategory").value =
        item.category.id;

    document.getElementById("foundUser").value =
        item.user.id;


    document.getElementById("foundFormTitle").innerText =
        "Update Found Item";


    document.querySelector("#found .primary-btn").innerText =
        "Update Found Item";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =====================================================
// FOUND ITEM - DELETE
// =====================================================

function deleteFoundItem(id) {

    if (!confirm("Are you sure you want to delete this found item?")) {
        return;
    }


    fetch(`/found-items/${id}`, {

        method: "DELETE"

    })

        .then(response => response.text())

        .then(data => {

            alert("Found item deleted successfully!");

            loadFoundItems();

            loadDashboard();

        })

        .catch(error => {

            console.error(error);

            alert("Error deleting found item");
        });
}


// =====================================================
// FOUND ITEM - STATUS
// =====================================================

function changeFoundStatus(id, status) {

    fetch(
        `/found-items/${id}/status?status=${status}`,
        {
            method: "PUT"
        }
    )

        .then(response => {

            if (!response.ok) {

                return response.text().then(message => {

                    throw new Error(message);
                });
            }

            return response.json();
        })

        .then(data => {

            alert(
                `Item status changed to ${status}`
            );

            loadFoundItems();
        })

        .catch(error => {

            console.error(error);

            alert(
                "Status update failed: " +
                error.message
            );
        });
}


// =====================================================
// FOUND ITEM - CLEAR
// =====================================================

function clearFoundForm() {

    document.getElementById("foundId").value = "";

    document.getElementById("foundDescription").value = "";

    document.getElementById("foundLocation").value = "";

    document.getElementById("foundDate").value = "";

    document.getElementById("foundCategory").value = "";

    document.getElementById("foundUser").value = "";


    document.getElementById("foundFormTitle").innerText =
        "Add Found Item";


    document.querySelector("#found .primary-btn").innerText =
        "Add Found Item";
}


// =====================================================
// TEXT ESCAPE
// =====================================================

function escapeText(text) {

    return String(text)
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
}


// =====================================================
// INITIAL LOAD
// =====================================================

loadDashboard();

loadCategoriesForForms();

loadUsersForForms();