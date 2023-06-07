git fetch -av
git checkout publish
git rebase main
npm install
npm run build
rm .gitignore
touch .nojekyll
git add .nojekyll
git add public/*
git add public/**/*
git add node_modules/vue/dist/vue.esm-browser.js
git commit -m "publish"
git push -f
git checkout main
git restore .gitignore
git checkout publish -- node_modules/vue/dist/vue.esm-browser.js
git reset node_modules/vue/dist/vue.esm-browser.js
