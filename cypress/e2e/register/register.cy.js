describe('Register with valid and invalid data', () => {
    const registerUser = (body) => {
        return cy.api({
            method: 'POST',
            form: true,
            url: '/api/register',
            body,
            failOnStatusCode: false
        })
    }

    it('Registers a new user with valid data', () => {
        const randomEmail = generateRandomEmail();
        registerUser({
            name: 'Fayza',
            email: randomEmail,
            password: '12345Abcd$'
        }).then((res) => {
            expect(res.status).to.eq(200)
            expect(res.body.message).to.eq('Registered successfully')
        })
    })

    it('Registers with invalid email', () => {
        registerUser({
            name: 'Fayza',
            email: 'test123',
            password: '123456789'
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.error).to.include('Invalid email format')
        })
    })

    it('Registers with existing email', () => {
        registerUser({
            name: 'Fayza',
            email: 'testhb@gmail.com',  // make sure this email exists in your DB
            password: '123456789'
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.error).to.include('Email is already used')
        })
    })

    it('Registers with empty data', () => {
        registerUser({
            name: '',
            email: '',
            password: ''
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.error).to.include('All fields are required')
        })
    })

    it('Registers with weak password', () => {
        registerUser({
            name: 'Test',
            email: 'test123abcd@gmail.com',
            password: '123'
        }).then((res) => {
            expect(res.status).to.eq(400)
            expect(res.body.error).to.include('Password must be at least 8 characters')
        })
    })

    // Additional tests for each missing field
    it('Fails if name is missing', () => {
        registerUser({ name: '', email: 'valid@example.com', password: 'StrongPass1!' })
            .then(res => {
                expect(res.status).to.eq(400)
                expect(res.body.error).to.include('All fields are required')
            })
    })

    it('Fails if email is missing', () => {
        registerUser({ name: 'Valid Name', email: '', password: 'StrongPass1!' })
            .then(res => {
                expect(res.status).to.eq(400)
                expect(res.body.error).to.include('All fields are required')
            })
    })

    it('Fails if password is missing', () => {
        registerUser({ name: 'Valid Name', email: 'valid@example.com', password: '' })
            .then(res => {
                expect(res.status).to.eq(400)
                expect(res.body.error).to.include('All fields are required')
            })
    })

    it('Fails if password missing special character', () => {
        registerUser({ name: 'Valid Name', email: 'valid@example.com', password: '123' })
            .then(res => {
                expect(res.status).to.eq(400)
                expect(res.body.error).to.include('Password must be at least 8 characters')
            })
    })
})
function generateRandomEmail() {
    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
    let username = ''
    for (let i = 0; i < 10; i++) {
      username += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const domains = ['example.com', 'test.com', 'mail.com', 'demo.org']
    const domain = domains[Math.floor(Math.random() * domains.length)]
    return `${username}@${domain}`
  }
  