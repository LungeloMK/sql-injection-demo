(function() {
    // Fake user database
    const users = [
        { id: 1, username: 'admin', password: 'supersecret' },
        { id: 2, username: 'ali', password: 'pass123' },
        { id: 3, username: 'maya', password: 'qwerty' }
    ];

    // Wait for the DOM to be fully loaded before running the script
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded, initializing application...');
        
        // Initialize the application
        init();
    });

    // Update SQL preview
    function updateSqlPreview(type, username, password) {
        const element = type === 'vulnerable' ? 'vuln-sql' : 'prot-sql';
        const sqlElement = document.getElementById(element);
        if (!sqlElement) {
            console.error(`SQL preview element not found for type: ${type}`);
            return;
        }
        if (type === 'vulnerable') {
            sqlElement.textContent = 
                `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        } else {
            sqlElement.textContent = 
                `SELECT * FROM users WHERE username = ? AND password = ?`;
        }
}

    // Vulnerable login (concatenates values directly into SQL)
    function vulnerableLogin(username, password) {
        // This simulates building an SQL query by concatenation (VULNERABLE)
        const fakeQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        
        // In a real attack, this would be sent to the database
        // Here we simulate what the database would return
        
        // If the input contains SQL injection, it will change the query logic
        if (password.includes("' OR '1'='1") || password === '') {
            // Injection successful - return all users
            return [...users]; // Return a copy of the users array
        }
        
        // Otherwise, check credentials normally
        return users.filter(user => 
            user.username === username && user.password === password
        );
}

    // Protected login (uses parameterized queries)
    function protectedLogin(username, password) {
        // This simulates using parameterized queries (SAFE)
        // The parameters are passed separately and not interpreted as SQL
        
        // Check credentials normally - the injection attempt won't work
        return users.filter(user => 
            user.username === username && user.password === password
        );
}

    // Display user data in a table
    function displayUserData(users, type) {
        console.log('Displaying user data for type:', type, users);
        if (!users || users.length === 0) {
            console.error('No users data provided to display');
            return;
        }
    const resultElement = document.getElementById(`${type}-result`);
    const usersTableContainer = document.getElementById('users-table-container');
    
    if (!users || users.length === 0) {
        resultElement.innerHTML = '<span class="error">No users found</span>';
        usersTableContainer.style.display = 'none';
        return;
    }
    
    // Clear previous results
    resultElement.innerHTML = '';
    
    // Create and show the table in the container
    usersTableContainer.style.display = 'block';
    usersTableContainer.innerHTML = `
        <h3>Users Retrieved:</h3>
        <div class="user-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.password}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    // Scroll to show the results
    usersTableContainer.scrollIntoView({ behavior: 'smooth' });
}

    // Try login
    function login(type) {
    console.log(`login() called with type: ${type}`);
    const usernameEl = document.getElementById(`${type}-username`);
    const passwordEl = document.getElementById(`${type}-password`);
    const resultElement = document.getElementById(`${type}-result`);
    
    if (!usernameEl || !passwordEl || !resultElement) {
        console.error('Required elements not found for type:', type);
        console.error('usernameEl:', usernameEl);
        console.error('passwordEl:', passwordEl);
        console.error('resultElement:', resultElement);
        return;
    }
    
    const username = usernameEl.value || '';
    const password = passwordEl.value || '';
    
    // Clear previous results
    resultElement.innerHTML = '';
    
    // Update SQL preview
    updateSqlPreview(type, username, password);
    
    // Small delay to show the SQL preview before showing results
    setTimeout(() => {
        let result;
        if (type === 'vulnerable') {
            result = vulnerableLogin(username, password);
            if (result.length > 0) {
                if (result.length > 1 || password.includes("' OR '1'='1")) {
                    displayUserData(result, type);
                } else {
                    resultElement.innerHTML = `<span class="success">Login successful! Welcome ${result[0].username}</span>`;
                }
            } else {
                resultElement.innerHTML = `<span class="error">Access denied</span>`;
            }
        } else {
            // For protected login
            if (password.includes("' OR '1'='1") || username.includes("' OR '1'='1")) {
                resultElement.innerHTML = `<span class="error">Access denied - SQL injection attempt blocked</span>`;
            } else {
                result = protectedLogin(username, password);
                if (result.length > 0) {
                    resultElement.innerHTML = `<span class="success">Login successful! Welcome ${result[0].username}</span>`;
                } else {
                    resultElement.innerHTML = `<span class="error">Access denied</span>`;
                }
            }
        }
    }, 100);
}

    // Try SQL injection on vulnerable form
    function tryInjection() {
    // Get elements safely
    const usernameEl = document.getElementById('vuln-username');
    const passwordEl = document.getElementById('vuln-password');
    const resultElement = document.getElementById('vuln-result');
    
    if (!usernameEl || !passwordEl || !resultElement) {
        console.error('Required elements not found');
        return;
    }
    
    // Clear the form first
    resetForm('vulnerable');
    
    // Set the injection values
    usernameEl.value = 'admin';
    passwordEl.value = "' OR '1'='1";
    
    // Update the SQL preview
    updateSqlPreview('vulnerable', 'admin', "' OR '1'='1");
    
    // Show a message to click Run login
    resultElement.innerHTML = '<span class="hint">Injection values set. Click "Run login" to execute the query.</span>';
    
    // Auto-scroll to the result area
    resultElement.scrollIntoView({ behavior: 'smooth' });
}

    // Try SQL injection on protected form
    function tryInjectionProtected() {
    const usernameEl = document.getElementById('prot-username');
    const passwordEl = document.getElementById('prot-password');
    
    if (!usernameEl || !passwordEl) {
        console.error('Required elements not found');
        return;
    }
    
    usernameEl.value = 'admin';
    passwordEl.value = "' OR '1'='1";
    updateSqlPreview('protected', 'admin', "' OR '1'='1");
    
    // Show a message to click Run login
    const resultElement = document.getElementById('prot-result');
    if (resultElement) {
        resultElement.innerHTML = '<span class="hint">Injection values set. Click "Run login" to execute the query.</span>';
        resultElement.scrollIntoView({ behavior: 'smooth' });
    }
}

    // Reset form
    function resetForm(type) {
    const usernameEl = document.getElementById(`${type}-username`);
    const passwordEl = document.getElementById(`${type}-password`);
    const resultEl = document.getElementById(`${type}-result`);
    const tableContainer = document.getElementById('users-table-container');
    
    if (usernameEl) usernameEl.value = '';
    if (passwordEl) passwordEl.value = '';
    if (resultEl) resultEl.innerHTML = '';
    if (tableContainer) tableContainer.style.display = 'none';
        
        if (usernameEl) usernameEl.value = '';
        if (passwordEl) passwordEl.value = '';
        if (resultEl) resultEl.innerHTML = '';
        if (tableContainer) tableContainer.style.display = 'none';
        
        updateSqlPreview(type, '', '');
    }

    // Initialize the application
    function init() {
        console.log('Setting up event listeners...');
        
        // Get all required elements
        const vulnUsername = document.getElementById('vuln-username');
        const vulnPassword = document.getElementById('vuln-password');
        const protUsername = document.getElementById('prot-username');
        const protPassword = document.getElementById('prot-password');
        
        // Add event listeners only if elements exist
        if (vulnUsername && vulnPassword) {
            vulnUsername.addEventListener('input', function() {
                updateSqlPreview('vulnerable', this.value, vulnPassword.value);
            });
            
            vulnPassword.addEventListener('input', function() {
                updateSqlPreview('vulnerable', vulnUsername.value, this.value);
            });
            
            console.log('Vulnerable login event listeners added');
        } else {
            console.error('Vulnerable login elements not found');
        }
        
        if (protUsername && protPassword) {
            protUsername.addEventListener('input', function() {
                updateSqlPreview('protected', this.value, protPassword.value);
            });
            
            protPassword.addEventListener('input', function() {
                updateSqlPreview('protected', protUsername.value, this.value);
            });
            
            console.log('Protected login event listeners added');
        } else {
            console.error('Protected login elements not found');
        }
        
        // Make functions available globally
        window.login = login;
        window.tryInjection = tryInjection;
        window.tryInjectionProtected = tryInjectionProtected;
        window.resetForm = resetForm;
        
        // Initialize SQL previews
        updateSqlPreview('vulnerable', '', '');
        updateSqlPreview('protected', '', '');
        
        console.log('Application initialization complete');
    }

    // The init function will be called when DOM is fully loaded
})();
