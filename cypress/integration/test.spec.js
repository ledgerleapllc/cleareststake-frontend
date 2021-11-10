const dev_email = Cypress.env('DEV_EMAIL');
const do_newuser = false;

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

function makepw() {
	var result = '';
	var uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var lowers = 'abcdefghijklmnopqrstuvwxyz';
	var nums = '1234567890';
	var specials = '!@#$%^&*()_+';
	var uppers_length = uppers.length;
	var lowers_length = lowers.length;
	var nums_length = nums.length;
	var specials_length = specials.length;
	for(var i = 0; i < 3; i++) {
		result += uppers.charAt(Math.floor(Math.random() * uppers_length));
		result += lowers.charAt(Math.floor(Math.random() * lowers_length));
		result += nums.charAt(Math.floor(Math.random() * nums_length));
		result += specials.charAt(Math.floor(Math.random() * specials_length));
	}
	return result;
}

describe('Full test of critical functionality', () => {
	let total_token_balance = 0

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
		cy.wait(2000)
	})

	it('should get total_token_balance', () => {
		cy.get('h2').eq(1).then((e) => {
			total_token_balance = parseInt(e.text().replace(',', ''))
			console.log(total_token_balance);
		})
	})

	if(do_newuser) {
		it('should add user', () => {
			cy.wait(2000)
			cy.get('a').contains('Add User').click()
			cy.get('input').eq(0).clear().type(makeid(5))
			cy.get('input').eq(1).clear().type('testuser')
			cy.get('input').eq(2).clear().type(makeemail())
			cy.get('select').eq(0).select(1)
			cy.get('input').eq(3).clear().type(12345)
			cy.get('button').contains('Save User').click()
		})

		it('should add fund user', () => {
			cy.wait(2000)
			cy.get('a').contains('Add User').click()
			cy.get('input').eq(0).clear().type(makeid(5))
			cy.get('input').eq(1).clear().type('testfunduser')
			cy.get('input').eq(2).clear().type(makeemail())
			cy.get('select').eq(0).select(2)
			cy.get('input').eq(3).clear().type(12345)
			cy.get('button').contains('Save User').click()
		})
	}

	console.log(total_token_balance);

	it('should reset password', () => {
		cy.wait(2000)
		cy.get('a').contains('Reset Password').eq(0).click()
		let new_pw = makepw()
		cy.get('input:first').clear().type(new_pw)
		cy.get('input').eq(1).clear().type(new_pw)
		cy.get('a').contains('Reset Password').eq(0).click()
	})

	it('should update for inflation by 50 tokens', () => {
		cy.wait(2000)
		cy.get('a').contains('Update for Inflation').click()
		cy.get('input:first').clear().type(total_token_balance + 50)
		cy.get('button').contains('Submit').click()
	})

	it('should process a deposit', () => {
		cy.wait(2000)
		cy.get('a').contains('Process Deposit').click()
		cy.get('select').eq(0).select(1)
		cy.wait(100)
		cy.get('input:first').clear().type(60)
		cy.get('a').contains('Submit').click()
	})

	it('should process a withdraw', () => {
		cy.wait(2000)
		cy.get('a').contains('Process Withdraw').click()
		cy.get('select').eq(0).select(1)
		cy.wait(100)
		cy.get('input:first').clear().type(10)
		cy.get('a').contains('Submit').click()
	})

	it('should process a fund sale', () => {
		cy.wait(2000)
		cy.get('a').contains('Fund Sale').click()
		cy.get('input:first').clear().type(45)
		cy.get('input[type="checkbox"]').eq(0).check()
		cy.get('button').contains('Next').eq(0).click()
		cy.get('input:first').clear().type(0.125)
		cy.get('button').contains('Confirm').eq(0).click()
		cy.wait(500)
		cy.get('button').contains('Back').eq(0).click()
	})
})
