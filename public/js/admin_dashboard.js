

document.getElementById('customer_selector').addEventListener('change', (e) => {
    const accountId = e.target.value;
  
    if (accountId) {
      document.getElementById('account_id').value = accountId; // Update hidden field
      loadBillingMonths(accountId);
    } else {
      document.getElementById('billing_month').innerHTML = '<option value="">-- Select Billing Month --</option>';
    }
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
  