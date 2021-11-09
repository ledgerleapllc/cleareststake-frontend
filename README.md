<p align="center">
	<img src="https://cleareststake.com/cleareststake.png" width="400">
</p>


## Cleareststake Frontend

### Install and Deploy

Relies on NextJS/Vercel, and NodeJS version 14+

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

You will need to add the following code to your server configuration under the VHOST path.

```
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]
```

Install packages and setup environment

```bash
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt install nodejs -y
npm install
npm run build-export
```

The above commands will build **out/** on site using the variables from your .env.production file.
