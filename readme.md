#### nodejs api for my pwa-guide project
You can use this for any project

Generate vapid keys
`npm run web-push generate-vapid-keys --json`

Run the app
`nodemon app`

If you got error MismatchSenderId
make sure you have the same public id in
front end : pwa-guide app.js line 71
same as 
back end : pwa-api app.js line 83
