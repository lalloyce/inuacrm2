// Ticket-related functionality

function showCreateIssueForm() {
    const content = document.getElementById('customer-management-content');
    content.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Create Issue</h2>
        <form id="createIssueForm">
            <div class="mb-4">
                <label for="customerId" class="block mb-2">Customer ID:</label>
                <input type="text" id="customerId" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label for="issueTitle" class="block mb-2">Issue Title:</label>
                <input type="text" id="issueTitle" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label for="issueDescription" class="block mb-2">Issue Description:</label>
                <textarea id="issueDescription" class="w-full p-2 border rounded" rows="4" required></textarea>
            </div>
            <div class="mb-4">
                <label for="issuePriority" class="block mb-2">Priority:</label>
                <select id="issuePriority" class="w-full p-2 border rounded" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Create Issue</button>
        </form>
    `;

    document.getElementById('createIssueForm').addEventListener('submit', createIssue);
}

async function createIssue(event) {
    event.preventDefault();
    const customerId = document.getElementById('customerId').value;
    const title = document.getElementById('issueTitle').value;
    const description = document.getElementById('issueDescription').value;
    const priority = document.getElementById('issuePriority').value;

    try {
        const response = await fetch('/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                customerId,
                title,
                description,
                priority
            })
        });

        if (response.ok) {
            const ticket = await response.json();
            alert(`Issue created successfully. Ticket ID: ${ticket.id}`);
            // Optionally, you can redirect to a ticket details page or refresh the current view
        } else {
            const error = await response.json();
            alert(`Failed to create issue: ${error.error}`);
        }
    } catch (error) {
        console.error('Error creating issue:', error);
        alert('An error occurred while creating the issue');
    }
}

// Add more ticket-related functions here as needed