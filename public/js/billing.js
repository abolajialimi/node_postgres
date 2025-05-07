

const gasInput = document.getElementById('gas_consumption');
const elecInput = document.getElementById('electricity_consumption');
const totalInput = document.getElementById('total_amount');

const $ = (id) => document.getElementById(id);
// Update total amount dynamically
function updateTotal() {
  const gas = parseFloat(gasInput.value) || 0;
  const elec = parseFloat(elecInput.value) || 0;
  const total = (gas * 0.8 + elec * 0.12).toFixed(2);
  totalInput.value = total;
}

gasInput.addEventListener('input', updateTotal);
elecInput.addEventListener('input', updateTotal);


// Submit billing data
document.getElementById('billingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('billingMessage');
  const accountId = document.getElementById('account_id').value;
  if (!accountId) {
    alert('Account ID missing. Please load a customer profile first.');
    return;
  }
  console.log("Form submitted"); // <--- helpful log

  const payload = {
    account_id: accountId,
    billing_month: document.getElementById('billing_month').value,
    gas_consumption: parseFloat(gasInput.value),
    electricity_consumption: parseFloat(elecInput.value),
    invoice_status: document.getElementById('invoice_status').value,
    due_date: document.getElementById('due_date').value,
    payment_date: document.getElementById('payment_date').value || null
  };
  console.log('Billing payload:', payload); // helpful for debugging

  try {
    const res = await fetch('/api/billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    msg.textContent = result.message || 'Billing submitted successfully.';
    msg.style.color = 'green';
    if (!res.ok) throw new Error(result.message);
    msg.innerHTML = `<p style="color:green;">${result.message}</p>`;
  } catch (err) {
    msg.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
});


// Utilities
const getPeriodRange = (billingMonth) => {
  const start = new Date(`${billingMonth}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  end.setDate(end.getDate() - 1);

  // Format start and end dates as 'YYYY-MM-DD'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
    // Log the computed dates


  return { start: formatDate(start), end: formatDate(end) };
};


const fetchJSON = async (url, options) => {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Unexpected error');
  return data;
};

// Load
$('billing_month').addEventListener('change', async () => {
  const account_id = $('account_id').value;
  const billing_month = $('billing_month').value;




  if (!account_id || !billing_month) return;

  const { start, end } = getPeriodRange(billing_month);

  try {
    const data = await fetchJSON('/api/billing-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id, period_start: start, period_end: end })
    });

    $('gas_consumption').value = data.gas_consumption || '';
    $('electricity_consumption').value = data.electricity_consumption || '';
    $('total_amount').value = data.total_amount || '';
    $('invoice_status').value = data.invoice_status || '';
    $('due_date').value = data.due_date?.split('T')[0] || '';
    $('payment_date').value = data.payment_date?.split('T')[0] || '';
  } catch (err) {
    alert(`Failed to load: ${err.message}`);
  }
});

// Save (Edit)
$('saveBtn').addEventListener('click', async () => {
  const billingMonth = $('billing_month').value;
  const accountId = $('account_id').value;
  if (!billingMonth || !accountId) return alert('Missing ID or month');

  const { start, end } = getPeriodRange(billingMonth);

  try {
    const { entry_id } = await fetchJSON('/api/entry-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id: accountId, period_start: start, period_end: end })
    });

    if (!entry_id) throw new Error('Entry not found');

    const updatedEntry = {
      entry_id,
      gas_consumption: $('gas_consumption').value,
      electricity_consumption: $('electricity_consumption').value,
      total_amount: $('total_amount').value,
      invoice_status: $('invoice_status').value,
      due_date: $('due_date').value,
      payment_date: $('payment_date').value
    };

    const { message } = await fetchJSON('/api/billing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEntry)
    });

    alert(message);
  } catch (err) {
    alert(`Save failed: ${err.message}`);
  }
});

// Delete
$('deleteBtn').addEventListener('click', async () => {
  const billingMonth = $('billing_month').value;
  const accountId = $('account_id').value;
  if (!billingMonth || !accountId) return alert('Missing ID or month');
  if (!confirm(`Delete billing for ${billingMonth}?`)) return;

  const { start, end } = getPeriodRange(billingMonth);

  try {
    // Step 1: Get entry_id for the selected billing month
    const response = await fetchJSON('/api/entry-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account_id: accountId,
        period_start: start,
        period_end: end
      })
    });
  
    const entry_id = response.entry_id;
  
    // Step 2: Delete that billing entry
    await fetchJSON(`/api/billing/${entry_id}`, {
      method: 'DELETE'
    });
  
    alert('Billing entry deleted successfully');
  } catch (err) {
    console.error('Delete failed:', err.message);
    alert(`Delete failed: ${err.message}`);
  }
  
});


const deleteEntry = async (entry_id) => {
  try {
    const res = await fetch(`/api/billing/${entry_id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert('Deleted: ' + data.deletedEntry.entry_id);
    loadBillingEntries('1002'); // Reload list (use real ID)
  } catch (err) {
    console.error('Delete failed:', err.message);
    alert('Delete failed: ' + err.message);
  }
};
async function loadBillingEntries(accountId) {
  try {
    const entries = await fetchJSON(`/api/billing-entries/${accountId}`);

    const container = document.getElementById('billing-entries-container');
    container.innerHTML = ''; // Clear previous

    entries.forEach(entry => {
      const div = document.createElement('div');
      div.classList.add('billing-entry');
      div.innerHTML = `
        <p><strong>Period:</strong> ${entry.period_start} to ${entry.period_end}</p>
        <p><strong>Total Amount:</strong> $${entry.total_amount}</p>
        <button onclick="deleteEntry('${entry.entry_id}')">Delete</button>
        <hr/>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error('Failed to load entries:', err.message);
  }
}

