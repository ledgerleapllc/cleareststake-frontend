const dev_email = Cypress.env('DEV_EMAIL');

function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var charactersLength = characters.length;
	for(var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function makeemail() {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var charactersLength = characters.length;
	for(var i = 0; i < 10; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	var prepend = dev_email.split('@')[0] + '+' + result;
	var append = dev_email.split('@')[1];
	return prepend + '@' + append;
}

describe('Test', () => {
	beforeEach(() => {
		cy.restoreLocalStorage()
	})

	afterEach(() => {
		cy.saveLocalStorage()
	})

	it('should load the login screen', () => {
		cy.visit('/')
		cy.contains('Sign In')
	})

	it('should login', () => {
		cy.get('input:first').clear().type(Cypress.env('ADMIN_LOGIN_EMAIL'))
		cy.get('input:last').clear()
			.type(Cypress.env('ADMIN_LOGIN_PASSWORD'))
			.type('{enter}')
	})

	it('should load dashboard', () => {
		cy.location('pathname').should('eq', '/app')
		cy.contains('Casper Token Total Balance')
		cy.wait(1000)
	})

	// it('should reload dashboard', () => {
	// 	cy.visit('/')
	// })

	it('should add user', () => {
		cy.get('a').contains('Add User').click()
		cy.get('input').eq(0).clear().type(makeid(5))
		cy.get('input').eq(1).clear().type(makeid(5))
		cy.get('input').eq(2).clear().type(makeemail())
		cy.get('select').eq(0).select(1)
		cy.get('input').eq(3).clear().type(12345)
		cy.get('button').contains('Save User').click()
	})

})
