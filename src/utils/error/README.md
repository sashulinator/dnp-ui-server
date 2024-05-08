# utils/error

## subtree

### pull/push

```bash
# Push
git subtree push --prefix=src/utils/error utils-error master
# Pull
git subtree pull --prefix=src/utils/error utils-error master
# Force
git push utils-error `git subtree split --prefix=src/utils/error @`:master --force
```

### Add to your project

1. Add a repository alias `git remote add utils-error git@github.com:sashulinator/utils-error.git`
2. To check a list of aliases `git remote -v`, you must see `utils-error`
3. Check that your project has no changes
4. run `git subtree add --prefix=src/utils/error utils-error master`
