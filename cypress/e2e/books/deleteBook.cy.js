describe('Delete a book', () => {
    it('Delete a book by id valid', () => {
        const bookId = '682b5a0712e6d4a190fa86c7';

        cy.api({
            method: 'Delete',
            url: `/api/books/delete/${bookId}`,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.deep.equal({
                "message": "Deleted successfully"
            });
        });
    });

    it('Delete a book by id invalid', () => {
        const bookIdInvalid = '123456789123456789';
        cy.api({
            method: 'Delete',
            url: `/api/books/delete/${bookIdInvalid}`,
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400);
            expect(res.body).to.deep.equal({
                "error": "Invalid book ID."
            })
        });
    });
});
