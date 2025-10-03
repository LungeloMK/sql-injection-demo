# SQL Injection Demo

A comprehensive educational demonstration of SQL injection vulnerabilities and how to prevent them. This project showcases both vulnerable and secure implementations of user authentication systems.

## 🎯 Purpose

This demo is designed to help developers understand:
- How SQL injection attacks work
- Common vulnerabilities in web applications
- Best practices for preventing SQL injection
- The importance of parameterized queries

## 🚀 Features

- **Interactive Demo**: Side-by-side comparison of vulnerable vs. secure login forms
- **Real-time SQL Preview**: See exactly what SQL queries are being executed
- **Educational Examples**: Pre-configured injection attempts to demonstrate the concepts
- **Visual Feedback**: Clear indicators showing the difference between secure and vulnerable code

## 📁 Project Structure

```
SQL Injection Demo/
├── home.html          # Main HTML page with demo interface
├── styles.css         # CSS styling for the demo
├── script.js          # Original vulnerable JavaScript implementation
├── script-fixed.js    # Secure JavaScript implementation
├── script-new.js      # Additional implementation variations
└── README.md          # This file
```

## 🛠️ Setup & Usage

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Running the Demo

1. **Clone or download** this repository to your local machine
2. **Open** `home.html` in your web browser
3. **Explore** the demo by:
   - Entering normal credentials to see regular login behavior
   - Trying the pre-configured injection attempts
   - Observing the SQL query previews

### Demo Instructions

#### Vulnerable Form
- Enter any username
- Try the injection: `' OR '1'='1` in the password field
- Click "Try injection" to see how the attack works

#### Protected Form
- Try the same injection attempt
- Notice how the secure implementation prevents the attack

## 🔍 What You'll Learn

### SQL Injection Basics
- **String Concatenation Vulnerability**: How unsanitized user input can break SQL syntax
- **Bypass Authentication**: How attackers can bypass login systems
- **Data Extraction**: Understanding how injection can expose sensitive data

### Prevention Techniques
- **Parameterized Queries**: Using placeholders instead of string concatenation
- **Input Validation**: Sanitizing and validating user input
- **Least Privilege**: Using database accounts with minimal necessary permissions

## 🔒 Security Notes

⚠️ **Important**: This demo is for educational purposes only. The vulnerable code examples should NEVER be used in production environments.

## 🎓 Educational Value

This project is perfect for:
- **Web Development Students**: Understanding security fundamentals
- **Security Training**: Hands-on learning about injection attacks
- **Code Reviews**: Demonstrating secure coding practices
- **Team Training**: Raising awareness about common vulnerabilities

## 📚 Additional Resources

- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this educational demo:
1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This educational demo is intended solely for learning purposes. The vulnerable code patterns demonstrated here should never be implemented in production systems. Always follow secure coding practices when developing real applications.
