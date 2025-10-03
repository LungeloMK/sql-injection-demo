// SQL Injection Demo - Simplified Version

// Main application initialization
function initApp() {
    console.log('Initializing application...');
    
    // Fake user database
    const users = [
        { id: 1, username: 'admin', password: 'supersecret' },
        { id: 2, username: 'ali', password: 'pass123' },
        { id: 3, username: 'maya', password: 'qwerty' }
    ];

    // Get DOM elements
    const vulnUsername = document.getElementById('vuln-username');
    const vulnPassword = document.getElementById('vuln-password');
    const protUsername = document.getElementById('prot-username');
    const protPassword = document.getElementById('prot-password');
    const vulnResult = document.getElementById('vuln-result');
    const protResult = document.getElementById('prot-result');
    const usersTableContainer = document.getElementById('users-table-container');
    const vulnSql = document.getElementById('vuln-sql');
    const protSql = document.getElementById('prot-sql');

    // Check if all required elements exist
    const elements = {
        vulnUsername, vulnPassword, protUsername, protPassword,
        vulnResult, protResult, usersTableContainer, vulnSql, protSql
    };

    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element not found: ${name}`);
        }
    }

    // If any critical elements are missing, try again after a short delay
    if (!vulnSql || !protSql) {
        console.log('Retrying initialization...');
        setTimeout(initApp, 100);
        return;
    }

    // Initialize SQL previews
    updateSqlPreview('vulnerable', vulnUsername.value, vulnPassword.value);
    updateSqlPreview('protected', protUsername.value, protPassword.value);

    // Add event listeners with proper scoping
    vulnUsername.addEventListener('input', function() {
        updateSqlPreview('vulnerable', this.value, vulnPassword.value);
    });
    
    vulnPassword.addEventListener('input', function() {
        updateSqlPreview('vulnerable', vulnUsername.value, this.value);
    });
    
    protUsername.addEventListener('input', function() {
        updateSqlPreview('protected', this.value, protPassword.value);
    });
    
    protPassword.addEventListener('input', function() {
        updateSqlPreview('protected', protUsername.value, this.value);
    });

    // Update SQL preview
    function updateSqlPreview(type, username, password) {
        const sqlElement = type === 'vulnerable' ? vulnSql : protSql;
        if (!sqlElement) {
            console.error(`SQL preview element not found for type: ${type}`);
            return;
        }
        
        // Escape single quotes to prevent breaking the SQL syntax in the preview
        const safeUsername = (username || '').replace(/'/g, "''");
        const safePassword = (password || '').replace(/'/g, "''");
        
        if (type === 'vulnerable') {
            sqlElement.textContent = `SELECT * FROM users WHERE username = '${safeUsername}' AND password = '${safePassword}'`;
        } else {
            sqlElement.textContent = 'SELECT * FROM users WHERE username = ? AND password = ?';
        }
    }

    // Vulnerable login (concatenates values directly into SQL)
    function vulnerableLogin(username, password) {
        if (password.includes("' OR '1'='1") || password === '') {
            return [...users]; // Return all users for SQL injection
        }
        return users.filter(user => user.username === username && user.password === password);
    }

    // Protected login (uses parameterized queries)
    function protectedLogin(username, password) {
        return users.filter(user => user.username === username && user.password === password);
    }

    // Display user data in a table
    function displayUserData(users, type) {
        const resultElement = type === 'vulnerable' ? vulnResult : protResult;
        
        if (!users || users.length === 0) {
            resultElement.innerHTML = '<span class="error">No users found</span>';
            usersTableContainer.style.display = 'none';
            return;
        }

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
        usersTableContainer.style.display = 'block';
        usersTableContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Login function
    window.login = function(type) {
        const usernameEl = type === 'vulnerable' ? vulnUsername : protUsername;
        const passwordEl = type === 'vulnerable' ? vulnPassword : protPassword;
        const resultElement = type === 'vulnerable' ? vulnResult : protResult;

        const username = usernameEl.value || '';
        const password = passwordEl.value || '';

        // Clear previous results
        resultElement.innerHTML = '';
        usersTableContainer.style.display = 'none';

        // Update SQL preview
        updateSqlPreview(type, username, password);

        // Process login
        setTimeout(() => {
            let result = type === 'vulnerable' 
                ? vulnerableLogin(username, password)
                : protectedLogin(username, password);

            if (result && result.length > 0) {
                if (result.length > 1 || (result[0] && result[0].username === 'admin')) {
                    displayUserData(result, type);
                } else {
                    resultElement.innerHTML = `<span class="success">Login successful! Welcome ${result[0].username}</span>`;
                }
            } else {
                resultElement.innerHTML = '<span class="error">Access denied</span>';
            }
        }, 100);
    };

    // Try injection
    window.tryInjection = function() {
        resetForm('vulnerable');
        vulnUsername.value = 'admin';
        vulnPassword.value = "' OR '1'='1";
        updateSqlPreview('vulnerable', vulnUsername.value, vulnPassword.value);
        vulnResult.innerHTML = '<span class="hint">Injection values set. Click "Run login" to execute the query.</span>';
        vulnResult.scrollIntoView({ behavior: 'smooth' });
    };

    // Try injection on protected form
    window.tryInjectionProtected = function() {
        resetForm('protected');
        protUsername.value = 'admin';
        protPassword.value = "' OR '1'='1";
        updateSqlPreview('protected', protUsername.value, protPassword.value);
        protResult.innerHTML = '<span class="hint">Injection values set. Click "Run login" to see it blocked.</span>';
        protResult.scrollIntoView({ behavior: 'smooth' });
    };

    // Reset form
    window.resetForm = function(type) {
        const usernameEl = type === 'vulnerable' ? vulnUsername : protUsername;
        const passwordEl = type === 'vulnerable' ? vulnPassword : protPassword;
        const resultElement = type === 'vulnerable' ? vulnResult : protResult;

        if (usernameEl) usernameEl.value = '';
        if (passwordEl) passwordEl.value = '';
        if (resultElement) resultElement.innerHTML = '';
        usersTableContainer.style.display = 'none';
        
        updateSqlPreview(type, '', '');
    };

    console.log('Application initialization complete');
    
    // Initialize SQL previews
    updateSqlPreview('vulnerable', '', '');
    updateSqlPreview('protected', '', '');
    
    return true;
});
