describe('Should update a book using PUT request',()=>{
it('Update a book with valid data', () => {
    cy.fixture('book-cover-2.jpg', 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((blob) => {
        const formData = new FormData();
        formData.append('title', 'Web Automation Testing Using Playwright');
        formData.append('description', 'The purpose of the book Web Automation Testing Using Playwright is to teach you how to use Playwright to automate your web testing.');
        formData.append('author', 'Kailash Pathak');
        formData.append('price', 37);
        formData.append('userId', '682512a5120185ee92b61f15');
        formData.append('image', blob, 'book-cover-2.jpg');
  
        const bookId = '682c63a681cf44e838fe4a72';
  
        return fetch(`http://localhost:3000/api/books/update/${bookId}`, {
          method: 'PUT',
          body: formData,
        });
      })
      .then(async (res) => {
        expect(res.status).to.eq(200);
        const body = await res.json();
        expect(body.message).to.eq('Book updated successfully');
        expect(body.book.title).to.eq('Web Automation Testing Using Playwright');
        expect(body.book.author).to.eq('Kailash Pathak');
        expect(body.book.price).to.eq(37);
      });
  });
});