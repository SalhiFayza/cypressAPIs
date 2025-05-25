# 🧪 Cypress Setup and API Testing Guide

This guide walks you through adding **Cypress** to your Node.js/Express app and testing your API endpoints using `cypress-plugin-api`.

---

## 📁 Prerequisites

Before you begin:

* You must already have a Node.js/Express app running.
* You should have dependencies installed (`npm install`).

---

## ⚙️ Step 1: Open Your Project

Navigate to your project directory:

```bash
cd your_project_name
```

---

## 🔧 Step 2: Install Cypress

Install Cypress as a development dependency:

```bash
npm install --save-dev cypress
```

---

## 🔌 Step 3: Install `cypress-plugin-api`

Install the plugin to easily test REST API endpoints:

```bash
npm install --save-dev cypress-plugin-api
```

---

## 📂 Step 4: Open Cypress

Run Cypress to generate the required folder structure:

```bash
npx cypress open
```

This will create a `cypress/` directory with folders like:

* `e2e/`
* `support/`

---

## 🧩 Step 5: Configure the Plugin

Edit the support file:

```bash
cypress/support/e2e.js
```

Add the following import:

```js
import 'cypress-plugin-api';
```

---

## 🧪 Step 6: Create Your First API Test

Create a test file:

```bash
cypress/e2e/books/postBook.cy.js
```

Paste this example test:

```js
describe('Book API Post Tests', () => {
  it('uploads using XHR', () => {
    cy.fixture('book-cover.jpg', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((blob) => {
        const formData = new FormData();
        formData.append('title', 'Web Testing with Cypress');
        formData.append('description', '"Web Testing with Cypress" teaches you to test web apps on any browser or platform with zero environment setup in a developer-friendly, end-to-end web testing environment.');
        formData.append('author', 'Lev Gelfenbuim');
        formData.append('price', 23);
        formData.append('userId', '682512a5120185ee92b61f15');
        formData.append('image', blob, 'book-cover.jpg');
        return fetch('http://localhost:3000/api/books/add', {
          method: 'POST',
          body: formData,
        });
      })
      .then(async (res) => {
        expect(res.status).to.eq(200);
        const body = await res.json();
        expect(body.message).to.eq('Book added successfully');
        expect(body.book.title).to.eq('Web Testing with Cypress');
      });
  });
});
```

---

## 🚀 Step 7: Run Tests

### Run with GUI:

```bash
npx cypress open
```

Select your browser and run the test.

### Run headlessly:

```bash
npx cypress run
```

---

You're now ready to test your API with Cypress! 🎉
