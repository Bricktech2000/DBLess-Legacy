# DBLess

_A hash-based, database-less password manager_

## Overview

This program takes a user's master password through a hash function to generate a unique secure password for any website they visit.

Two versions of the password manager are included in this repository: a command-line version in Python and a web-based version in JavaScript.

## Web-Based Version

The web version of the password manager is currently live at [https://dbless.emilien.ca/](https://dbless.emilien.ca/).

### Requirements

- A web browser
- Node JS and npm

### Setup

```bash
cd web/
npm install
```

### Getting Started

To get started with the password manager, first run the development server:

```bash
cd web/
npm install
npm run dev -- -p 3000
```

Then, navigate to [http://localhost:3000](http://localhost:3000) to see the live website.

### Deployment

To deploy the password manager, build the project and run the server:

```bash
cd web/
npm install
npm run build
npm start -- -p 3000
```

Then, navigate to [http://localhost:3000](http://localhost:3000) to see the live website.

### Usage

Below is an example on how to use the web version of the program.

Click the _Upload Token_ button and upload the file you wish to use as a token. It used as to equip the password manager with two-factor authentication.

When the token has been uploaded, click the bookmark icon to save it in your browser's local storage. Alternatively, click the link button to copy a direct link to the password manager with your token included. This can be used to create a QR code that will load a token automatically, for instance.

Fill in the input fields with the following information:

- `Service`: the name of the service you wish to log into
- `Username`: the username used to log in
- `Master Password`: your master password

Finally, click the _Copy to Clipboard_ button to copy the password to your clipboard.

## Command-Line Version

### Requirements

- Python 3

### Setup

```bash
pip3 install pyperclip
```

### Usage

Before running the program, create a file called `token` in `/console` and put a token in it. It is used as to equip the password manager with two-factor authentication.

```bash
cd console/
python3 run.py
```

The program will then prompt you for the following information:

- `Service`: the name of the service you wish to log into
- `Username`: the username used to log in
- `Master Password`: your master password
- `[C]opy, [P]rint, [A]bort:`: the action you wish to take
