

document.getElementById('customer_selector').addEventListener('change', (e) => {
    const accountId = e.target.value;
  
    if (accountId) {
      document.getElementById('account_id').value = accountId; // Update hidden field
      loadBillingMonths(accountId);
    } else {
      document.getElementById('billing_month').innerHTML = '<option value="">-- Select Billing Month --</option>';
    }
  });
  
  async function loadCustomers() {
    const res = await fetch('/api/customers'); // Define this route if not already
    const customers = await res.json();
    const selector = document.getElementById('customer_selector');
  
    customers.forEach(c => {
      const option = document.createElement('option');
      option.value = c.account_id;
      option.textContent = `${c.customer_name} (${c.account_id.slice(0, 6)}…)`;
      selector.appendChild(option);
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
  });
 
  
  
async function loadBillingMonths(accountId) {
    try {
      const res = await fetch(`/api/billing-months/${accountId}`);
      const months = await res.json();
  
      const select = document.getElementById('billing_month');
      select.innerHTML = '<option value="">-- Select Month --</option>'; // Reset
  
      months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        select.appendChild(option);
      });
    } catch (err) {
      console.error('Failed to load billing months:', err);
    }
  }
  
document.addEventListener('DOMContentLoaded', () => {
    const accountId = document.getElementById('account_id')?.value;  
    if (accountId) {
      loadBillingMonths(accountId);
    }
});
  