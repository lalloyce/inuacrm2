function initializeRepaymentProcess() {
    document.getElementById('findCustomer').addEventListener('click', handleRepayment);
}

async function handleRepayment() {
    const customerId = document.getElementById('customerId').value;
    
    try {
        const customerDetails = await fetchCustomerDetails(customerId);
        displayCustomerDetails(customerDetails);
        
        document.getElementById('repaymentForm').style.display = 'block';
        
        document.getElementById('repaymentForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const repaymentAmount = document.getElementById('repaymentAmount').value;
            const transactionNumber = document.getElementById('transactionNumber').value;
            
            const result = await processRepayment(customerId, repaymentAmount, transactionNumber);
            
            if (result.success) {
                alert('Repayment processed successfully!');
                generateReceipt(result.receipt);
            } else {
                alert('Error processing repayment: ' + result.error);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching customer details: ' + error.message);
    }
}

async function fetchCustomerDetails(customerId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/customers/${customerId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch customer details');
    }
    return await response.json();
}

function displayCustomerDetails(customer) {
    const detailsContainer = document.getElementById('customerDetails');
    detailsContainer.innerHTML = `
        <h3 class="text-xl font-bold mb-2">Customer Details</h3>
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Group:</strong> ${customer.group}</p>
        <p><strong>Group Leader:</strong> ${customer.groupLeader}</p>
        <p><strong>Outstanding Loan:</strong> ${customer.outstandingLoan}</p>
        <p><strong>Downpayment Made:</strong> ${customer.downpaymentMade}</p>
        <p><strong>Instalment Due Date:</strong> ${customer.instalmentDueDate}</p>
        <p><strong>Loan Due Date:</strong> ${customer.loanDueDate}</p>
    `;
}

async function processRepayment(customerId, amount, transactionNumber) {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/repayments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            customerId,
            amount,
            transactionNumber,
        }),
    });
    
    if (!response.ok) {
        throw new Error('Failed to process repayment');
    }
    
    const result = await response.json();
    
    if (result.success) {
        generateReceipt(result.receipt);
    }
    
    return result;
}

function generateReceipt(receiptData) {
    // Create a new jsPDF instance
    const doc = new jspdf.jsPDF();

    // Set colors
    const primaryColor = '#007bff';
    const secondaryColor = '#6c757d';

    // Add company logo
    // Assuming you have a base64 encoded logo
    // const logoData = 'YOUR_BASE64_ENCODED_LOGO';
    // doc.addImage(logoData, 'PNG', 10, 10, 50, 20);

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.text("Payment Receipt", 105, 30, null, null, "center");

    // Add horizontal line
    doc.setDrawColor(secondaryColor);
    doc.line(20, 35, 190, 35);

    // Add receipt details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Customer Name: ${receiptData.customerName}`, 20, 50);
    doc.text(`Repayment Amount: $${receiptData.repaymentAmount}`, 20, 60);
    doc.text(`Transaction Number: ${receiptData.transactionNumber}`, 20, 70);
    doc.text(`New Outstanding Balance: $${receiptData.newOutstandingBalance}`, 20, 80);
    doc.text(`Date: ${new Date(receiptData.date).toLocaleString()}`, 20, 90);

    // Add a thank you message
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text("Thank you for your payment!", 105, 110, null, null, "center");

    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor);
    doc.text("For any queries, please contact our customer support.", 105, 280, null, null, "center");

    // Save the PDF
    doc.save(`receipt_${receiptData.transactionNumber}.pdf`);

    console.log('Receipt generated:', receiptData);
    alert('Receipt generated and downloaded.');
}