describe('Login API Tests', () => {

    it('Logs in with valid credentials', () => {
        cy.api({
            method: 'POST',
            form: true,
            url: '/api/login',
            body: {
                email: 'testhb@gmail.com',
                password: '123456789'
            },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(200)
            expect(res.body).to.have.property('message', 'Logged in successfully')
            expect(res.body).to.have.property('userId')
        })
    })

    it('Fails login with incorrect password', () => {
        cy.api({
            method: 'POST',
            form: true,
            url: '/api/login',
            body: {
                email: 'testhb@gmail.com',
                password: 'wrongpassword'
            },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(401)
            expect(res.body).to.have.property('error','Invalid password')
        })
    })

    it('Fails login with non-existing email', () => {
        cy.api({
            method: 'POST',
            form: true,
            url: '/api/login',
            body: {
                email: 'nonexistent@example.com',
                password: 'anyPassword123'
            },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(401)
            expect(res.body).to.have.property('error','User not found')
        })
    })

    it('Fails login with empty email and password', () => {
        cy.api({
            method: 'POST',
            form: true,
            url: '/api/login',
            body: {
                email: '',
                password: ''
            },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body).to.have.property('error', 'Email and password are required')
        })
    })

    it('Fails login with missing password field', () => {
        cy.api({
            method: 'POST',
            form: true,
            url: '/api/login',
            body: {
                email: 'testhb@gmail.com'
                // password missing
            },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body).to.have.property('error','Email and password are required')
        })
    })

    it('Fails login with missing email field', () => {
        cy.api({
            method: 'POST',
            form: true,
            url: '/api/login',
            body: {
                password: '123456789'
                // email missing
            },
            failOnStatusCode: false
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body).to.have.property('error','Email and password are required')
        })
    })

})
