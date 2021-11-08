<p align="center">
	<img src="https://cleareststake.com/cleareststake.png" width="400">
</p>


## Cleareststake Frontend

### Install and Deploy

Relies on NextJS/Vercel, and NodeJS version 14+

```bash
sudo apt -y install apache2
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
sudo apt -y install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install -y php7.4
sudo apt-get install -y php7.4-{bcmath,bz2,intl,gd,mbstring,mysql,zip,common,curl,xml}
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer
php -r "unlink('composer-setup.php');"
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

### Contributing

Fork and create a PR if you find and want to provide improvements.

For security related issues, please email thomas@ledgerleap.com