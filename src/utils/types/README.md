# utils/types

## subtree

### pull/push

```bash
# Push
git subtree push --prefix=src/utils/types utils-types master
# Pull
git subtree pull --prefix=src/utils/types utils-types master
# Force
git push utils-types `git subtree split --prefix=src/utils/types @`:master --force
```

### diff

```
git --no-pager diff utils-types/master master:src/utils/types
```

### Add to your project

1. Add a repository alias `git remote add utils-types git@github.com:sashulinator/utils-types.git`
2. To check a list of aliases `git remote -v`, you must see `utils-types`
3. Check that your project has no changes
4. run `git subtree add --prefix=src/utils/types utils-types master`
