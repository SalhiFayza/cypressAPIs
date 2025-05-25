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

  it('Adds a book with empty data', () => {
    cy.api({
      method: 'POST',
      form: true,
      url: '/api/books/add',
      body: {
        title: '',
        description: '',
        author: '',
        price: '',
        userId: '',
        image: ''
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property("message", "Missing request body.")
    });
  });

  it('Fails when userId is invalid ObjectId', () => {
    cy.api({
      method: 'POST',
      form: true,
      url: '/api/books/add',
      body: {
        title: 'Bad ID Test',
        description: 'Test desc',
        author: 'Author',
        price: '25',
        userId: 'invalid-id',
        image: 'book.jpg'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([400, 500]);
    });
  });


});
