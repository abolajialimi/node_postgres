// // Extract username from URL
// const params = new URLSearchParams(window.location.search);
// const username = params.get('username');
// if (!username) {
//   alert('Username not specified in URL.');
//   throw new Error('Missing username in URL');
// }
// document.getElementById('username').textContent = username;


// // Fetch dashboard data
// fetch(`/api/dashboard?username=${encodeURIComponent(username)}`)
//   .then(res => {
//     if (!res.ok) throw new Error('Failed to fetch dashboard data');
//     return res.json();
//   })
//   .then(data => {
//     document.getElementById('energyConsumption').textContent =
//       JSON.stringify(data.energyConsumption, null, 2);
//     document.getElementById('energyComparison').textContent =
//       JSON.stringify(data.energyComparison, null, 2);
//     document.getElementById('invoiceSummary').textContent =
//       JSON.stringify(data.invoiceSummary, null, 2);
//   })
//   .catch(err => {
//     console.error(err);
//     alert('Failed to load dashboard data.');
//   });

// // Populate dropdown from API
// fetch('/api/usernames?role=admin')
//   .then(res => res.json())
//   .then(usernames => {
//     const select = document.getElementById('userSelect');
//     usernames.forEach(username => {
//       const option = document.createElement('option');
//       option.value = username;
//       option.textContent = username;
//       select.appendChild(option);
//     });
//   })
//   .catch(err => console.error('Failed to load usernames:', err));

// // Handle "Load Profile" button click
// document.getElementById('loadProfileBtn').addEventListener('click', () => {
//   const selectedUsername = document.getElementById('userSelect').value;
//   if (!selectedUsername) {
//     alert('Please select a username.');
//     return;
//   }

//   fetch(`/api/customer-profile?username=${encodeURIComponent(selectedUsername)}`)
//     .then(res => {
//       if (!res.ok) throw new Error('Profile not found');
//       return res.json();
//     })
//     .then(profile => {
//       const div = document.getElementById('customerProfile');
//       div.innerHTML = `
//         <h2>Customer Profile: ${profile.customer_name}</h2>
//         <table>
//           <tr><td>Account ID</td><td>${profile.account_id}</td></tr>
//           <tr><td>Username</td><td>${profile.username}</td></tr>
//           <tr><td>Email</td><td>${profile.email}</td></tr>
//           <tr><td>Phone</td><td>${profile.phone_number}</td></tr>
//           <tr><td>Service Address</td><td>${profile.service_address}</td></tr>
//           <tr><td>Service Type</td><td>${profile.service_type}</td></tr>
//           <tr><td>Meter ID</td><td>${profile.meter_id}</td></tr>
//           <tr><td>Rate Plan</td><td>${profile.rate_plan}</td></tr>
//           <tr><td>Account Status</td><td>${profile.account_status}</td></tr>
//           <tr><td>Latest Gas Consumption</td><td>${profile.latest_gas_consumption}</td></tr>
//           <tr><td>Latest Electricity Consumption</td><td>${profile.latest_electricity_consumption}</td></tr>
//           <tr><td>Total Amount</td><td>${profile.total_amount}</td></tr>
//           <tr><td>Invoice Status</td><td>${profile.invoice_status}</td></tr>
//           <tr><td>Due Date</td><td>${profile.due_date}</td></tr>
//           <tr><td>Payment Date</td><td>${profile.payment_date}</td></tr>
//         </table>
//       `;
//     })
//     .catch(err => {
//       document.getElementById('customerProfile').innerHTML = `<p style="color:red;">Error loading profile.</p>`;
//       console.error(err);
//     });
// });



// Fetch session user info (optional for greeting)
fetch('/api/session')
  .then(res => res.json())
  .then(user => {
    document.getElementById('username').textContent = user.username || 'Unknown';
  })
  .catch(() => {
    alert('Session expired or unauthorized. Redirecting to login...');
    window.location.href = '/';
  });

// Fetch dashboard data
fetch('/api/dashboard')
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  })
  .then(data => {
    document.getElementById('energyConsumption').textContent =
      JSON.stringify(data.energyConsumption, null, 2);
    document.getElementById('energyComparison').textContent =
      JSON.stringify(data.energyComparison, null, 2);
    document.getElementById('invoiceSummary').textContent =
      JSON.stringify(data.invoiceSummary, null, 2);
  })
  .catch(err => {
    console.error(err);
    alert('Failed to load dashboard data.');
  });

// Load usernames into dropdown
fetch('/api/usernames')
  .then(res => {
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  })
  .then(usernames => {
    const select = document.getElementById('userSelect');
    usernames.forEach(username => {
      const option = document.createElement('option');
      option.value = username;
      option.textContent = username;
      select.appendChild(option);
    });
  })
  .catch(err => {
    console.error('Failed to load usernames:', err);
  });

  document.getElementById('loadProfileBtn').addEventListener('click', () => {
    const selectedUsername = document.getElementById('userSelect').value;
    console.log('Selected username:', selectedUsername);
    const profileDiv = document.getElementById('customerProfile');
    
    if (!selectedUsername) {
      alert('Please select a username.');
      return;
    }
  
      // Assume selectedUsername is already defined
  const params = new URLSearchParams({ username: selectedUsername });
  console.log(`Request URL: /api/customer-profile?${params}`);

  fetch(`/api/customer-profile?${params}`)
    .then(res => {
      if (!res.ok) throw new Error('Customer not found');
      return res.json();
    })
    .then(profile => {
      console.log('returned profile:',profile);  // Check if the profile data is returned
      if (!profile) {
        profileDiv.innerHTML = `<p style="color:red;">No profile data available.</p>`;
        return;
      }

    
      //   // 🔹 SET account_id in hidden field
      document.getElementById('account_id').value = profile.account_id;

      const renderRow = (label, value) => `
        <tr><td>${label}</td><td>${value ?? 'N/A'}</td></tr>`;

      profileDiv.innerHTML = `
        <h2>Customer Profile: ${profile.customer_name ?? 'Unknown'}</h2>
        <table>
          ${renderRow('Account ID', profile.account_id)}
          ${renderRow('Username', profile.username)}
          ${renderRow('Email', profile.email)}
          ${renderRow('Phone', profile.phone_number)}
          ${renderRow('Service Address', profile.service_address)}
          ${renderRow('Service Type', profile.service_type)}
          ${renderRow('Meter ID', profile.meter_id)}
          ${renderRow('Rate Plan', profile.rate_plan)}
          ${renderRow('Account Status', profile.account_status)}
          ${renderRow('Latest Gas Consumption', profile.latest_gas_consumption)}
          ${renderRow('Latest Electricity Consumption', profile.latest_electricity_consumption)}
          ${renderRow('Total Amount', profile.total_amount)}
          ${renderRow('Invoice Status', profile.invoice_status)}
          ${renderRow('Due Date', profile.due_date)}
          ${renderRow('Payment Date', profile.payment_date)}
        </table>
      `;
    })
    .catch(err => {
      profileDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
      console.error('Error loading customer profile:', err);
    });

  }); 
  // document.addEventListener('DOMContentLoaded', () => {
  //   const loadBtn = document.getElementById('loadProfileBtn');
  //   const userSelect = document.getElementById('userSelect');
  //   const profileDiv = document.getElementById('customerProfile');
  
  //   if (!loadBtn || !userSelect) {
  //     console.error('Button or select element not found');
  //     return;
  //   }
  
  //   loadBtn.addEventListener('click', () => {
  //     const selectedUsername = userSelect.value;
  //     console.log('Selected username:', selectedUsername);
  //     if (!selectedUsername || selectedUsername.includes('Choose')) {
  //       alert('Please select a username.');
  //       return;
  //     }
  
  //     fetch(`/api/customer-profile?username=${encodeURIComponent(selectedUsername)}`)
  //       .then(res => {
  //         if (!res.ok) throw new Error('Customer not found');
  //         return res.json();
  //       })
  //       .then(profile => {
  //         profileDiv.innerHTML = `<p>Customer Name: ${profile.customer_name}</p>`;
  //       })
  //       .catch(err => {
  //         profileDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
  //         console.error('Fetch error:', err);
  //       });
  //   });
  // });
  