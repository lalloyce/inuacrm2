async function showCustomerProfile() {
    const customerId = getCurrentCustomerId(); // Implement this function to get the current customer ID
    if (!customerId) {
        console.error('No customer ID found');
        alert('Please select a customer first.');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`/api/customers/${customerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorMessage = `Failed to fetch customer data: ${response.status} ${response.statusText}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        const customer = await response.json();

        const content = document.getElementById('customer-management-content');
        content.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Customer Profile</h2>
            <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <p>${customer.first_name} ${customer.middle_name || ''} ${customer.last_name}</p>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Mobile Number:</label>
                    <p>${customer.mobile_number}</p>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                    <p>${customer.village}, ${customer.sub_location}, ${customer.ward}, ${customer.county}</p>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Group:</label>
                    <p>${customer.group_name}</p>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Registration Date:</label>
                    <p>${new Date(customer.created_at).toLocaleDateString()}</p>
                </div>
            </div>
            <h3 class="text-xl font-bold mb-4">Contracts</h3>
            <div id="customer-contracts"></div>
        `;

        // Fetch and display customer contracts
        fetchCustomerContracts(customerId);
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        alert('An error occurred while fetching the customer profile.');
    }
}

async function fetchCustomerContracts(customerId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Implementation of fetchCustomerContracts function
        // Include the token in the headers when making the API call
        // ...
    } catch (error) {
        console.error('Error fetching customer contracts:', error);
        alert('An error occurred while fetching customer contracts.');
    }
}

export { showCustomerProfile };