<p align="center">
	<img src="https://cleareststake.com/cleareststake.png" width="400">
</p>


## Cleareststake Frontend

Administration portal for fund management of LP users. This is the frontend repo of the portal. To see the backend repo, visit https://github.com/ledgerleapllc/cleareststake-backend

### Prerequisites

Relies on NextJS/Vercel, and NodeJS version 14+

You can find documentation on NextJS here https://github.com/vercel/next.js/

You can find documentation on NodeJS here https://github.com/nodejs/help

### Install and Deploy

First we need a server to use. Apache/Nginx

```bash
sudo apt -y install apache2
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
sudo apt-get update
```

Setup the repo according to our VHOST path. Note, the actual VHOST path in this case should be set to **/var/www/cleareststake-frontend/out**

```bash
cd /var/www/
git clone https://github.com/ledgerleapllc/cleareststake-frontend
cd cleareststake-frontend
```

You will need to add the following code to your server configuration under the VHOST path under the Directory tag.

```
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]
```

Install packages and setup environment. You will need to modify **.env.production** variables to fit the server on which you're deploying.

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt install nodejs -y
npm install
npm run build-export
```

If ```npm install``` fails, then try ```npm install --legacy-peer-deps``` instead.

If ```npm build-export``` fails, then try running ``` npm run lint-fix ``` beforehand.

The above commands will build **out/** on site using the variables from your .env.production file.

### Usage Guide

For full functionality we recommend adding a key for Sendgrid and a Coin Market Cap API key to support all features.

**Start here -**

After deployment of the portal, log in with the admin code.

Next, you will want to invite your first user (LP) via the Add User button. Enter a name, last name, email, starting balance, and select whether or not the use in "In Fund." This last selection allows tracking Fund LPs separate from other users who are just staking to a given node.

In the live version (with the mailer keys added - we recommend sendgrid) the user will get an email. They will set a password and can then log in to their portal.

Users can see their current holdings, ask questions to admin, request a withdrawal, and track metrics such as all transactions and inflation transactions. They can also update their own email and password. Most LP user functions are designed to give transparency to the user because they are limited in what they can manage. ClearestStake is primary management software for funds and staking provider so most functionality is on the management side of the portal.

Back on the admin side of the portal the admin has further functions available now that a user is active.

* Admins can click into this user to see their transactions, resend invites, toggle them as a fund user (or out of the fund) and review security information such as IP logging.

* Admins can download the tables via CSV for audits.

* Admins can reset passwords for users.

* Admins can "Update for Inflation" which is designed to be a monthly reconciliation process that will attached any new token balance, defined as tokens in excess of the current total, to EVERY user in portions pro-rata to their current holdings. This is an essential function of the portal. It is accurate to 6 decimal places to maintain proper balances even at very large token balances.

* Admins can "Process Deposit" which will add tokens to a single user and re-tally the  percentages of the total for later "Update for Inflation" actions.

* Admins can "Process Withdrawal" which will subtract tokens from a single user and re-tally the  percentages of the total for later "Update for Inflation" actions.

* Admins can process a "Fund Sale" which calculates a pro-rate removal of a number of tokens from Fund Users ONLY without changing the totals for non-fund (staking provider) users.

**Other notes -**

These features were scoped and determined to be the essential features needed for fund management. All tables are optimized to show the needed information for accounting from the point of view of a staking provider or fund manager. Email any questions to team@ledgerleap.com.

### Testing

We use Cypress for testing the portal's critical functionality. In order to run the test suite, you will need to open **cypress.json** and enter your credentials. Then after a successful build, **npm run cypress** for a headless unit test, or **npm run cypress-open** for a more detailed test interface.

Note: cypress must be run from a server with an xserver. Also please make sure you are running cypress fresh without any additional users and transaction information, as it may conflict with the preset rules by which the test suite is guided. Also please ensure dependencies are installed, as per Cypress documentation https://docs.cypress.io/guides/continuous-integration/introduction#Dependencies:

```
sudo apt install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
```

Example cypress.json:
```
{
	"baseUrl": "http://cleareststake.localhost",
	"env": {
		"DEV_EMAIL": "test@example.com",
		"ADMIN_LOGIN_EMAIL": "admin@example.com",
		"ADMIN_LOGIN_PASSWORD": "password"
	}
}

```
then,

```bash
npm run cypress
```
