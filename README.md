# LittleMD
a markdown app via nwjs

### features

- updated parser from marked
- code highlight
- support emoji
- upload file via qiniu
- export html && pdf

### for developers

1. `npm install`
2. move changed_node_modules files to cover node_modules files
3. if you want to use qiniu upload, change `config.example.js` to `config.js`
4. open nwjs.app to use the app
5. add your code and `npm run pack` to build a new app which locates at build directory
