describe('Get book by ID', () => {
  it('Should fetch book details by valid ID', () => {
    const bookId = '682b5938c11dfbe5a2e7d328';

    cy.api({
      url: `/api/books/${bookId}`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('book');
      expect(res.body.book).to.have.property('title', 'Web Testing with Cypress');
      expect(res.body.book).to.have.property('author', 'Lev Gelfenbuim');
    });
  });

  it('Should fail with invalid ID format', () => {
    cy.api({
      url: '/api/books/notavalidid',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('error', 'Invalid book ID.');
    });
  });

  it('Should return 404 for non-existent but valid ID', () => {
    const fakeId = '000000000000000000000000';

    cy.api({
      url: `/api/books/${fakeId}`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error', 'Book not found.');
    });
  });
});
