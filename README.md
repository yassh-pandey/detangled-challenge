## Requirements Specified
We have a backend with a single API call which returns a list of events. You can see and consume data at

http://detangled.in/develop/714269dc-31e5-4684-9fcb-d9863685e6ff/events

This is a testing URL you can use for your test project development. You would
be doing CRUD operations against this URL. N.B. I am using a new production deployment setup so there's a chance that the service fails or that you have data loss. If either thing happens, just email me and I'll reset all your data and restart the service.

The URL returns a list of `event` items. Each item has the following fields.
id: number
destination: string
start: datetime
duration: number
comments: string

Standard REST phrasing is possible. For example making a DELETE call against http://detangled.in/develop/714269dc-31e5-4684-9fcb-d9863685e6ff/events/:id would result in the server deleting this data.

You have to build a two column view. The left column of the view shows the list of `trip` objects as cards. The card title is the `destination` string and contents of the card are the start date, duration and comments. Only the destination and comments are editable in the card. Edits made to the items are persisted to the backend by making PUT calls against the URL with the relevant ID suffixed. The card should be deletable (trash-can icon for example) and should correspondingly delete the trip from the backend using the URL as described above.

The right side of the view shows a scrollable calendar. The dates on the calendar corresponding to a `trip` are highlighted with a background color.

## NOTE : This API was provided to me by a third party so it may no longer work at a later point in time. Therefore go to fetchURL.js file inside src folder and edit the URL being exported from this file according to your needs to make the application work. If the URL endpoint provides data in the specified format then application will work fine.

## The API should return this kind of data:
- click on the image for a better view if it's not readable <br /> <br /> 
![API response](https://github.com/yassh-pandey/detangled-challenge/blob/master/detangledAPI.png)

# A sample of how the UI looks:
![UI gif](https://github.com/yassh-pandey/detangled-challenge/blob/master/WebAppGif.gif)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
