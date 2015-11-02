# comp3001

## Setup

### Prerequisites

This project is based on [Node.js](https://nodejs.org/en/), so please install that first.

You will then need to ensure `grunt` is installed globally.

```bash
(sudo) npm install -g grunt-cli
```

If using generator-polynode, follow these steps additionally.

```bash
(sudo) npm install -g yo
(sudo) npm install -g generator-polynode@0.2.0-beta
```

### Installing Project Dependencies

 1. Clone the repository
 2. Install dependencies
 3. Build the project

```bash
git clone https://github.com/KK578/comp3001.git
cd comp3001
npm install
grunt
```

## Running/Developing

After setting the project up:

 1. Run the project's server
 2. Navigate to the webpage on localhost

    Default Port: 5000
    Default BrowserSync Port: 3000

```bash
grunt serve
# Use browser to navigate to localhost:5000, or localhost:3000 if developing
```

BrowserSync is a secondary server which runs during development and reloads the webpage when files are edited. But for CSS, it injects into the page without a refresh to speed up restyling.

### Testing

Create new tests in `browser/test/{element-name}`, and run tests by navigating to `localhost:3000/test'.
