// SQL Injection Demo - Fixed Version

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing application...');
    
    // Fake user database
    const users = [
        { id: 1, username: 'admin', password: 'supersecret' },
        { id: 2, username: 'ali', password: 'pass123' },
        { id: 3, username: 'maya', password: 'qwerty' }
    ];

    // Get DOM elements
    const elements = {
        vulnUsername: document.getElementById('vuln-username'),
        vulnPassword: document.getElementById('vuln-password'),
        protUsername: document.getElementById('prot-username'),
        protPassword: document.getElementById('prot-password'),
        vulnResult: document.getElementById('vuln-result'),
        protResult: document.getElementById('prot-result'),
        usersTableContainer: document.getElementById('users-table-container'),
        vulnSql: document.getElementById('vuln-sql'),
        protSql: document.getElementById('prot-sql')
    };

    // Check if all required elements exist
    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Element not found: ${name}`);
        }
    }

    // Update SQL preview
    function updateSqlPreview(type, username, password) {
        const sqlElement = type === 'vulnerable' ? elements.vulnSql : elements.protSql;
        if (!sqlElement) return;
        
        // Escape single quotes to prevent breaking the SQL syntax in the preview
        const safeUsername = (username || '').replace(/'/g, "''");
        const safePassword = (password || '').replace(/'/g, "''");
        
        if (type === 'vulnerable') {
            sqlElement.textContent = `SELECT * FROM users WHERE username = '${safeUsername}' AND password = '${safePassword}'`;
        } else {
            sqlElement.textContent = 'SELECT * FROM users WHERE username = ? AND password = ?';
        }
    }

    // Check for various SQL injection patterns
    function isSqlInjection(input) {
        if (!input) return false;
        
        // Common SQL injection patterns
        const injectionPatterns = [
            /'\s+OR\s+['\d\s=]+(?:--|#|$)/i,  // ' OR 1=1--, ' OR '1'='1, etc.
            /'\s*;?\s*DROP\s+TABLE/i,           // '; DROP TABLE users--
            /'\s*;?\s*SELECT\s+\*/i,            // '; SELECT * FROM users--
            /'\s*;?\s*UNION\s+SELECT/i,         // ' UNION SELECT * FROM users--
            /'\s*;?\s*INSERT\s+INTO/i,          // '; INSERT INTO users--
            /'\s*;?\s*UPDATE\s+\w+\s+SET/i,    // '; UPDATE users SET password='hacked'--
            /'\s*;?\s*DELETE\s+FROM/i,          // '; DELETE FROM users--
            /'\s*;?\s*WAITFOR\s+DELAY/i,        // '; WAITFOR DELAY '0:0:10'--
            /'\s*;?\s*SHUTDOWN/i,               // '; SHUTDOWN--
            /'\s*;?\s*--\s*$/i,                 // ';-- (comment)
            /'\s*;?\s*#\s*$/i,                  // ';# (comment alternative)
            /'\s*;?\s*\/\*.*\*\//i             // ';/* comment */
        ];
        
        return injectionPatterns.some(pattern => pattern.test(input));
    }

    // Vulnerable login (concatenates values directly into SQL)
    function vulnerableLogin(username, password) {
        // Check both username and password for injection patterns
        if (isSqlInjection(username) || isSqlInjection(password) || 
            password === '' || username === 'admin' && password === 'admin') {
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
        const resultElement = type === 'vulnerable' ? elements.vulnResult : elements.protResult;
        
        if (!users || users.length === 0) {
            resultElement.innerHTML = '<span class="error">No users found</span>';
            elements.usersTableContainer.style.display = 'none';
            return;
        }

        elements.usersTableContainer.innerHTML = `
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
        elements.usersTableContainer.style.display = 'block';
        elements.usersTableContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Login function
    window.login = function(type) {
        const usernameEl = type === 'vulnerable' ? elements.vulnUsername : elements.protUsername;
        const passwordEl = type === 'vulnerable' ? elements.vulnPassword : elements.protPassword;
        const resultElement = type === 'vulnerable' ? elements.vulnResult : elements.protResult;

        const username = usernameEl.value || '';
        const password = passwordEl.value || '';

        // Clear previous results
        resultElement.innerHTML = '';
        elements.usersTableContainer.style.display = 'none';

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
        window.resetForm('vulnerable');
        elements.vulnUsername.value = 'admin';
        elements.vulnPassword.value = "' OR '1'='1' -- ";
        updateSqlPreview('vulnerable', elements.vulnUsername.value, elements.vulnPassword.value);
        elements.vulnResult.innerHTML = `
            <div class="hint">
                <p>Injection values set. Click "Run login" to execute the query.</p>
                <p>This injection will bypass authentication by making the condition always true.</p>
                <p>Try these other injections after testing this one:</p>
                <ul>
                    <li><code>' OR '1'='1' -- </code> (Basic injection)</li>
                    <li><code>' OR 1=1 -- </code> (Shorter version)</li>
                    <li><code>' OR 'a'='a</code> (Alternative true condition)</li>
                    <li><code>' OR 1=1; -- </code> (With statement termination)</li>
                    <li><code>admin' -- </code> (Username-based injection)</li>
                </ul>
            </div>`;
        elements.vulnResult.scrollIntoView({ behavior: 'smooth' });
    };

    // Try injection on protected form
    window.tryInjectionProtected = function() {
        window.resetForm('protected');
        elements.protUsername.value = 'admin';
        elements.protPassword.value = "' OR '1'='1";
        updateSqlPreview('protected', elements.protUsername.value, elements.protPassword.value);
        elements.protResult.innerHTML = '<span class="hint">Injection values set. Click "Run login" to see it blocked.</span>';
        elements.protResult.scrollIntoView({ behavior: 'smooth' });
    };

    // Reset form
    window.resetForm = function(type) {
        const usernameEl = type === 'vulnerable' ? elements.vulnUsername : elements.protUsername;
        const passwordEl = type === 'vulnerable' ? elements.vulnPassword : elements.protPassword;
        const resultElement = type === 'vulnerable' ? elements.vulnResult : elements.protResult;

        if (usernameEl) usernameEl.value = '';
        if (passwordEl) passwordEl.value = '';
        if (resultElement) resultElement.innerHTML = '';
        elements.usersTableContainer.style.display = 'none';
        
        updateSqlPreview(type, '', '');
    };

    // Initialize event listeners
    if (elements.vulnUsername && elements.vulnPassword) {
        elements.vulnUsername.addEventListener('input', () => {
            updateSqlPreview('vulnerable', elements.vulnUsername.value, elements.vulnPassword.value);
        });
        
        elements.vulnPassword.addEventListener('input', () => {
            updateSqlPreview('vulnerable', elements.vulnUsername.value, elements.vulnPassword.value);
        });
    }

    if (elements.protUsername && elements.protPassword) {
        elements.protUsername.addEventListener('input', () => {
            updateSqlPreview('protected', elements.protUsername.value, elements.protPassword.value);
        });
        
        elements.protPassword.addEventListener('input', () => {
            updateSqlPreview('protected', elements.protUsername.value, elements.protPassword.value);
        });
    }

    // Initialize SQL previews
    updateSqlPreview('vulnerable', '', '');
    updateSqlPreview('protected', '', '');
    
    console.log('Application initialization complete');
});
