describe('Get all my books', () => {
    it('Get list of my books', () => {
        cy.api({
            method:'GET',
            url: '/api/books',
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(200);
        });
    });

    it('Get list of my books with invalid endpoint', () => {
        cy.api({
            method:'GET',
            url: '/api/bookss',
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(404);
        });
    });

});
